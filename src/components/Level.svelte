<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import Ball from "../lib/Ball";
    import type Board from "../lib/Board";
    import { addTileMovementControls, setupControls } from "../lib/Controls";
    import { createBoard } from "../lib/Levels";
    import type SpriteSheet from "../lib/SpriteSheet";
    import { currentLevel, type GameLevel } from "../stores/GameStore";
    import { levelState } from "../stores/LevelStore";
    import { difficultyTranslation } from "../utils/difficulty";

    export let difficulty: string
    export let gameBoardSize: number
    export let tileDimensions: number
    export let sprites: SpriteSheet

    let level: number
    let board: Board
    let ball: Ball
    let controlButtonText = "Položiť loptu"
    let isControlButtonDisabled: boolean
    let isLevelFinished: boolean

    const onLevelChange = (lvl: GameLevel) => {
        level = lvl.number
        levelState.set({
            isFinished: false,
            isTileMovementEnabled: true,
            isLevelControlButtonDisabled: true
        })

        const gameBoardContainer: HTMLDivElement = document.querySelector(".game-board")
        const pickBoardContainer: HTMLDivElement = document.querySelector(".pick-board")

        // Clear game board
        gameBoardContainer.innerHTML = ""
        pickBoardContainer.innerHTML = ""

        board = createBoard(lvl.data, sprites, gameBoardSize, tileDimensions)
        addTileMovementControls(board)

        board.populateGameBoardContainer(gameBoardContainer)
        board.populatePickBoardContainer(pickBoardContainer)

        const ballImg = sprites.getTile("ball", tileDimensions)
        ball = new Ball(board, gameBoardContainer, ballImg)
        setupControls(ball)
    }

    const onLevelControlButtonClicked = () => {
        board.toggleTileMovementControl()

        if (board.isInEditMode) {
            ball.placeBallAtStart()
            controlButtonText = "Editovať"
        }
        else {
            controlButtonText = "Položiť loptu"
            ball.removeBallFromBoard()
        }
    }

    onMount(() => {
        currentLevel.subscribe(onLevelChange)
            levelState.subscribe((lvlState) => {
            isControlButtonDisabled = lvlState.isLevelControlButtonDisabled
            isLevelFinished = lvlState.isFinished
        })

        // Set css variables
        const root = document.documentElement
        root.style.setProperty("--game-board-grid-size", gameBoardSize.toString())
        root.style.setProperty("--game-board-grid-item-size", `${tileDimensions}px`)
    })

    onDestroy(() => {
        console.log("Level destroyed")
    })
</script>


<p>Obtiažnosť: {difficultyTranslation[difficulty]} | Úloha {level + 1}</p>
<div id="top-control-panel">
    <button class="game-button__secondary">Nápoveda</button>
    <button class="game-button__secondary">Riešenie</button>
</div>
<div class="game-board__overlay">
    {#if isLevelFinished}
        <h1 class="game-board__message">Hotovo!</h1>
    {/if}
    <div class="game-board">
    </div>
</div>
<button class="game-button__primary"
        disabled={isControlButtonDisabled}
        on:click={onLevelControlButtonClicked}>
    {controlButtonText}
</button>
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

    div.game-board__overlay {
        position: relative;
    }

    div.game-board__overlay > h1.game-board__message {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
        margin: 0;
        font-size: 3rem;
        font-weight: 900;

        /* Fall back for text-stroke
        text-shadow:
            -1px -1px 0 #000,
             1px -1px 0 #000,
            -1px 1px 0 #000,
             1px 1px 0 #000; */

        -webkit-text-stroke: 2px black;
        -webkit-text-fill-color: white;
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
</style>