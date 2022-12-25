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