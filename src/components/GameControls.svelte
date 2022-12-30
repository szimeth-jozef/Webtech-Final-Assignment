<script lang="ts">
    import { get } from "svelte/store";
    import { push } from 'svelte-spa-router'
    import { levelState } from "../stores/LevelStore";
    import { MainButtonAction, mainButtonState } from "../stores/MainLevelControlButtonStore";
    import { onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";

    export let isLevelLast: boolean

    const dispatch = createEventDispatcher()
    const buttonTranslations = {
        mainButton: {},
        backToMenuButton: "Späť na hlavné menu",
        nextLevelButton: {
            levelFinished: "Ďalšia úloha",
            difficultyFinished: "Opakovať obtiažnosť"
        }
    }
    buttonTranslations.mainButton[MainButtonAction.BallRoll] = "Položiť loptu"
    buttonTranslations.mainButton[MainButtonAction.EditBoard] = "Editovať"

    let showMainControls: boolean
    let mainButtonText: string

    mainButtonState.subscribe(state => {
        mainButtonText = buttonTranslations.mainButton[state.buttonAction]
    })

    levelState.subscribe(state => {
        if (state) {
            showMainControls = !state.isFinished
        }
        else {
            showMainControls = true
        }
    })

    const onMainButtonClicked = () => {
        const isTileMovementEnabled = get(levelState).isTileMovementEnabled

        levelState.update(state => {
            state.isTileMovementEnabled = !isTileMovementEnabled
            return state
        })

        mainButtonState.update(state => {
            state.buttonAction = !isTileMovementEnabled ?
            MainButtonAction.BallRoll :
                MainButtonAction.EditBoard
            return state
        })
    }

    const onBackToMenuClicked = () => {
        push("/")
    }

    onDestroy(() => {
        console.log("GameControlsComponent: Destroyed")
    })
</script>

<div class="controls-container">
    {#if showMainControls}
        <button on:click={onMainButtonClicked} disabled={$mainButtonState.isDisabled}>
            {mainButtonText}
        </button>
    {:else}
        <button on:click={onBackToMenuClicked}>
            {buttonTranslations.backToMenuButton}
        </button>
        <button on:click={() => dispatch("nextlevel")}>
            {#if isLevelLast}
                {buttonTranslations.nextLevelButton.difficultyFinished}
            {:else}
                {buttonTranslations.nextLevelButton.levelFinished}
            {/if}
        </button>
    {/if}
</div>

<style>
    div.controls-container {
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.controls-container > button {
        height: 2rem;
        margin: 1rem;
    }
</style>