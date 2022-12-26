import type Board from "./Board"

function createKeyboardEvent(type: string, code: string) {
    return new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true,
        code: code
    })
}

function setupDeviceOrientationControlsEmitor() {
    window.addEventListener("deviceorientation", event => {
        const pitch = event.beta
        const roll = event.gamma

        const treshhold = 30

        if (pitch > treshhold + 30) {
            const event = createKeyboardEvent("keydown", "ArrowDown")
            document.dispatchEvent(event)
        }
        else if (pitch < -treshhold + 30) {
            const event = createKeyboardEvent("keydown", "ArrowUp")
            document.dispatchEvent(event);
        }
        else if (roll > treshhold) {
            const event = createKeyboardEvent("keydown", "ArrowRight")
            document.dispatchEvent(event);
        }
        else if (roll < -treshhold) {
            const event = createKeyboardEvent("keydown", "ArrowLeft")
            document.dispatchEvent(event);
        }
        else {
            const event = createKeyboardEvent("keyup", "NeutralTilt")
            document.dispatchEvent(event);
        }
    })
}

export function setupControls() {
    setupDeviceOrientationControlsEmitor()

    // Temporary patchwork for demonstration purposes

    window.addEventListener("keydown", event => {
        switch (event.code) {
            case "ArrowUp":
                document.getElementById("controls").innerText = "UP"
                event.preventDefault()
                break
            case "ArrowDown":
                document.getElementById("controls").innerText = "DOWN"
                event.preventDefault()
                break
            case "ArrowRight":
                document.getElementById("controls").innerText = "RIGHT"
                event.preventDefault()
                break
            case "ArrowLeft":
                document.getElementById("controls").innerText = "LEFT"
                event.preventDefault()
                break
        }
    })

    window.addEventListener("keyup", event => {
        if (event.code === "NeutralTilt" ||
            event.code === "ArrowUp" ||
            event.code === "ArrowDown" ||
            event.code === "ArrowRight" ||
            event.code === "ArrowLeft") {
            document.getElementById("controls").innerText = "None"
            event.preventDefault()
        }
    })
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
                console.log("Adding onmousedown")
                const tileElement = tile.getHTMLElement()

                tileElement.onmousedown = event => {
                    tileOnMouseDownHandle(event, board)
                }
            }
        }
    }

    for (let i = 0; i < board.pickBoardSize; i++) {
        const tile = board.getPickBoardItem(i)

        if (tile.isMovable()) {
            console.log("Adding onmousedown")
            const tileElement = tile.getHTMLElement()

            tileElement.onmousedown = event => {
                tileOnMouseDownHandle(event, board)
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
    tempTileClone.ondragstart = () => false
    
    if (tileElement.getAttribute("id").length === 1) tileElement.style.visibility = "hidden"
    document.body.appendChild(tempTileClone)
    
    function moveAt(pageX, pageY) {
        tempTileClone.style.left = pageX - tempTileClone.offsetWidth / 2 + 'px';
        tempTileClone.style.top = pageY - tempTileClone.offsetHeight / 2 + 'px';
    }

    moveAt(mouseEvent.pageX, mouseEvent.pageY);

    let currentDroppable = null

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        tempTileClone.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        tempTileClone.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest(".dropzone");
        if (currentDroppable != droppableBelow) {
            if (currentDroppable) { 
                // null when we were not over a droppable before this event
                leaveDroppable(currentDroppable);
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) { 
                // null if we're not coming over a droppable now
                // (maybe just left the droppable)
                enterDroppable(currentDroppable);
            }
        }
    }

    // (2) move the tile on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // (3) drop the tile, remove unneeded handlers
    tempTileClone.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        tileElement.onmouseup = null;
        if (tileElement.getAttribute("id").length === 1) tileElement.style.visibility = "visible"
        tempTileClone.remove()

        console.log(currentDroppable)
        if (currentDroppable) {
            // Swap currentDroppable with tileElement
            // 1. swap id's
            // 2. Remove and/or add some classes idk yet)
            // 3. swap actual DOM elements
            // 4. Update board data structure (swap Tile's)

            // 1. swap id's
            const targetId = currentDroppable.getAttribute("id")
            const draggedId = tileElement.getAttribute("id")

            currentDroppable.setAttribute("id", draggedId)
            tileElement.setAttribute("id", targetId)

            // 2. Remove and/or add some classes idk yet)
            currentDroppable.classList.remove("dropzone-hover")
            tileElement.classList.remove("dropzone-hover")

            // 3. swap actual DOM elements
            // currentDroppable.parentNode.replaceChild(tileElement, currentDroppable);
            // tileElement.parentNode.replaceChild(currentDroppable, tileElement);
            swap(currentDroppable, tileElement)

        }
    };
}

function swap(node1, node2) {
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
}

function enterDroppable(elem) {
    elem.classList.add("dropzone-hover")
}

function leaveDroppable(elem) {
    elem.classList.remove("dropzone-hover")
}

function addMobileTileMovementConstrols(board: Board) {}