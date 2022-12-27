<script lang="ts">
    import type { GamePropType } from '../types/props.type'

    import { addTileMovementControls, setupControls } from '../lib/Controls'
    import { fetchLevels, fetchSpriteSheet } from '../lib/DependencyLoaders'
    import SpriteSheet from '../lib/SpriteSheet'
    import Loader from '../components/Loader.svelte'
    import { createBoard } from '../lib/Levels';
    import Ball from '../lib/Ball';

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
        sprites.define("straightFixed", 2, 0)
        sprites.define("straight", 2, 1)
        sprites.define("cornerFixed", 3, 0)
        sprites.define("corner", 1, 1)
        sprites.define("boulder", 4, 0)
        sprites.define("none", 0, 1)
        sprites.define("tree", 4, 1)
        sprites.define("ball", 3, 1)

        const board = createBoard(levelsJsonData, sprites)

        // set css variables
        const root = document.documentElement
        root.style.setProperty("--game-board-grid-size", levelsJsonData.gameBoardSizes)
        root.style.setProperty("--game-board-grid-item-size", `${levelsJsonData.tileDimensions}px`)

        addTileMovementControls(board)

        const gameBoardcontainer: HTMLDivElement = document.querySelector(".game-board")
        const pickBoardContainer: HTMLDivElement = document.querySelector(".pick-board")
        board.populateGameBoardContainer(gameBoardcontainer)
        board.populatePickBoardContainer(pickBoardContainer)

        const ballImg = sprites.get("ball", levelsJsonData.tileDimensions)
        const ball = new Ball(board, gameBoardcontainer, ballImg)

        setupControls(ball)

        const rollBallButton = document.getElementById("ball-roll")
        rollBallButton.addEventListener("click", event => {
            board.toggleTileMovementControl()

            if (board.isInEditMode) {
                ball.placeBallAtStart()
                rollBallButton.textContent = "Edit Tiles"
            }
            else {
                rollBallButton.textContent = "Roll The Ball"
                ball.removeBallFromBoard()
            }
        })

    })
    .catch(err => {
        loading = false
        console.error(`Error loading assests: ${err}`)
    })
</script>


<Loader {loading} />
<p>Difficulty: {params.difficulty} | Level 1</p>
<h2 class="debug-info">DEBUG-INFO[ball-crtl]: <span id="controls">None</span></h2>
<div id="top-control-panel">
    <button class="game-button__secondary">Nápoveda</button>
    <button class="game-button__secondary">Riešenie</button>
</div>

<div class="game-board"></div>
<button id="ball-roll" class="game-button__primary" disabled>Roll The Ball</button>
<div class="pick-board-background">
    <div class="pick-board"></div>
</div>


<style>
    :root {
        --game-board-grid-size: 6;  /* Set from JS */
        --game-board-grid-item-size: 60px;  /* Set from JS */
        --pick-board-grid-size: 5;  /* Fixed to 5 for now */
        --pick-board-background-color: brown;
    }

    :global(img.draggable) {
        cursor: grab;
    }

    /* Dropzone hover style */
    :global(img.dropzone-hover) {
        filter: sepia(0.75);
        transition: 0.25s filter ease;
    }

    #top-control-panel {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 1rem;
    }

    div.game-board {
        position: relative;
        display: grid;
        grid-template-columns: repeat(var(--game-board-grid-size), 1fr);
        max-width: calc(var(--game-board-grid-size) * var(--game-board-grid-item-size));
        margin: 0 auto;
    }

    div.pick-board-background {
        display: grid;
        justify-content: center;
        align-items: center;
        background-color: var(--pick-board-background-color);
        max-width: calc(var(--game-board-grid-size) * var(--game-board-grid-item-size));
    }

    div.pick-board {
        display: grid;
        grid-template-columns: repeat(var(--pick-board-grid-size), 1fr);
        /* max-width: calc(
            var(--pick-board-grid-size) * var(--game-board-grid-item-size) +
            calc(var(--pick-board-grid-size) - 1) * 0.5rem
        ); */
        margin: 0 auto;
        gap: 0.5rem;
        padding: 14px 0;
    }

    .game-button__primary {
        margin: 1.5rem 0.5rem;
        padding: 5px 7px;
    }

    .game-button__secondary {
        margin: 0 5px;
    }

    h2.debug-info {
        margin: 5px 0;
    }
</style>