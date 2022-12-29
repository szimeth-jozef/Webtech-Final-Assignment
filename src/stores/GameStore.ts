import { writable } from "svelte/store"
import type { JsonLevel } from "../lib/Levels"

export interface GameLevel {
    number: number,
    data: JsonLevel
}

export const currentLevel = writable<GameLevel>()