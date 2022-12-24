export default class Tile {
    private tile: HTMLCanvasElement
    private orientation: number
    private type: string

    constructor(tile: HTMLCanvasElement, orientation: number, type: string) {
        this.orientation = 0
        this.tile = tile
        this.rotate(orientation)
    }

    public getHTMLElement() {
        return this.tile
    }

    public rotate(byDeg: number) {
        this.orientation += byDeg
        this.tile.style.transform = `rotate(${this.orientation}deg)`
    }
}