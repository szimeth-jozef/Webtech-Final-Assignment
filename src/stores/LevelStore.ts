import { writable } from "svelte/store"

export interface LevelState {
    isFinished: boolean,
    isTileMovementEnabled: boolean,
    isLevelControlButtonDisabled: boolean
}

export const levelState = writable<LevelState>()