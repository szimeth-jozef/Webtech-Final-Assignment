import { writable } from "svelte/store";
import type { Vec2 } from "../utils/math";

export interface TilelighterState {
    position: Vec2,
    color: string,
    duration: number
}

const createTilelighter = () => {
    const { subscribe, update } = writable<TilelighterState>()

    const highlight = (pos: Vec2, color: string, duration: number) => {
        update(state => {
            return {
                position: pos,
                color,
                duration
            }
        })
    }

    return { subscribe, highlight }
}

export const tilelighter = createTilelighter()