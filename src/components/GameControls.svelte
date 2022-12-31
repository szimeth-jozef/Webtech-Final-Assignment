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
    buttonTranslations.mainButton[MainButtonAction.BallRoll] = "Položiť loptičku"
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
        <button class="button-theme" on:click={onMainButtonClicked} disabled={$mainButtonState.isDisabled}>
            {mainButtonText}
        </button>
    {:else}
        <div class="buttons-multiple">
            <button class="button-theme" on:click={onBackToMenuClicked}>
                {buttonTranslations.backToMenuButton}
            </button>
            <button class="button-theme" on:click={() => dispatch("nextlevel")}>
                {#if isLevelLast}
                    {buttonTranslations.nextLevelButton.difficultyFinished}
                {:else}
                    {buttonTranslations.nextLevelButton.levelFinished}
                {/if}
            </button>
        </div>
    {/if}
</div>

<style>
    div.controls-container {
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div.controls-container > button,
    div.buttons-multiple > button {
        padding: 0.65rem 0.5rem;
        cursor: pointer;
        margin-bottom: 0.5rem;
    }

    div.buttons-multiple {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
    }

    div.buttons-multiple > button{
        padding: 0.65rem 0.25rem;
    }
</style>