import Vec2 from "../utils/math";
import type Board from "./Board";

export default class Ball {
    private readonly _board: Board
    private readonly _gameBoardElement: HTMLDivElement
    private _ballTile: HTMLImageElement
    private _position: Vec2

    constructor(board: Board, gameBoardElement: HTMLDivElement, ballTile: HTMLImageElement) {
        this._board = board
        this._gameBoardElement = gameBoardElement
        this._ballTile = ballTile
        this._position = new Vec2(0, 0)

        // Set basic css properties
        ballTile.style.position = "absolute"
    }

    public placeBallAtStart() {
        this._position = new Vec2(0, 0)
        this._gameBoardElement.appendChild(this._ballTile)
        this.updateBallPositionInDOM()
    }

    public removeBallFromBoard() {
        this._ballTile.remove()
    }

    public moveBall(direction: Direction) {
        const moveBy = this._ballTile.width
        const boardWidth = moveBy * (this._board.gameBoardSize - 1)
        const dir = new Vec2(0, 0)

        switch (direction) {
            case Direction.UP:
                dir.set(0, -moveBy)
                break
            case Direction.DOWN:
                dir.set(0, moveBy)
                break
            case Direction.LEFT:
                dir.set(-moveBy, 0)
                break
            case Direction.RIGHT:
                dir.set(moveBy, 0)
                break
        }

        const newPos = Vec2.addVecs(this._position, dir)
        if (newPos.x < 0 || newPos.x > boardWidth ||
            newPos.y < 0 || newPos.y > boardWidth) {
            return
        }

        this._position.add(dir)
        this.updateBallPositionInDOM()
    }

    private updateBallPositionInDOM() {
        this._ballTile.style.left = `${this._position.x}px`
        this._ballTile.style.top = `${this._position.y}px`
    }
}

export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}