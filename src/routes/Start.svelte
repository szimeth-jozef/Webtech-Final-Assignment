<script lang="ts">
    import { push } from 'svelte-spa-router'
    import CacheHandler from '../lib/CacheHandler';
    import type { Difficulty } from '../types/game.type';
    import { difficulties } from '../utils/difficulty';
    import { isMobileBrowser } from '../utils/platform'


    let selectedDifficulty: Difficulty = "easy"
    let isDataCached: boolean

    const cacheHandler = new CacheHandler(selectedDifficulty)
    isDataCached = cacheHandler.readCache()

    async function lockScreenToPortrait() {
        if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        }
        return await screen.orientation.lock("portrait")
    }

    function onStartGameButtonClicked() {
        if (isMobileBrowser()) {
            lockScreenToPortrait()
                .then(() => {
                    console.log("Screen locked to portrait.")
                    push(`/game/${selectedDifficulty}`)
                })
                .catch(err => {
                    console.error(`Failed locking the screen to portrait: ${err}`)
                })
        }
        else {
            push(`/game/${selectedDifficulty}`)
        }
    }

    function onDifficultySelectChange() {
        cacheHandler.difficulty = selectedDifficulty
        isDataCached = cacheHandler.readCache()
    }
</script>


<main class="page-container">
    <h1>Puzzle Path</h1>
    <button class="learn-more" on:click={onStartGameButtonClicked}>
        {#if isDataCached}
            Pokračovať v hre
        {:else}
            Začat novú hru
        {/if}
    </button>

    <div class="selectDiv">
        <label for="difficulty-select"> Obtiažnosť</label>
        <select id="difficulty-select" bind:value={selectedDifficulty} on:change={onDifficultySelectChange}>
            {#each difficulties as difficulty}
                <option value={difficulty.id}>
                    {difficulty.text}
                </option>
            {/each}
        </select>
    </div>

<button class="learn-more" on:click={() => push("/description")}>Popis hry</button>
</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    h1 {
        font-size: 3em;
        line-height: 1.1;
        font-family: 'Press Start 2P', cursive;
        text-align: center;
    }

    button {
        position: relative;
        display: inline-block;
        cursor: pointer;
        outline: none;
        border: 0;
        vertical-align: middle;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        margin-bottom: 1rem;
        max-width: 375px;
        min-width: 224px;
    }

    button.learn-more {
        font-weight: 600;
        color: white;
        text-transform: uppercase;
        padding: 1.25em 2em;
        background: #DD571C;
        border: 2px solid white;
        border-radius: 0.75em;
        transform-style: preserve-3d;
        transition: transform 100ms cubic-bezier(0, 0, 0.58, 1),
                    background 100ms cubic-bezier(0, 0, 0.58, 1);
    }

    button.learn-more::before {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #903812;
        border-radius: inherit;
        transform: translate3d(0, 0.75em, -1em);
        transition: transform 100ms cubic-bezier(0, 0, 0.58, 1);
    }

    button.learn-more:hover {
        background: #ff8220;
        transform: translate(0, 0.25em);
    }
    button.learn-more:hover::before {
        transform: translate3d(0, 0.5em, -1em);
    }
    button.learn-more:active {
        background: #ff8220;
        transform: translate(0em, 0.75em);
    }
    button.learn-more:active::before {
        transform: translate3d(0, 0, -1em);
    }

    /* Tablet */
    @media screen and (max-width: 768px) {
        h1 {
            padding: 2.5rem 0;
            font-size: 2.5rem;
        }
    }

    /* Mobile devices */
    @media screen and (max-width: 480px) {
        /* h1 {
            padding: 2rem 0;
            font-size: 1.55rem;
        } */
    }
</style>