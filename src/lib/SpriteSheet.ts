import type { JsonTile, TilesData } from "./DependencyLoaders"

export default class SpriteSheet {
    private image: HTMLImageElement
    private width: number
    private height: number
    private tiles: Map<string, HTMLCanvasElement>
    private boundaries: Map<string, boolean[]>

    constructor(image: HTMLImageElement, width: number, height: number) {
        this.image = image
        this.width = width
        this.height = height
        this.tiles = new Map()
        this.boundaries = new Map()
    }

    public define(tile: JsonTile): void {
        const [x, y] = tile.index
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
        this.tiles.set(tile.name, buffer)

        if (tile.boundaries) {
            this.boundaries.set(tile.name, tile.boundaries)
        }
    }

    public getTile(name: string, size: number): HTMLImageElement {
        const tile = this.tiles.get(name)
        if (!tile) {
            return null
        }

        const image = document.createElement("img")
        image.width = size
        image.height = size
        image.src = tile.toDataURL()

        return image
    }

    public getBoundaries(name: string) {
        return this.boundaries.get(name)
    }

    public static createFromJson(image: HTMLImageElement, json: TilesData) {
        const sprites = new SpriteSheet(image, json.tileWidth, json.tileWidth)

        json.tiles.forEach(tile => {
            sprites.define(tile)
        })

        return sprites
    }
}