import { Direction } from "./Ball"

export default class TileBoundary {
    private _boundary: boolean[]

    constructor(boundary: boolean[], orientation: number = 0) {
        if (boundary.length != 4) {
            throw "TileBoundary Error: array of boundaries must have length 4"
        }
        this._boundary = [...boundary]
        this.rotateClockwise(orientation)
    }

    public get boundary(): boolean[] {
        return this._boundary
    }

    public get topBoundary(): boolean {
        return this._boundary[0]
    }

    public get rightBoundary(): boolean {
        return this._boundary[1]
    }

    public get bottomBoundary(): boolean {
        return this._boundary[2]
    }

    public get leftBoundary(): boolean {
        return this._boundary[3]
    }

    public getBoundaryByDirection(dir: Direction): boolean {
        switch (dir) {
            case Direction.UP:
                return this.topBoundary
            case Direction.DOWN:
                return this.bottomBoundary
            case Direction.LEFT:
                return this.leftBoundary
            case Direction.RIGHT:
                return this.rightBoundary
        }
    }

    public rotateClockwise(degrees: number): void {
        // Allowed rotations: 0°(does nothing), 90°, 180° and 270°
        // Fit in range <0, 359>
        degrees = degrees % 360
        const rotations = Math.floor(degrees / 90)

        // Clockwise rotation: pop last element and add it to the beginning <=> 1 rotation
        for (let i = 0; i < rotations; i++) {
            const last = this._boundary.pop()
            this._boundary.unshift(last)
        }
    }
} 