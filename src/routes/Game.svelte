<script lang="ts">
    import type { GamePropType } from '../types/props.type'

    export let params: GamePropType

    const SPRITE_WIDTH = 60;
    const SPRITE_HEIGHT = 60;


    let loading = true

    async function fetchLevels(difficulty:string) {
        const url = `/levels/${difficulty}.json`

        const response = await fetch(url)
        if (response.ok) {
            return await response.json()
        }

        return Promise.reject(response.statusText)
    }

    function spritePositionToImagePosition(coord) {
        return {x: (coord.x * SPRITE_WIDTH), y: (coord.y *SPRITE_HEIGHT)}
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
        // document.getElementById("spritesheet").appendChild(spriteSheetImage)
         //console.log(levelsJsonData)
         //console.log(levelsJsonData[0].board)
        let grid=document.getElementById("grid");
        grid.style.maxWidth=(levelsJsonData[0].board.length*150).toString()+"px"
        levelsJsonData[0].board.forEach((line=>{ //TODO levelsJsonData[0] <<== robene len pre prvy level
            line.forEach((tileData)=>{
                let canvas=document.createElement("canvas");
                canvas.width=150
                canvas.height=150

                canvas.style.transform="rotate("+tileData.orientation+"deg)";
                let pos=spritePositionToImagePosition(tileData.tile)
                canvas.getContext("2d").drawImage(spriteSheetImage,pos.x,pos.y,SPRITE_WIDTH,SPRITE_HEIGHT,0,0,150,150)

                grid.appendChild(canvas)
            })
        }))
    })
    .catch(err => {
        loading = false
        console.error(`Error loading assests: ${err}`)
    })

</script>

<main style="width: 1500px">
    {#if loading}
        <div class="loader-container">
            <div class="loader"></div>
        </div>
    {/if}

    <h1>Lets rooooock on {params.difficulty}!</h1>
<!--    <div id="spritesheet"></div>-->
    <div id="grid"></div>
</main>

<style>
    #grid{
        margin:auto;
        display: grid;
        grid-gap: 0px;
        grid-template-columns: repeat(6,auto);
        grid-template-rows: repeat(6,auto);
        grid-auto-flow: row;
    }




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