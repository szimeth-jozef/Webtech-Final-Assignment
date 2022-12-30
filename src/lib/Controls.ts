import { levelState } from "../stores/LevelStore"
import { mainButtonState } from "../stores/MainLevelControlButtonStore"
import type Ball from "./Ball"
import { Direction } from "./Ball"
import type Board from "./Board"

declare global {
    interface Window {
        deviceorientaitonratecounts: any
    }
}

function createKeyboardEvent(type: string, code: string) {
    return new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true,
        code: code
    })
}

function setupDeviceOrientationControlsEmitor() {
    window.deviceorientaitonratecounts = {
        up: null,
        down: null,
        left: null,
        right: null
    }

    window.addEventListener("deviceorientation", onDeviceorientationHandler)
}

export function onDeviceorientationHandler(event: DeviceOrientationEvent) {
    const pitch = event.beta
    const roll = event.gamma

    const TILT_TRESHOLD = 30
    const DEBOUNCE_LIMIT_RATE = 20

    if (pitch > TILT_TRESHOLD + 30) {
        emitDebouncedKeydownEvent("ArrowDown", "down", DEBOUNCE_LIMIT_RATE)
    }
    else if (pitch < -TILT_TRESHOLD + 30) {
        emitDebouncedKeydownEvent("ArrowUp", "up", DEBOUNCE_LIMIT_RATE)
    }
    else if (roll > TILT_TRESHOLD) {
        emitDebouncedKeydownEvent("ArrowRight", "right", DEBOUNCE_LIMIT_RATE)
    }
    else if (roll < -TILT_TRESHOLD) {
        emitDebouncedKeydownEvent("ArrowLeft", "left", DEBOUNCE_LIMIT_RATE)
    }
    else {
        // Reset every direction counter
        const event = createKeyboardEvent("keyup", "NeutralTilt")
        document.dispatchEvent(event);
    }
}

function emitDebouncedKeydownEvent(code: string, dir: string, limitRate: number) {
    // If direction is not set let through
    if (window.deviceorientaitonratecounts[dir] === null) {
        window.deviceorientaitonratecounts[dir] = 0
        const event = createKeyboardEvent("keydown", code)
        document.dispatchEvent(event)
    }
    else {
        // Reset every direction counter except down
        resetDirectionsExcept(dir)

        if (++window.deviceorientaitonratecounts[dir] <= limitRate) {
            return
        }
        window.deviceorientaitonratecounts[dir] = 0
        const event = createKeyboardEvent("keydown", code)
        document.dispatchEvent(event)
    }
}

function resetDirectionsExcept(exceptDir: string) {
    if (exceptDir !== "up") window["deviceorientaitonratecounts"].up = null
    if (exceptDir !== "down") window["deviceorientaitonratecounts"].down = null
    if (exceptDir !== "left") window["deviceorientaitonratecounts"].left = null
    if (exceptDir !== "right") window["deviceorientaitonratecounts"].right = null
}

export function setupControls(ball: Ball) {
    setupDeviceOrientationControlsEmitor()

    const onKeydownHandler = (event: KeyboardEvent) => {
        if (event.repeat) {
            return
        }

        switch (event.code) {
            case "ArrowUp":
                ball.moveBall(Direction.UP)
                event.preventDefault()
                break
            case "ArrowDown":
                ball.moveBall(Direction.DOWN)
                event.preventDefault()
                break
            case "ArrowRight":
                ball.moveBall(Direction.RIGHT)
                event.preventDefault()
                break
            case "ArrowLeft":
                ball.moveBall(Direction.LEFT)
                event.preventDefault()
                break
        }

        if (ball.isInFinish()) {
            window.removeEventListener("keydown", onKeydownHandler)
            levelState.update((lvlState) => {
                lvlState.isFinished = true
                lvlState.isTileMovementEnabled = false
                return lvlState
            })
        }
    }

    window.addEventListener("keydown", onKeydownHandler)
}

export function addTileMovementControls(board: Board) {
    addDesktopTileMovementConstrols(board)
    addMobileTileMovementConstrols(board)
}

function addDesktopTileMovementConstrols(board: Board) {
    for (let i = 0; i < board.gameBoardSize; i++) {
        for (let j = 0; j < board.gameBoardSize; j++) {
            const tile = board.getGameBoardItem(j, i)

            if (tile.isMovable()) {
                const tileElement = tile.tileHTMLElement

                tileElement.onmousedown = event => {
                    tileOnMouseDownHandle(event, board)
                }
            }
        }
    }

    for (let i = 0; i < board.pickBoardSize; i++) {
        const tile = board.getPickBoardItem(i)

        if (tile.isMovable()) {
            const tileElement = tile.tileHTMLElement

            tileElement.onmousedown = event => {
                tileOnMouseDownHandle(event, board)
            }
        }
    }
}

function addMobileTileMovementConstrols(board: Board) {
    for (let i = 0; i < board.gameBoardSize; i++) {
        for (let j = 0; j < board.gameBoardSize; j++) {
            const tile = board.getGameBoardItem(j, i)

            if (tile.isMovable()) {
                const tileElement = tile.tileHTMLElement

                tileElement.ontouchstart = event => {
                    tileOnTouchStartHandle(event, board)
                }
            }
        }
    }

    for (let i = 0; i < board.pickBoardSize; i++) {
        const tile = board.getPickBoardItem(i)

        if (tile.isMovable()) {
            const tileElement = tile.tileHTMLElement

            tileElement.ontouchstart = event => {
                tileOnTouchStartHandle(event, board)
            }
        }
    }
}

