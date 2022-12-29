import type { Difficulty } from "../types/game.type";

export default class CacheHandler {
    private _difficulty: Difficulty
    private _cacheData: number[]

    constructor(initialDifficulty: Difficulty) {
        this._difficulty = initialDifficulty
        this._cacheData = []
    }

    public set difficulty(value: Difficulty) {
        this._difficulty = value
    }

    public get cacheData() {
        return [...this._cacheData]
    }

    public appendData(level: number) {
        this._cacheData.push(level)
    }

    public readCache(): boolean {
        const data = window.localStorage.getItem(this._difficulty)
        if (data === null) {
            return false
        }

        this._cacheData = JSON.parse(data)
        return true
    }

    public writeCache() {
        window.localStorage.setItem(
            this._difficulty,
            JSON.stringify(this._cacheData)
        )
    }

    public clearCache() {
        this._cacheData = []
        window.localStorage.removeItem(this._difficulty)
    }
}