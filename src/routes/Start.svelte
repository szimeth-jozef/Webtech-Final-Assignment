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


<h1>Puzzle Path</h1>
<div class="menu">
    <div class="play">
        {#if isDataCached}
            <button on:click={onStartGameButtonClicked}>Pokračovať v hre</button>
        {:else}
            <button on:click={onStartGameButtonClicked}>Začat novú hru</button>
        {/if}

        <select bind:value={selectedDifficulty} on:change={onDifficultySelectChange}>
            {#each difficulties as difficulty}
                <option value={difficulty.id}>
                    {difficulty.text}
                </option>
            {/each}
        </select>
    </div>

    <button on:click={() => push("/description")}>Popis hry</button>
</div>


<style>
    h1 {
        font-size: 4.2em;
        line-height: 1.1;
    }

    .menu {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .play {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 0;
    }

    .play * {
        width: 200px;
    }

    button, select {
        position: relative;
        width: 400px;
        height: 100px;
        margin: 20px 0;
        letter-spacing: 2px;
        text-decoration: none;
        text-transform: uppercase;
        text-align: center;
        color: white;
        border: 2px solid #ec1840;
        background: #242424;
        font-size: 1.5em;
        font-weight: bold;
        line-height: normal;
    }

    button:hover{
        color: rgba(255, 255, 255, 1);
        box-shadow: 0 0 40px rgba(255, 0, 0, .6);
    }

  /* button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
    color: rgba(255, 255, 255, 0.87);
  }

  button:hover {
    border-color: #646cff;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  } */
</style>