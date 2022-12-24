<script lang="ts">
    import type { GamePropType } from '../types/props.type'

    import { setupControls } from '../lib/Controls'
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

        const board = createBoard(levelsJsonData, sprites)

        setupControls()

        const container = document.querySelector(".board-container")
        for (let y = 0; y < board.getGameBoardSize(); y++) {
            for (let x = 0; x < board.getGameBoardSize(); x++) {
                const tile = board.getGameBoardItem(x, y)
                container.appendChild(tile.getHTMLElement())
            }
        }

        // Experimets with drag and drop

        const draggable = document.getElementById("draggable")
        const target = document.getElementById("target")

        function enterDroppable(elem) {
            elem.style.background = 'pink';
        }

        function leaveDroppable(elem) {
            elem.style.background = '';
        }

        let currentDroppable = null

        draggable.onmousedown = event => {
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

<main>
    <Loader {loading} />

    <h1>Lets rooooock on {params.difficulty}!</h1>
    <h2 id="controls">None</h2>

    <div class="board-container"></div>

    <div class="dragfield">
        <div id="target"></div>
        <div id="draggable"></div>
    </div>
</main>

<style>
    div.board-container {
        display: grid;
        grid-template-columns: repeat(6, 1fr);  /* Set from JS */
        max-width: calc(6 * 60px);  /* Set from JS */
        margin: 0 auto;
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