function moveElementAt(element: HTMLElement, event: Event) {
    let pageX: number, pageY: number

    if (event instanceof MouseEvent) {
        const mouseEvent = event as MouseEvent
        pageX = mouseEvent.pageX
        pageY = mouseEvent.pageY
    }
    else if (event instanceof TouchEvent) {
        const touchEvent = event as TouchEvent
        const primaryTouch = touchEvent.changedTouches[0]
        pageX = primaryTouch.pageX
        pageY = primaryTouch.pageY
    }
    else {
        console.warn(`Controls: Not supported event type [${event}}]`)
    }

    element.style.left = pageX - element.offsetWidth / 2 + 'px'
    element.style.top = pageY - element.offsetHeight / 2 + 'px'
}

function createGhostTileForDragging(originalTile: HTMLImageElement) {
    const ghostElement = originalTile.cloneNode() as HTMLImageElement
    ghostElement.removeAttribute("id")
    ghostElement.style.position = "absolute"
    ghostElement.style.opacity = "0.5"
    ghostElement.style.cursor = "grabbing"
    ghostElement.ondragstart = () => false

    // When dragging from pick hide original and when dragging from board leave visible
    if (originalTile.getAttribute("id").length === 1) {
        originalTile.style.visibility = "hidden"
    }

    return ghostElement
}

function tileOnMouseDownHandle(mouseEvent: MouseEvent, board: Board) {
    const tileElement = mouseEvent.target as HTMLImageElement

    const tempTileClone = createGhostTileForDragging(tileElement)
    document.body.appendChild(tempTileClone)

    moveElementAt(tempTileClone, mouseEvent)

    let currentDroppable: Element = null

    function onMouseMove(event: MouseEvent) {
        moveElementAt(tempTileClone, event)

        tempTileClone.hidden = true
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY)
        tempTileClone.hidden = false

        if (!elemBelow) return

        let droppableBelow = elemBelow.closest(".dropzone")
        if (currentDroppable != droppableBelow) {
            if (currentDroppable) { 
                // null when we were not over a droppable before this event
                leaveDroppable(currentDroppable)
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) { 
                // null if we're not coming over a droppable now
                // (maybe just left the droppable)
                enterDroppable(currentDroppable)
            }
        }
    }

    // (2) move the tile on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // (3) drop the tile, remove unneeded handlers
    tempTileClone.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        tempTileClone.onmouseup = null;
        if (tileElement.getAttribute("id").length === 1) tileElement.style.visibility = "visible"
        tempTileClone.remove()

        swapTilesAction(currentDroppable, tileElement, board)
    }
}

function tileOnTouchStartHandle(touchEvent: TouchEvent, board: Board) {
    const tileElement = touchEvent.target as HTMLImageElement

    const tempTileClone = createGhostTileForDragging(tileElement)
    document.body.appendChild(tempTileClone)

    moveElementAt(tempTileClone, touchEvent)

    let currentDroppable: Element = null

    function onTouchMove(event: TouchEvent) {
        moveElementAt(tempTileClone, event)
        
        const primaryTouch = event.changedTouches[0]
        tempTileClone.hidden = true
        let elemBelow = document.elementFromPoint(primaryTouch.clientX, primaryTouch.clientY)
        tempTileClone.hidden = false

        if (!elemBelow) return

        let droppableBelow = elemBelow.closest(".dropzone")
        if (currentDroppable != droppableBelow) {
            if (currentDroppable) { // null when we were not over a droppable before this event
                leaveDroppable(currentDroppable)
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) { // null if we're not coming over a droppable now
                // (maybe just left the droppable)
                enterDroppable(currentDroppable)
            }
        }
    }

    // (2) move the tile on mousemove
    document.addEventListener('touchmove', onTouchMove)

    // (3) drop the tile, remove unneeded handlers
    tileElement.ontouchend = function() {
        document.removeEventListener('touchmove', onTouchMove)
        tileElement.ontouchend = null
        if (tileElement.getAttribute("id").length === 1) tileElement.style.visibility = "visible"
        tempTileClone.remove()

        swapTilesAction(currentDroppable, tileElement, board)
    }
}

function swapTilesAction(targeted: Element, dragged: Element, board: Board) {
    if (!targeted) {
        return
    }

    // Swap targeted with dragged tile
    // 1. swap id's
    // 2. Remove and/or add some classes idk yet)
    // 3. swap actual DOM elements
    // 4. Update board data structure (swap Tile's)
    // 5. Check if every empty tile is filled and if true enable roll button

    // 1. swap id's
    const targetId = targeted.getAttribute("id")
    const draggedId = dragged.getAttribute("id")
    targeted.setAttribute("id", draggedId)
    dragged.setAttribute("id", targetId)

    // 2. Remove and/or add some classes idk yet)
    targeted.classList.remove("dropzone-hover")
    dragged.classList.remove("dropzone-hover")

    // 3. swap actual DOM elements
    swapHTMLElements(targeted, dragged)

    // 4. Update board data structure (swap Tile's)
    board.replaceTiles(targetId, draggedId)
    board.printBoardState()

    // 5. Check if every empty tile is filled and if true enable roll button
    mainButtonState.update(state => {
        state.isDisabled = board.isEmptyFieldOnBoard()
        return state
    })
}

function swapHTMLElements(node1: Element, node2: Element) {
    let afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    node1.replaceWith(node2);
    if (afterNode2 !== null && afterNode2.isEqualNode(node1)) {
        parent.insertBefore(node1, node2)
        return
    }
    parent.insertBefore(node1, afterNode2)
}

function enterDroppable(elem) {
    elem.classList.add("dropzone-hover")
}

function leaveDroppable(elem) {
    elem.classList.remove("dropzone-hover")
}
