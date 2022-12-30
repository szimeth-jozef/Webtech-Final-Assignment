import type { Difficulty } from "../types/game.type";
import { subtractArrays } from "../utils/math";
import { randchoice } from "../utils/random";
import CacheHandler from "./CacheHandler";

export default class LevelServer {
    private readonly _cacheHandler: CacheHandler
    private readonly _allLevels: number[]
    private _availableLevels: number[]

    constructor(difficulty: Difficulty, allLevels: number[]) {
        this._cacheHandler = new CacheHandler(difficulty)
        this._allLevels = allLevels
        const isDataCached = this._cacheHandler.readCache()

        this._availableLevels = isDataCached ?
            subtractArrays(allLevels, this._cacheHandler.cacheData) :
            [...allLevels]
    }

    public nextLevel(): number {
        return randchoice(this._availableLevels)
    }

    public finishLevel(level: number): void {
        if (!this._availableLevels.includes(level)) {
            console.warn(`LevelServer: Attempt to finish level [${level}], but it is not available`)
            return
        }

        // Remove level from available
        this._availableLevels = this._availableLevels.filter(value => value !== level)

        if (this._availableLevels.length === 0) {
            // No more available levels
            this._cacheHandler.clearCache()
            this._availableLevels = [...this._allLevels]
        }
        else {
            // Store finished level
            this._cacheHandler.appendData(level)
            this._cacheHandler.writeCache()
        }
    }

    public isLastLevel(): boolean {
        return this._availableLevels.length === 1
    }
}