<script lang="ts">
    import type { GamePropType } from '../types/props.type'

    export let params: GamePropType

    let loading = true

    async function fetchLevels(difficulty:string) {
        const url = `/levels/${difficulty}.json`

        const response = await fetch(url)
        if (response.ok) {
            return await response.json()
        }

        return Promise.reject(response.statusText)
    }

    function fetchSpriteSheet(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => resolve(image)
            // ==== Artificial delay 5 seconds ====
            // image.onload = () => setTimeout(() => {
            //     console.log("Image loaded")
            //     resolve(image)
            // }, 5000)
            // ====================================
            image.onerror = () => reject(`Couldn't load sprite-sheet from [${url}]`)
            image.src = url
        })
    }

    function startGame() {
        window.addEventListener("deviceorientation", event => {
            const pitch = event.beta
            const roll = event.gamma

            const treshhold = 30

            if (pitch > treshhold + 30) {
                // Simulate a "up" arrow key press
                const event = new KeyboardEvent("keydown", {
                    bubbles: true, cancelable: true, code: "ArrowDown"
                })
                document.dispatchEvent(event)
            }
            else if (pitch < -treshhold + 30) {
                // Simulate a "down" arrow key press
                const event = new KeyboardEvent("keydown", {
                    bubbles: true, cancelable: true, code: "ArrowUp"
                });
                document.dispatchEvent(event);
            }
            else if (roll > treshhold) {
                // Simulate a "right" arrow key press
                const event = new KeyboardEvent("keydown", {
                    bubbles: true, cancelable: true, code: "ArrowRight"
                });
                document.dispatchEvent(event);
            }
            else if (roll < -treshhold) {
                // Simulate a "left" arrow key press
                const event = new KeyboardEvent("keydown", {
                    bubbles: true, cancelable: true, code: "ArrowLeft"
                });
                document.dispatchEvent(event);
            }
            else {
                // Experimental "tilt" released event
                const event = new KeyboardEvent("keyup", {
                    bubbles: true, cancelable: true, code: "NeutralTilt"
                });
                document.dispatchEvent(event);
            }
        });

        window.addEventListener("keydown", event => {
            switch (event.code) {
                case "ArrowUp":
                    document.getElementById("controls").innerText = "UP"
                    break
                case "ArrowDown":
                    document.getElementById("controls").innerText = "DOWN"
                    break
                case "ArrowRight":
                    document.getElementById("controls").innerText = "RIGHT"
                    break
                case "ArrowLeft":
                    document.getElementById("controls").innerText = "LEFT"
                    break
            }
            event.preventDefault()
        })

        window.addEventListener("keyup", event => {
            if (event.code === "NeutralTilt" ||
                event.code === "ArrowUp" ||
                event.code === "ArrowDown" ||
                event.code === "ArrowRight" ||
                event.code === "ArrowLeft") {
                document.getElementById("controls").innerText = "None"
            }

            event.preventDefault()
        })
    }

    Promise.all([
        fetchLevels(params.difficulty),
        fetchSpriteSheet("spritesheet.png")
    ])
    .then(([levelsJsonData, spriteSheetImage]) => {
        loading = false
        // console.log(levelsJsonData)
        document.getElementById("spritesheet").appendChild(spriteSheetImage)
        startGame()
    })
    .catch(err => {
        loading = false
        console.error(`Error loading assests: ${err}`)
    })

</script>

<main>
    {#if loading}
        <div class="loader-container">
            <div class="loader"></div>
        </div>
    {/if}

    <h1>Lets rooooock on {params.difficulty}!</h1>
    <h2 id="controls">None</h2>
    <div id="spritesheet"></div>
</main>

<style>
    .loader {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 200px;
        height: 200px;
        border: 20px solid;
        border-top-color: rgb(230, 62, 62);
        border-bottom-color: rgb(90, 204, 90);
        border-right-color: rgb(73, 52, 167);
        border-left-color: rgb(240, 203, 41);
        border-radius: 50%;
        animation: spin 2s infinite linear;
    }

    @keyframes spin {
        from {
            transform: translate(-50%,-50%) rotate(0deg);
        }
        to {
            transform: translate(-50%,-50%) rotate(360deg);
        }
    }

    .loader-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #242424;
    }
</style>