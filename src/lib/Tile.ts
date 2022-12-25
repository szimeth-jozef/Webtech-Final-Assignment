export default class Tile {
    private tile: HTMLImageElement
    private orientation: number
    private rotable: boolean
    private swappable: boolean
    // ===== DEBUG INFO =====
    private name: string

    constructor(
        tile: HTMLImageElement,
        orientation: number,
        rotable: boolean,
        swappable: boolean,
        name: string
    ) {
        this.rotable = rotable
        this.swappable = swappable
        this.orientation = 0
        this.tile = tile
        this.setInitOrientation(orientation)
        
        this.name = name
    }

    public getName() {
        return this.name
    }

    public getOrientation() {
        return this.orientation
    }

    public getHTMLElement() {
        return this.tile
    }

    public isSwappable() {
        return this.swappable
    }

    public rotate(byDeg: number) {
        if (!this.rotable) {
            console.warn(`An attempt to rotate a non-rotable tile [${this.name}]`)
            console.trace()
            return
        }
        this.orientation += byDeg
        this.tile.style.transform = `rotate(${this.orientation}deg)`
    }

    private setInitOrientation(orientation: number) {
        if (orientation > 0) {
            this.orientation = orientation
            this.tile.style.transform = `rotate(${this.orientation}deg)`
        }
    }
}