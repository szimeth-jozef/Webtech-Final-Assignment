<script lang="ts">
    import type { GamePropType } from '../types/props.type'

    import Loader from '../components/Loader.svelte'
    import Level from '../components/Level.svelte'

    import { onDeviceorientationHandler } from '../lib/Controls'
    import { fetchLevels, fetchTiles, fetchSpriteSheet } from '../lib/DependencyLoaders'
    import SpriteSheet from '../lib/SpriteSheet'
    import { onDestroy } from 'svelte'
    import LevelServer from '../lib/LevelServer'
    import { currentLevel } from '../stores/GameStore'

    export let params: GamePropType

    let loading = true
    let gameBoardSize: number
    let tileDimensions: number
    let sprites: SpriteSheet
    let levelServer: LevelServer
    let jsonLevelsArray: Array<any>

    Promise.all([
        fetchLevels(params.difficulty),
        fetchTiles(),
        fetchSpriteSheet("game/spritesheet.png")
    ])
    .then(([levelsJsonData, tilesJsonData, spriteSheetImage]) => {
        sprites = SpriteSheet.createFromJson(spriteSheetImage, tilesJsonData)

        const allLevels = levelsJsonData.levels.map((_: any, index: number) => index)
        levelServer = new LevelServer(params.difficulty, allLevels)
        const level = levelServer.nextLevel()
        currentLevel.set({
            number: level,
            data: levelsJsonData.levels[level]
        })

        jsonLevelsArray = levelsJsonData.levels
        gameBoardSize = levelsJsonData.gameBoardSize
        tileDimensions = levelsJsonData.tileDimensions

        loading = false
    })
    .catch(err => {
        loading = false
        console.error(`Error loading assests: ${err}`)
    })

    const onNextLevelClicked = () => {
        currentLevel.update((lvl) => {
            levelServer.finishLevel(lvl.number)
            lvl.number = levelServer.nextLevel()
            lvl.data = jsonLevelsArray[lvl.number]
            return lvl
        })
    }

    onDestroy(() => {
        console.log("Game component destroyed")
        window.removeEventListener("deviceorientation", onDeviceorientationHandler)
    })
</script>


{#if loading}
    <Loader />
{:else}
    <Level difficulty={params.difficulty} {gameBoardSize} {tileDimensions} {sprites} />
    <button on:click={onNextLevelClicked}>Next Level</button>
{/if}
