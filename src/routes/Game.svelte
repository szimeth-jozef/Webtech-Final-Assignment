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

    Promise.all([
        fetchLevels(params.difficulty),
        fetchSpriteSheet("spritesheet.png")
    ])
    .then(([levelsJsonData, spriteSheetImage]) => {
        loading = false
        // console.log(levelsJsonData)
        document.getElementById("spritesheet").appendChild(spriteSheetImage)
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