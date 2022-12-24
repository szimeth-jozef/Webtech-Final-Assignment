import type Tile from "./Tile";

export default class Board {
    private gameBoard: Tile[][]
    private pickBoard: Tile[]

    constructor(gameBoardSize: number, pickBoardSize: number) {
        this.pickBoard = new Array(pickBoardSize)
        this.gameBoard = new Array(gameBoardSize)

        for (let i = 0; i < gameBoardSize; i++) {
            this.gameBoard[i] = new Array(gameBoardSize)
        }
    }

    /**
     * Set tile in a matrix grid with [0, 0] in top left corner.
     * @param tile new tile to be set
     * @param x 2D coordinate x element, zero-based
     * @param y 2D coordinate y element, zero-based
     */
    public setGameBoardItem(tile: Tile, x: number, y: number): void {
        if (x < 0 || y < 0 ||
            x > this.gameBoard.length || y > this.gameBoard.length) {
            return
        }
        this.gameBoard[y][x] = tile
    }

    public setPickBoardItem(tile: Tile, index: number) {
        if (index > this.pickBoard.length) {
            return
        }
        this.pickBoard[index] = tile
    }

    public getGameBoardItem(x: number, y: number) {
        if (x < 0 || y < 0 ||
            x > this.gameBoard.length || y > this.gameBoard.length) {
            return null
        }
        return this.gameBoard[y][x]
    }

    public getPickBoardItem(index: number) {
        if (index > this.pickBoard.length) {
            return
        }
        return this.pickBoard[index]
    }

    public getGameBoardSize() {
        return this.gameBoard.length
    }

    // ==================== DEBUG METHODS ====================
    printGameBoard() {
        const gameBoardSize = this.gameBoard.length
        const tileNames = []

        for (let y = 0; y < gameBoardSize; y++) {
            tileNames.push([])
            for (let x = 0; x < gameBoardSize; x++) {
                const tile = this.getGameBoardItem(x, y)
                tileNames[y].push(tile ? tile.getName() : "uninitialized")
            }
        }

        console.table(tileNames)
    }
}