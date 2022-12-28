export class Vec2 {
    private _x: number
    private _y: number

    constructor(x: number, y: number) {
        this._x = x
        this._y = y
    }

    public get x(): number {
        return this._x
    }

    public get y(): number {
        return this._y
    }

    public copy(): Vec2 {
        return new Vec2(this._x, this._y)
    }

    public set(x: number, y: number) {
        this._x = x
        this._y = y
        return this
    }

    public add(vec: Vec2) {
        this._x += vec.x,
        this._y += vec.y
        return this
    }

    public multiply(scalar: number) {
        this._x *= scalar
        this._y *= scalar
        return this
    }

    public divide(scalar: number) {
        this._x /= scalar
        this._y /= scalar
        return this
    }

    public equals(vec: Vec2): boolean {
        return this._x === vec.x && this._y === vec.y
    }

    public static addVecs(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(
            a.x + b.x,
            a.y + b.y
        )
    }
}

export function sum(...values: number[]): number {
    return values.reduce((acc, value) => acc + value, 0)
}