<script lang="ts">
    import { push } from "svelte-spa-router"
    import CacheHandler from "../lib/CacheHandler"
    import type { Difficulty } from "../types/game.type"
    import { difficulties } from "../utils/difficulty"
    import isMobile from "is-mobile"
    import { toast } from "@zerodevx/svelte-toast"


    let selectedDifficulty: Difficulty = "easy"
    let isDataCached: boolean

    const cacheHandler = new CacheHandler(selectedDifficulty)
    isDataCached = cacheHandler.readCache()

    async function lockFullscreenToPortrait() {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen()
        }
        return await screen.orientation.lock("portrait")
    }

    function onStartGameButtonClicked() {
        const toastOptions = {
            duration: 5000,
            theme: {
                "--toastBarBackground": "#dd571c",
            }
        }

        if (isMobile()) {
            lockFullscreenToPortrait()
                .then(() => {
                    console.log("Screen locked to portrait.")
                    push(`/game/${selectedDifficulty}`)
                })
                .catch(err => {
                    console.error(`Failed locking the screen to portrait: ${err}`)
                    toast.push("Nepodarilo sa uzamknúť obrazovku na výšku! S loptičkou sa bude otáčať obrazovka.", toastOptions)
                    push(`/game/${selectedDifficulty}`)
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
    <button class="button-theme" on:click={onStartGameButtonClicked}>
        {#if isDataCached}
            Pokračovať v hre
        {:else}
            Začat novú hru
        {/if}
    </button>

    <div class="select-n-label">
        <label for="difficulty-select">Obtiažnosť</label>
        <select class="select-theme" id="difficulty-select" bind:value={selectedDifficulty} on:change={onDifficultySelectChange}>
            {#each difficulties as difficulty}
                <option value={difficulty.id}>
                    {difficulty.text}
                </option>
            {/each}
        </select>
    </div>

<button class="button-theme" on:click={() => push("/description")}>Popis hry</button>
</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        user-select: none;
        -webkit-user-select: none;
    }

    h1 {
        font-size: 3rem;
        padding: 3rem 0;
        line-height: 1.1;
        font-family: 'Press Start 2P', cursive;
        text-align: center;
    }

    button,
    select {
        position: relative;
        display: inline-block;
        cursor: pointer;
        outline: none;
        vertical-align: middle;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        margin-bottom: 1rem;
        max-width: 375px;
        min-width: 224px;
    }

    select {
        background-color: #3b3b3b;
    }

    div.select-n-label {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    div.select-n-label > label {
        text-transform: uppercase;
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