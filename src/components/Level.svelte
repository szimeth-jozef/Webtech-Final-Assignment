<script lang="ts">
    import GameControls from "./GameControls.svelte"
    import TileHighlighter from "./TileHighlighter.svelte"

    import { onDestroy, onMount } from "svelte"
    import { createEventDispatcher } from "svelte"
    import Ball from "../lib/Ball"
    import { addTileMovementControls, setupControls } from "../lib/Controls"
    import { createBoard, renderSolutionBoardImage, type JsonLevel } from "../lib/Levels"
    import { gameState, type GameState } from "../stores/GameStore"
    import { levelState } from "../stores/LevelStore"
    import { MainButtonAction, mainButtonState } from "../stores/MainLevelControlButtonStore"
    import { difficultyTranslation } from "../utils/difficulty"
    import { toast } from "@zerodevx/svelte-toast"
    import type Board from "../lib/Board"
    import type SpriteSheet from "../lib/SpriteSheet"
    import type { LevelDetails } from "../types/game.type"
    import { Vec2 } from "../utils/math"
    import { tilelighter } from "../stores/TileHighlighterStore"
    import PrintableDialog from "./PrintableDialog.svelte";
    import isMobile from "is-mobile";

    export let levelDetails: LevelDetails
    export let sprites: SpriteSheet

    let level: number
    let board: Board
    let ball: Ball
    let isLevelFinished: boolean
    let isLevelLast: boolean
    let winnerMessageText: string
    let solutionDescriptionText: string
    let solutionDescriptionImg: string
    let currentLevelJsonData: JsonLevel
    let dialog

    const dispatch = createEventDispatcher()

    const onLevelChange = (lvl: GameState) => {
        if (document.querySelector(".game-board") === null ||
            document.querySelector(".pick-board") === null) {
            return
        }
        level = lvl.levelNumber
        isLevelLast = lvl.isLevelLast
        currentLevelJsonData = lvl.levelData
        winnerMessageText = lvl.isLevelLast ? "Vyhral si!" : "Hotovo!"
        solutionDescriptionText = isMobile() ?
            currentLevelJsonData.solutionDescription.mobile :
            currentLevelJsonData.solutionDescription.desktop

        solutionDescriptionImg = renderSolutionBoardImage(currentLevelJsonData, sprites, levelDetails.tileDimensions)

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

    const onHintButtonClicked = () => {
        const HIGHLIGHT_DURATION_MS = 2000

        const toastOptions = {
            duration: HIGHLIGHT_DURATION_MS,
            theme: {
                "--toastBarBackground": "#dd571c",
            }
        }
        const solution = currentLevelJsonData.solution

        for (const correctTile of solution) {
            const tile = board.getGameBoardItem(correctTile.pos[0], correctTile.pos[1])
            if (tile.name === correctTile.name &&
                tile.orientation === correctTile.orientation) {
                continue
            }

            // Show hint
            const img = sprites.getTile(correctTile.name, 20)
            toast.push(`
                <div style="display:flex; align-items:center;">
                    Správne políčko na x:${correctTile.pos[0]} y:${correctTile.pos[1]}
                    <img style="transform: rotate(${correctTile.orientation}deg)" src="${img.src}" />
                </div>
            `, toastOptions)

            const tilePosition = new Vec2(correctTile.pos[0], correctTile.pos[1])
            tilePosition.multiply(tile.tileHTMLElement.width)

            if (tile.isEmpty()) {
                // Highlight with green
                tilelighter.highlight(tilePosition, "green", HIGHLIGHT_DURATION_MS)
            }
            else {
                // Highlight with red (must be a wrong tile if not empty)
                tilelighter.highlight(tilePosition, "red", HIGHLIGHT_DURATION_MS)
            }

            return
        }

        toast.push("Máš to správne", toastOptions)
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


<div class="level-container">
    <div class="top-control-panel">
        <p>Obtiažnosť: {difficultyTranslation[levelDetails.difficulty]}</p>
        <div class="top-control-panel__buttons">
            <button on:click={onHintButtonClicked}>Nápoveda</button>
            <button on:click={() => dialog.open()}>Riešenie</button>
        </div>
    </div>
    <div class="game-board__overlay">
        <TileHighlighter tileDimensions={levelDetails.tileDimensions} />
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
</div>
<PrintableDialog bind:this={dialog}>
    <p class="solution-description">{solutionDescriptionText}</p>
    <img class="solution-img" src={solutionDescriptionImg} alt="solution_img">
</PrintableDialog>


<style>
    :root {
        --game-board-grid-size: 6;  /* Set from JS */
        --game-board-grid-item-size: 60px;  /* Set from JS */
        --pick-board-grid-size: 5;  /* Fixed to 5 for now */
        --toastContainerTop: 4.5rem;
    }

    p.solution-description {
        padding: 10px;
        hyphens: auto;
        text-align: justify;
    }

    img.solution-img {
        padding: 10px;
        max-width: 360px;
        margin: 0 auto;
    }

    :global(img.draggable) {
        cursor: grab;
    }

    /* Dropzone hover style */
    :global(img.dropzone-hover) {
        filter: sepia(0.75);
        transition: 0.25s filter ease;
    }

    div.level-container {
        max-width: calc(var(--game-board-grid-size) * var(--game-board-grid-item-size));
        padding-bottom: 12px;
    }

    div.top-control-panel {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin: 0.65rem 0;
    }

    div.top-control-panel > p {
        text-transform: uppercase;
        font-weight: bold;
        text-decoration: underline;
    }

    div.top-control-panel__buttons {
        display: flex;
    }

    div.top-control-panel__buttons > button {
        margin-left: 1rem;
        padding: 0.25rem 0.5rem;
    }

    div.game-board {
        position: relative;
        display: grid;
        grid-template-columns: repeat(var(--game-board-grid-size), 1fr);
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
        background: linear-gradient(90deg, rgba(255,44,0,1) 0%, rgba(238,60,8,1) 6%, rgba(221,87,28,1) 100%);
        margin: 0 auto;
        position: relative;
        transform-style: preserve-3d;
    }

    div.pick-board-background::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #903812;
        transform: translate3d(0, 0.75em, -1em);
    }

    div.pick-board {
        display: grid;
        grid-template-columns: repeat(var(--pick-board-grid-size), 1fr);
        margin: 0 auto;
        gap: 0.5rem;
        padding: 14px 0;
    }

    /* Tablet */
    @media screen and (max-width: 768px) {
        p.solution-description {
            font-size: 0.9rem;
        }
    }

    /* Mobile devices */
    @media screen and (max-width: 480px) {
        p.solution-description {
            font-size: 0.75rem;
        }
    }

    @media print {
        div.level-container {
            visibility: hidden !important;
        }
    }
</style>