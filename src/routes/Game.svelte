<script lang="ts">
    import type { GamePropType } from '../types/props.type'
    import type { LevelDetails } from '../types/game.type';

    import Loader from '../components/Loader.svelte'
    import Level from '../components/Level.svelte'
    import NavBar from '../components/NavBar.svelte';

    import { onDeviceorientationHandler } from '../lib/Controls'
    import { fetchLevels, fetchTiles, fetchSpriteSheet } from '../lib/DependencyLoaders'
    import SpriteSheet from '../lib/SpriteSheet'
    import { onDestroy } from 'svelte'
    import LevelServer from '../lib/LevelServer'
    import { gameState } from '../stores/GameStore'

    export let params: GamePropType

    let loading = true
    let levelDetails: LevelDetails
    let sprites: SpriteSheet
    let levelServer: LevelServer
    let jsonLevelsArray: Array<any>
    let level: number

    Promise.all([
        fetchLevels(params.difficulty),
        fetchTiles(),
        fetchSpriteSheet("game/spritesheet.png")
    ])
    .then(([levelsJsonData, tilesJsonData, spriteSheetImage]) => {
        sprites = SpriteSheet.createFromJson(spriteSheetImage, tilesJsonData)

        const allLevels = levelsJsonData.levels.map((_: any, index: number) => index)
        levelServer = new LevelServer(params.difficulty, allLevels)
        level = levelServer.nextLevel()
        gameState.set({
            levelNumber: level,
            levelData: levelsJsonData.levels[level],
            isLevelLast: levelServer.isLastLevel()
        })

        jsonLevelsArray = levelsJsonData.levels
        levelDetails = {
            difficulty: params.difficulty,
            gameBoardSize: levelsJsonData.gameBoardSize,
            tileDimensions: levelsJsonData.tileDimensions
        }

        loading = false
    })
    .catch(err => {
        loading = false
        console.error(`Error loading assests: ${err}`)
    })

    const onNextLevelClicked = () => {
        gameState.update((lvl) => {
            lvl.levelNumber = levelServer.nextLevel()
            lvl.levelData = jsonLevelsArray[lvl.levelNumber]
            lvl.isLevelLast = levelServer.isLastLevel()
            return lvl
        })
    }

    const onCurrentLevelFinished = (event: CustomEvent) => {
        console.log("[DEBUG]: Finished level", event.detail.level)
        levelServer.finishLevel(event.detail.level)
    }

    onDestroy(() => {
        console.log("Game component destroyed")
        window.removeEventListener("deviceorientation", onDeviceorientationHandler)
    })
</script>

<NavBar text={`Úloha ${level + 1}`}/>
<main class="page-container">
    {#if loading}
        <Loader />
    {:else}
    <Level {sprites}
           {levelDetails}
           on:nextlevel={onNextLevelClicked}
           on:levelfinished={onCurrentLevelFinished} />
    {/if}
</main>
