import TileBoundary from "./TileBoudary"

export default class Tile {
    private _tile: HTMLImageElement
    private _orientation: number
    private tileProps: TileProperties
    private _postponedEvents: object
    private _postponedCssClasses: string[]
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
        this._postponedEvents = {}
        this._postponedCssClasses = []
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

    public disableMovementEventListeners() {
        // Save onmousedown and ontouchstart then set them to null
        if (this._tile.onmousedown !== null) {
            this._postponedEvents["onmousedown"] = this._tile.onmousedown
            this._tile.onmousedown = null
        }
        if (this._tile.ontouchstart !== null) {
            this._postponedEvents["ontouchstart"] = this._tile.ontouchstart
            this._tile.ontouchstart = null
        }

        // Remove css classes
        [...this._tile.classList].forEach(cssClass => {
            this._tile.classList.remove(cssClass)
            this._postponedCssClasses.push(cssClass)
        })
    }

    public enableMovementEventListeners() {
        // Restore saved onmousedown and ontouchstart
        const onMouseDownEvent = this._postponedEvents["onmousedown"]
        const onTouchStartEvent = this._postponedEvents["ontouchstart"]

        if (onMouseDownEvent) {
            this._tile.onmousedown = onMouseDownEvent

        }
        if (onTouchStartEvent) {
            this._tile.ontouchstart = onTouchStartEvent
        }

        // Add back css classes
        this._tile.classList.add(...this._postponedCssClasses)
        this._postponedCssClasses = []
    }


    private initializeTile() {
        this._tile.style.transform = `rotate(${this._orientation}deg)`

        if (this.isMovable()) {
            this._tile.classList.add("draggable")
        }

        if (this.tileProps.receiver) {
            this._tile.classList.add("dropzone")
        }

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