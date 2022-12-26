export default class Tile {
    private tile: HTMLImageElement
    private orientation: number
    private tileProps: TileProperties
    // ===== DEBUG INFO =====
    private name: string

    constructor(
        tile: HTMLImageElement,
        orientation: number,
        props: TileProperties,
        name: string
    ) {
        this.orientation = orientation
        this.tileProps = props
        this.tile = tile
        this.initializeTile()
        
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

    public isMovable() {
        return this.tileProps.movable
    }

    // public rotate(byDeg: number) {
    //     if (!this.tileProps.rotable) {
    //         console.warn(`An attempt to rotate a non-rotable tile [${this.name}]`)
    //         console.trace()
    //         return
    //     }
    //     this.orientation += byDeg
    //     this.tile.style.transform = `rotate(${this.orientation}deg)`
    // }

    private initializeTile() {
        this.tile.style.transform = `rotate(${this.orientation}deg)`

        if (this.isMovable()) {
            this.tile.classList.add("draggable")
        }

        if (this.tileProps.receiver) {
            this.tile.classList.add("dropzone")
        }

        // if (this.tileProps.rotable) {
        //     this.tile.addEventListener("click", event => {
        //         this.rotate(90)
        //     })
        // }

        // Remove img default drag event
        this.tile.ondragstart = () => false
    }
}

export interface TileProperties {
    rotable: boolean,
    movable: boolean,
    receiver: boolean
}

export enum TilesBoard {
    Game = "GAME",
    Pick = "PICK"
}

export interface TileIdFormat {
    tileAt: TilesBoard,
    index: number,
    position: Array<number>
}