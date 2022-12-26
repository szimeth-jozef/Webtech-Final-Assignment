<script lang="ts">
    import type { GamePropType } from '../types/props.type'

    import { addTileMovementControls, setupControls } from '../lib/Controls'
    import { fetchLevels, fetchSpriteSheet } from '../lib/DependencyLoaders'
    import SpriteSheet from '../lib/SpriteSheet'
    import Loader from '../components/Loader.svelte'
    import { createBoard } from '../lib/Levels';

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

        setupControls()

        const board = createBoard(levelsJsonData, sprites)

        addTileMovementControls(board)

        const gameBoardcontainer = document.querySelector(".game-board")
        const pickBoardContainer = document.querySelector(".pick-board")
        board.populateGameBoardContainer(gameBoardcontainer)
        board.populatePickBoardContainer(pickBoardContainer)


        // Experimets with drag and drop
        const draggable = document.getElementById("draggable")
        const target = document.getElementById("target")

        function enterDroppable(elem) {
            elem.style.background = 'pink';
        }

        function leaveDroppable(elem) {
            elem.style.background = '';
        }

        draggable.onmousedown = event => {
            let currentDroppable = null

            draggable.style.position = "absolute"
            
            function moveAt(pageX, pageY) {
                draggable.style.left = pageX - draggable.offsetWidth / 2 + 'px';
                draggable.style.top = pageY - draggable.offsetHeight / 2 + 'px';
            }

            // move our absolutely positioned ball under the pointer
            moveAt(event.pageX, event.pageY);

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);

                draggable.hidden = true;
                let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                draggable.hidden = false;

                if (!elemBelow) return;

                let droppableBelow = elemBelow.closest('#target');
                if (currentDroppable != droppableBelow) {
                    if (currentDroppable) { // null when we were not over a droppable before this event
                        leaveDroppable(currentDroppable);
                    }
                    currentDroppable = droppableBelow;
                    if (currentDroppable) { // null if we're not coming over a droppable now
                        // (maybe just left the droppable)
                        enterDroppable(currentDroppable);
                    }
                }
            }

            // (2) move the ball on mousemove
            document.addEventListener('mousemove', onMouseMove);

            // (3) drop the ball, remove unneeded handlers
            draggable.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                draggable.style.removeProperty("position")
                draggable.style.removeProperty("left")
                draggable.style.removeProperty("top")
                draggable.onmouseup = null;
            };
        }

        draggable.ontouchstart = event => {
            let currentDroppable = null

            draggable.style.position = "absolute"
            
            function moveAt(pageX, pageY) {
                draggable.style.left = pageX - draggable.offsetWidth / 2 + 'px';
                draggable.style.top = pageY - draggable.offsetHeight / 2 + 'px';
            }

            // move our absolutely positioned ball under the pointer
            const primaryTouch = event.changedTouches[0]
            moveAt(primaryTouch.pageX, primaryTouch.pageY);

            function onMouseMove(event) {
                const primaryTouch = event.changedTouches[0]
                moveAt(primaryTouch.pageX, primaryTouch.pageY);

                draggable.hidden = true;
                let elemBelow = document.elementFromPoint(primaryTouch.clientX, primaryTouch.clientY);
                draggable.hidden = false;

                if (!elemBelow) return;

                let droppableBelow = elemBelow.closest('#target');
                if (currentDroppable != droppableBelow) {
                    if (currentDroppable) { // null when we were not over a droppable before this event
                        leaveDroppable(currentDroppable);
                    }
                    currentDroppable = droppableBelow;
                    if (currentDroppable) { // null if we're not coming over a droppable now
                        // (maybe just left the droppable)
                        enterDroppable(currentDroppable);
                    }
                }
            }

            // (2) move the ball on mousemove
            document.addEventListener('touchmove', onMouseMove);

            // (3) drop the ball, remove unneeded handlers
            draggable.ontouchend = function() {
                document.removeEventListener('touchmove', onMouseMove);
                draggable.style.removeProperty("position")
                draggable.style.removeProperty("left")
                draggable.style.removeProperty("top")
                draggable.ontouchend = null;
            };
        }

    })
    .catch(err => {
        loading = false
        console.error(`Error loading assests: ${err}`)
    })
</script>


<Loader {loading} />
<p>Difficulty: {params.difficulty}</p>
<p>Level 1</p>
<h2 id="controls">None</h2>

<div class="game-board"></div>
<div class="pick-board-background">
    <div class="pick-board"></div>
</div>

<div class="dragfield">
    <div id="target"></div>
    <div id="draggable"></div>
</div>

<style>
    :root {
        --game-board-grid-size: 6;  /* Set from JS */
        --game-board-grid-item-size: 60px;  /* Set from JS */
        --pick-board-grid-size: calc(var(--game-board-grid-size) - 1);
        --pick-board-background-color: brown;
    }

    :global(img.draggable) {
        cursor: pointer;
    }

    /* Dropzone hover style */
    :global(img.dropzone-hover) {
        filter: sepia(0.75);
        transition: 0.25s filter ease;
    }

    div.game-board {
        display: grid;
        grid-template-columns: repeat(var(--game-board-grid-size), 1fr);
        max-width: calc(var(--game-board-grid-size) * var(--game-board-grid-item-size));
        margin: 0 auto;
        margin-bottom: 2rem;
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

    /* Sketch css */
    .dragfield {
        display: flex;
        justify-content: space-between;
    }

    #target {
        width: 100px;
        height: 100px;
        background-color: darkgray;
    }

    #draggable {
        width: 100px;
        height: 100px;
        background-color: aqua;
    }
</style>