export default class Tile {
    private tile: HTMLImageElement
    private orientation: number
    private name: string
    private type: string

    constructor(tile: HTMLImageElement, orientation: number, name: string, type: string) {
        this.orientation = 0
        this.tile = tile
        this.name = name
        this.rotate(orientation)
    }

    public getName() {
        return this.name
    }

    public getHTMLElement() {
        return this.tile
    }

    public rotate(byDeg: number) {
        this.orientation += byDeg
        this.tile.style.transform = `rotate(${this.orientation}deg)`
    }
}