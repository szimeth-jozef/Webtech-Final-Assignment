import type Board from "./Board";

export default class Ball {
    private readonly _board: Board
    private readonly _gameBoardElement: HTMLDivElement
    private _ballTile: HTMLImageElement
    private _position: Array<number>

    constructor(board: Board, gameBoardElement: HTMLDivElement, ballTile: HTMLImageElement) {
        this._board = board
        this._gameBoardElement = gameBoardElement
        this._ballTile = ballTile
        this._position = [0, 0]

        // Set basic css properties
        ballTile.style.position = "absolute"
    }

    public placeBallAtStart() {
        this._position = [0, 0]
        this._gameBoardElement.appendChild(this._ballTile)
        this._ballTile.style.top = `${this._position[0]}px`
        this._ballTile.style.left = `${this._position[1]}px`
    }

    public removeBallFromBoard() {
        this._ballTile.remove()
    }
}