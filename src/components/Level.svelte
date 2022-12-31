<script lang="ts">
    import GameControls from "./GameControls.svelte";
    import { onDestroy, onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import Ball from "../lib/Ball";
    import { addTileMovementControls, setupControls } from "../lib/Controls";
    import { createBoard } from "../lib/Levels";
    import { gameState, type GameState } from "../stores/GameStore";
    import { levelState } from "../stores/LevelStore";
    import { MainButtonAction, mainButtonState } from "../stores/MainLevelControlButtonStore";
    import { difficultyTranslation } from "../utils/difficulty";
    import type Board from "../lib/Board";
    import type SpriteSheet from "../lib/SpriteSheet";
    import type { LevelDetails } from "../types/game.type";

    export let levelDetails: LevelDetails
    export let sprites: SpriteSheet

    let level: number
    let board: Board
    let ball: Ball
    let isLevelFinished: boolean
    let isLevelLast: boolean
    let winnerMessageText: string

    const dispatch = createEventDispatcher()

    const onLevelChange = (lvl: GameState) => {
        if (document.querySelector(".game-board") === null ||
            document.querySelector(".pick-board") === null) {
            return
        }
        level = lvl.levelNumber
        isLevelLast = lvl.isLevelLast
        winnerMessageText = lvl.isLevelLast ? "Vyhral si!" : "Hotovo!"

        levelState.set({
            isFinished: false,
            isTileMovementEnabled: true
        })
        mainButtonState.set({
            isDisabled: true,
            buttonAction: MainButtonAction.BallRoll
        })

        const gameBoardContainer: HTMLDivElement = document.querySelector(".game-board")
        const pickBoardContainer: HTMLDivElement = document.querySelector(".pick-board")

        // Clear game board
        gameBoardContainer.innerHTML = ""
        pickBoardContainer.innerHTML = ""

        board = createBoard(lvl.levelData, sprites, levelDetails.gameBoardSize, levelDetails.tileDimensions)
        addTileMovementControls(board)

        board.populateGameBoardContainer(gameBoardContainer)
        board.populatePickBoardContainer(pickBoardContainer)

        const ballImg = sprites.getTile("ball", levelDetails.tileDimensions)
        ball = new Ball(board, gameBoardContainer, ballImg)
        setupControls(ball)
    }

    onMount(() => {
        gameState.subscribe(onLevelChange)

        levelState.subscribe(lvlState => {
            isLevelFinished = lvlState.isFinished

            if (lvlState.isFinished) {
                dispatch("levelfinished", { level })
                return
            }

            if (lvlState.isTileMovementEnabled) {
                board.enableTileMovementControl()
                ball.removeBallFromBoard()
            }
            else {
                board.disableTileMovementControl()
                ball.placeBallAtStart()
            }
        })

        // Set css variables
        const root = document.documentElement
        root.style.setProperty("--game-board-grid-size", levelDetails.gameBoardSize.toString())
        root.style.setProperty("--game-board-grid-item-size", `${levelDetails.tileDimensions}px`)
    })

    onDestroy(() => {
        console.log("LevelComponent: Destroyed")
    })
</script>


<div id="top-control-panel">
    <p>Obtiažnosť: {difficultyTranslation[levelDetails.difficulty]}</p>
    <button class="game-button__secondary">Nápoveda</button>
    <button class="game-button__secondary">Riešenie</button>
</div>
<div class="game-board__overlay">
    {#if isLevelFinished}
        <h1 class="game-board__message">{winnerMessageText}</h1>
    {/if}
    <div class="game-board">
    </div>
</div>
<GameControls {isLevelLast} on:nextlevel />
<div class="pick-board-background">
    <div class="pick-board"></div>
</div>


<style>
    :root {
        --game-board-grid-size: 6;  /* Set from JS */
        --game-board-grid-item-size: 60px;  /* Set from JS */
        --pick-board-grid-size: 5;  /* Fixed to 5 for now */
        --pick-board-background-color: #dd571c;
    }

    :global(img.draggable) {
        cursor: grab;
    }

    /* Dropzone hover style */
    :global(img.dropzone-hover) {
        filter: sepia(0.75);
        transition: 0.25s filter ease;
    }

    p {
        margin: 0;
        padding: 1rem 0;
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
        white-space: nowrap;
        font-family: Arial, Helvetica;

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

    .game-button__secondary {
        margin: 0 5px;
    }
</style>