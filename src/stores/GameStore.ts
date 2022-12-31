import { writable } from "svelte/store"
import type { JsonLevel } from "../lib/Levels"

export interface GameState {
    levelNumber: number,
    levelData: JsonLevel,
    isLevelLast: boolean
}

export const gameState = writable<GameState>()