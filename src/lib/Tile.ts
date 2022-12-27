export default class Tile {
    private tile: HTMLImageElement
    private orientation: number
    private tileProps: TileProperties
    private eventStore: object
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
        this.eventStore = {}
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

    public isEmpty() {
        return this.name === "none"
    }

    public disableMovementEventListeners() {
        // Save onmousedown and ontouchstart then set them to null
        this.eventStore["onmousedown"] = this.tile.onmousedown
        this.eventStore["ontouchstart"] = this.tile.ontouchstart

        this.tile.onmousedown = null
        this.tile.ontouchstart = null

        // Remove css class "draggable"
        this.tile.classList.remove("draggable")
    }

    public enableMovementEventListeners() {
        // Restore saved onmousedown and ontouchstart
        const onMouseDownEvent = this.eventStore["onmousedown"]
        const onTouchStartEvent = this.eventStore["ontouchstart"]

        if (onMouseDownEvent) {
            this.tile.onmousedown = onMouseDownEvent

        }
        if (onTouchStartEvent) {
            this.tile.ontouchstart = onTouchStartEvent
        }

        // Add back css class "draggable"
        this.tile.classList.add("draggable")
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