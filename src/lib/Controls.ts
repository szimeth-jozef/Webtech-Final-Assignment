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