<script lang="ts">
    import { push } from 'svelte-spa-router'
    import CacheHandler from '../lib/CacheHandler';
    import type { Difficulty } from '../types/game.type';
    import { isMobileBrowser } from '../utils/platform'

    interface DifficultyOption {
        id: Difficulty,
        text: string
    }

    const difficulties: Array<DifficultyOption> = [
        { id:"easy", text: "Ľahká" },
        { id:"hard", text: "Ťažká" }
    ]

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

        <div class="selectDiv">
            <select id="select" bind:value={selectedDifficulty} on:change={onDifficultySelectChange}>
                {#each difficulties as difficulty}
                    <option value={difficulty.id}>
                        {difficulty.text}
                    </option>
                {/each}
            </select>
            <label for="select"> Obtiažnosť</label>
        </div>

    </div>

    <button on:click={() => push("/description")}>Popis hry</button>
</div>


<style>
    *{
        margin: 0;
        padding: 0;
    }
    h1 {
        font-size: 4.2em;
        line-height: 1.1;
    }

    .menu {
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 400px;
    }

    .play {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 0;
        width: 400px;
    }

    .play *{
        width: 200px;
    }

    .selectDiv{
        position: relative;
    }
    .selectDiv label{
        position: absolute;
        left: 0;
        top: 25px;
        font-size: 1.5em;
        line-height: normal;
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

    button:hover, select:hover{
        color: rgba(255, 255, 255, 1);
        box-shadow: 0 0 40px rgba(255, 0, 0, .6);
    }
    @media screen and (max-width: 480px){

        h1{
            font-size: 3.2em;
        }
        .play *{
            width: 150px;
        }
        button, .menu {
            width: 300px;
        }
        button, select, .selectDiv label{
            font-size: 1.2em;
        }
    }
</style>