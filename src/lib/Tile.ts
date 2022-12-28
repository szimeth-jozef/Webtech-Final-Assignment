import TileBoundary from "./TileBoudary"

export default class Tile {
    private _tile: HTMLImageElement
    private _orientation: number
    private tileProps: TileProperties
    private eventStore: object
    private _name: string
    private _bondary: TileBoundary

    constructor(
        tile: HTMLImageElement,
        orientation: number,
        props: TileProperties,
        name: string,
        boundary: boolean[]
    ) {
        this._orientation = orientation
        this.tileProps = props
        this._tile = tile
        this.eventStore = {}
        this._name = name
        this._bondary = new TileBoundary(boundary, orientation)
        this.initializeTile()
    }

    public get boundary() {
        return this._bondary
    }

    public get name() {
        return this._name
    }

    public get orientation() {
        return this._orientation
    }

    public get tileHTMLElement() {
        return this._tile
    }

    public isMovable() {
        return this.tileProps.movable
    }

    public isEmpty() {
        return this._name === "none"
    }

    public isFinish() {
        return this._name === "finish"
    }

    public disableMovementEventListeners() {
        // Save onmousedown and ontouchstart then set them to null
        this.eventStore["onmousedown"] = this._tile.onmousedown
        this.eventStore["ontouchstart"] = this._tile.ontouchstart

        this._tile.onmousedown = null
        this._tile.ontouchstart = null

        // Remove css class "draggable"
        this._tile.classList.remove("draggable")
    }

    public enableMovementEventListeners() {
        // Restore saved onmousedown and ontouchstart
        const onMouseDownEvent = this.eventStore["onmousedown"]
        const onTouchStartEvent = this.eventStore["ontouchstart"]

        if (onMouseDownEvent) {
            this._tile.onmousedown = onMouseDownEvent

        }
        if (onTouchStartEvent) {
            this._tile.ontouchstart = onTouchStartEvent
        }

        // Add back css class "draggable"
        this._tile.classList.add("draggable")
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
        this._tile.style.transform = `rotate(${this._orientation}deg)`

        if (this.isMovable()) {
            this._tile.classList.add("draggable")
        }

        if (this.tileProps.receiver) {
            this._tile.classList.add("dropzone")
        }

        // if (this.tileProps.rotable) {
        //     this.tile.addEventListener("click", event => {
        //         this.rotate(90)
        //     })
        // }

        // Remove img default drag event
        this._tile.ondragstart = () => false
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