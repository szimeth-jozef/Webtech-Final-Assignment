import type Ball from "./Ball"
import { Direction } from "./Ball"
import type Board from "./Board"

const DEVICE_ORIENTATION_RATE_LIMIT = 20

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

    const treshhold = 30

    if (pitch > treshhold + 30) {
        emitDebouncedKeydownEvent("ArrowDown", "down")
    }
    else if (pitch < -treshhold + 30) {
        emitDebouncedKeydownEvent("ArrowUp", "up")
    }
    else if (roll > treshhold) {
        emitDebouncedKeydownEvent("ArrowRight", "right")
    }
    else if (roll < -treshhold) {
        emitDebouncedKeydownEvent("ArrowLeft", "left")
    }
    else {
        // Reset every direction counter
        const event = createKeyboardEvent("keyup", "NeutralTilt")
        document.dispatchEvent(event);
    }
}

function emitDebouncedKeydownEvent(code: string, dir: string) {
    // If direction is not set let through
    if (window.deviceorientaitonratecounts[dir] === null) {
        window.deviceorientaitonratecounts[dir] = 0
        const event = createKeyboardEvent("keydown", code)
        document.dispatchEvent(event)
    }
    else {
        // Reset every direction counter except down
        resetDirectionsExcept(dir)

        if (++window.deviceorientaitonratecounts[dir] <= DEVICE_ORIENTATION_RATE_LIMIT) {
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
            const h1 = document.createElement("h1")
            h1.textContent = "You won!"
            h1.style.position = "absolute"
            document.body.appendChild(h1)
            // TODO: SOMEHOW GET HERE levelServer current level and call finishLevel(level)
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

function tileOnMouseDownHandle(mouseEvent: MouseEvent, board: Board) {
    const tileElement = mouseEvent.target as HTMLImageElement

    const tempTileClone = tileElement.cloneNode() as HTMLImageElement
    tempTileClone.removeAttribute("id")
    tempTileClone.style.position = "absolute"
    tempTileClone.style.opacity = "0.5"
    tempTileClone.style.cursor = "grabbing"
    tempTileClone.ondragstart = () => false
    
    if (tileElement.getAttribute("id").length === 1) tileElement.style.visibility = "hidden"
    document.body.appendChild(tempTileClone)

    function moveAt(pageX: number, pageY: number) {
        tempTileClone.style.left = pageX - tempTileClone.offsetWidth / 2 + 'px'
        tempTileClone.style.top = pageY - tempTileClone.offsetHeight / 2 + 'px'
    }

    moveAt(mouseEvent.pageX, mouseEvent.pageY)

    let currentDroppable = null

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY)

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

        if (currentDroppable) {
            // Swap currentDroppable with tileElement
            // 1. swap id's
            // 2. Remove and/or add some classes idk yet)
            // 3. swap actual DOM elements
            // 4. Update board data structure (swap Tile's)
            // 5. Check if every empty tile is filled and if true enable roll button

            // 1. swap id's
            const targetId = currentDroppable.getAttribute("id")
            const draggedId = tileElement.getAttribute("id")

            currentDroppable.setAttribute("id", draggedId)
            tileElement.setAttribute("id", targetId)

            // 2. Remove and/or add some classes idk yet)
            currentDroppable.classList.remove("dropzone-hover")
            tileElement.classList.remove("dropzone-hover")

            // 3. swap actual DOM elements
            swapHTMLElements(currentDroppable, tileElement)

            // 4. Update board data structure (swap Tile's)
            board.replaceTiles(targetId, draggedId)
            board.printBoardState()

            // 5. Check if every empty tile is filled and if true enable roll button
            const button = document.getElementById("game-control-button") as HTMLButtonElement
            if (board.isEmptyFieldOnBoard()) {
                button.disabled = true
            }
            else {
                button.disabled = false
            }
        }
    }
}

function tileOnTouchStartHandle(touchEvent: TouchEvent, board: Board) {
    const tileElement = touchEvent.target as HTMLImageElement

    const tempTileClone = tileElement.cloneNode() as HTMLImageElement
    tempTileClone.removeAttribute("id")
    tempTileClone.style.position = "absolute"
    tempTileClone.style.opacity = "0.5"

    if (tileElement.getAttribute("id").length === 1) tileElement.style.visibility = "hidden"
    document.body.appendChild(tempTileClone)

    function moveAt(pageX: number, pageY: number) {
        tempTileClone.style.left = pageX - tempTileClone.offsetWidth / 2 + 'px'
        tempTileClone.style.top = pageY - tempTileClone.offsetHeight / 2 + 'px'
    }

    const primaryTouch = touchEvent.changedTouches[0]
    moveAt(primaryTouch.pageX, primaryTouch.pageY)

    let currentDroppable = null

    function onMouseMove(event) {
        const primaryTouch = event.changedTouches[0]
        moveAt(primaryTouch.pageX, primaryTouch.pageY)

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
    document.addEventListener('touchmove', onMouseMove)

    // (3) drop the tile, remove unneeded handlers
    tileElement.ontouchend = function() {
        document.removeEventListener('touchmove', onMouseMove)
        tileElement.ontouchend = null
        if (tileElement.getAttribute("id").length === 1) tileElement.style.visibility = "visible"
        tempTileClone.remove()

        if (currentDroppable) {
            // Swap currentDroppable with tileElement
            // 1. swap id's
            // 2. Remove and/or add some classes idk yet)
            // 3. swap actual DOM elements
            // 4. Update board data structure (swap Tile's)
            // 5. Check if every empty tile is filled and if true enable roll button

            // 1. swap id's
            const targetId = currentDroppable.getAttribute("id")
            const draggedId = tileElement.getAttribute("id")

            currentDroppable.setAttribute("id", draggedId)
            tileElement.setAttribute("id", targetId)

            // 2. Remove and/or add some classes idk yet)
            currentDroppable.classList.remove("dropzone-hover")
            tileElement.classList.remove("dropzone-hover")

            // 3. swap actual DOM elements
            swapHTMLElements(currentDroppable, tileElement)

            // 4. Update board data structure (swap Tile's)
            board.replaceTiles(targetId, draggedId)
            board.printBoardState()

            // 5. Check if every empty tile is filled and if true enable roll button
            const button = document.getElementById("game-control-button") as HTMLButtonElement
            if (board.isEmptyFieldOnBoard()) {
                button.disabled = true
            }
            else {
                button.disabled = false
            }
        }
    }
}

function swapHTMLElements(node1: HTMLElement, node2: HTMLElement) {
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
