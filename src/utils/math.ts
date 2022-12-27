export default class Vec2 {
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

    public set(x: number, y: number) {
        this._x = x
        this._y = y
    }

    public add(vec: Vec2) {
        this._x += vec.x,
        this._y += vec.y
    }

    public static addVecs(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(
            a.x + b.x,
            a.y + b.y
        )
    }
}