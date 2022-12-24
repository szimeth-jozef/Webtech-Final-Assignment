export default class SpriteSheet {
    private image: HTMLImageElement
    private width: number
    private height: number
    private tiles: Map<string, HTMLCanvasElement>

    constructor(image: HTMLImageElement, width: number, height: number) {
        this.image = image
        this.width = width
        this.height = height
        this.tiles = new Map()
    }

    public define(name: string, x: number, y: number): void {
        const buffer = document.createElement("canvas")
        buffer.width = this.width
        buffer.height = this.height
        buffer
            .getContext("2d")
            .drawImage(
                this.image,
                x*this.width,
                y*this.height,
                this.width,
                this.height,
                0,
                0,
                this.width,
                this.height)
        this.tiles.set(name, buffer)
    }

    public get(name: string): HTMLImageElement {
        const tile = this.tiles.get(name)
        if (!tile) {
            return null
        }

        const image = document.createElement("img")
        image.width = this.width
        image.height = this.height
        image.src = tile.toDataURL()

        return image
    }
}