import { writable } from "svelte/store";
import { Vec2 } from "../utils/math";

export interface TilelighterState {
    position: Vec2,
    color: string,
    duration: number
}

const createTilelighter = () => {
    const { subscribe, update } = writable<TilelighterState>()

    const highlight = (pos: Vec2, color: string, duration: number) => {
        update(_ => {
            return {
                position: pos,
                color,
                duration
            }
        })
    }

    const cancel = () => {
        update(_ => {
            return {
                position: new Vec2(0, 0),
                color: "tranparent",
                duration: 0
            }
        })
    }

    return { subscribe, highlight, cancel }
}

export const tilelighter = createTilelighter()