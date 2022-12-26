import { TilesBoard, type TileIdFormat } from "./Tile";
import type Tile from "./Tile";

export default class Board {
    private readonly _gameBoardSize: number
    private readonly _pickBoardSize: number
    private _gameBoard: Tile[][]
    private _pickBoard: Tile[]


    constructor(gameBoardSize: number, pickBoardSize: number) {
        this._gameBoardSize = gameBoardSize
        this._pickBoardSize = pickBoardSize
        this._pickBoard = new Array(pickBoardSize)
        this._gameBoard = new Array(gameBoardSize)

        for (let i = 0; i < gameBoardSize; i++) {
            this._gameBoard[i] = new Array(gameBoardSize)
        }
    }


    public get gameBoardSize(): number {
        return this._gameBoardSize
    }


    public get pickBoardSize(): number {
        return this._pickBoardSize
    }


    /**
     * Set tile in a matrix grid with [0, 0] in top left corner.
     * @param tile new tile to be set
     * @param x 2D coordinate x element, zero-based
     * @param y 2D coordinate y element, zero-based
     */
    public setGameBoardItem(tile: Tile, x: number, y: number): void {
        if (x < 0 || y < 0 ||
            x > this._gameBoardSize || y > this._gameBoardSize) {
            return
        }
        this._gameBoard[y][x] = tile
    }


    public setPickBoardItem(tile: Tile, index: number) {
        if (index > this._pickBoard.length) {
            return
        }
        this._pickBoard[index] = tile
    }


    public getGameBoardItem(x: number, y: number) {
        if (x < 0 || y < 0 ||
            x > this._gameBoardSize || y > this._gameBoardSize) {
            return null
        }
        return this._gameBoard[y][x]
    }


    public getPickBoardItem(index: number) {
        if (index > this._pickBoard.length) {
            return
        }
        return this._pickBoard[index]
    }


    public populateGameBoardContainer(container: Element) {
        for (let y = 0; y < this.gameBoardSize; y++) {
            for (let x = 0; x < this.gameBoardSize; x++) {
                const tile = this.getGameBoardItem(x, y)
                container.appendChild(tile.getHTMLElement())
            }
        }
    }

    public populatePickBoardContainer(container: Element) {
        for (let i = 0; i < this.pickBoardSize; i++) {
            const tile = this.getPickBoardItem(i)
            container.appendChild(tile.getHTMLElement())
        }
    }


    public replaceTiles(fromId: string, toId: string) {
        const fromPos = this.decodeTileId(fromId)
        const toPos = this.decodeTileId(toId)

        if (fromPos.tileAt === TilesBoard.Game && toPos.tileAt === TilesBoard.Game) {
            this.replaceTilesFromGameToGame(fromPos.position, toPos.position)
        }
        else if (fromPos.tileAt === TilesBoard.Pick && toPos.tileAt === TilesBoard.Game) {
            this.replaceTilesFromPickToGame(fromPos.index, toPos.position)
        }
        else if (fromPos.tileAt === TilesBoard.Game && toPos.tileAt === TilesBoard.Pick) {
            this.replaceTilesFromPickToGame(toPos.index, fromPos.position)
        }
    }


    private replaceTilesFromPickToGame(index: number, pos: Array<number>) {
        const tmp = this.getPickBoardItem(index)

        this.setPickBoardItem(this.getGameBoardItem(pos[0], pos[1]), index)
        this.setGameBoardItem(tmp, pos[0], pos[1])
    }


    private replaceTilesFromGameToGame(posFrom: Array<number>, posTo: Array<number>) {
        const tmp = this.getGameBoardItem(posFrom[0], posFrom[1])

        this.setGameBoardItem(this.getGameBoardItem(posTo[0], posTo[1]), posFrom[0], posFrom[1])
        this.setGameBoardItem(tmp, posTo[0], posTo[1])
    }


    private decodeTileId(tileId: string): TileIdFormat {
        if (tileId.length === 1) {
            return {
                tileAt: TilesBoard.Pick,
                index: parseInt(tileId),
                position: null
            }
        }
        
        const strPos = tileId.split("-")
        return {
            tileAt: TilesBoard.Game,
            index: null,
            position: [parseInt(strPos[0]), parseInt(strPos[1])]
        }
    }


    // ==================== DEBUG METHODS ====================
    printGameBoard() {
        const gameBoardSize = this._gameBoard.length
        const tileNames = []

        for (let y = 0; y < gameBoardSize; y++) {
            tileNames.push([])
            for (let x = 0; x < gameBoardSize; x++) {
                const tile = this.getGameBoardItem(x, y)
                const name = tile ?
                    `${tile.getName()} - ${tile.getOrientation()}` :
                    "uninitialized"
                tileNames[y].push(name)
            }
        }
        console.table(tileNames)
    }


    printPickBoard() {
        const pickBoardSize = this._pickBoard.length
        const tileNames = []

        for (let i = 0; i < pickBoardSize; i++) {
            const tile = this.getPickBoardItem(i)
            const name = tile ?
                    `${tile.getName()} - ${tile.getOrientation()}` :
                    "uninitialized"
            tileNames.push(name)
        }
        console.table(tileNames)
    }


    printBoardState() {
        this.printGameBoard()
        this.printPickBoard()
    }
}