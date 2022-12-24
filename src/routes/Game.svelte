<script lang="ts">
    import type { GamePropType } from '../types/props.type'

    import { setupControls } from '../lib/Controls'
    import { fetchLevels, fetchSpriteSheet } from '../lib/DependencyLoaders'
    import SpriteSheet from '../lib/SpriteSheet'
    import Loader from '../components/Loader.svelte'
    import Tile from '../lib/Tile'

    export let params: GamePropType

    let loading = true
    const SPRITE_SIZE = 60

    Promise.all([
        fetchLevels(params.difficulty),
        fetchSpriteSheet("spritesheet.png")
    ])
    .then(([levelsJsonData, spriteSheetImage]) => {
        loading = false

        const sprites = new SpriteSheet(spriteSheetImage, SPRITE_SIZE, SPRITE_SIZE)
        sprites.define("start", 0, 0)
        sprites.define("finish", 1, 0)
        sprites.define("straight-fixed", 2, 0)
        sprites.define("straight", 2, 1)
        sprites.define("corner-fixed", 3, 0)
        sprites.define("corner", 1, 1)
        sprites.define("boulder", 4, 0)
        sprites.define("none", 0, 1)

        setupControls()
        // document.getElementById("spritesheet").appendChild(spriteSheetImage)
        const tile = new Tile(
            sprites.get("start"),
            0,
            ""
        )
        document.getElementById("spritesheet").appendChild(tile.getHTMLElement())
        document.getElementById("spritesheet").appendChild(sprites.get("boulder"))
        document.getElementById("spritesheet").appendChild(sprites.get("corner"))
        document.getElementById("spritesheet").appendChild(sprites.get("corner-fixed"))
        document.getElementById("spritesheet").appendChild(sprites.get("straight"))
        document.getElementById("spritesheet").appendChild(sprites.get("straight-fixed"))
        document.getElementById("spritesheet").appendChild(sprites.get("none"))
        document.getElementById("spritesheet").appendChild(sprites.get("finish"))

        setTimeout(() => tile.rotate(90), 3000)
    })
    .catch(err => {
        loading = false
        console.error(`Error loading assests: ${err}`)
    })
</script>

<main>
    <Loader {loading} />

    <h1>Lets rooooock on {params.difficulty}!</h1>
    <h2 id="controls">None</h2>
    <div id="spritesheet"></div>
</main>

<style>
</style>