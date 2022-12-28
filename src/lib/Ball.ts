import { Vec2 } from "../utils/math";
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
        const startPos = this._board.startIndexPosition.multiply(this._ballTile.width)
        this._position = startPos
        this._gameBoardElement.appendChild(this._ballTile)
        this.updateBallPositionInDOM()
    }

    public removeBallFromBoard() {
        this._ballTile.remove()
    }

    public isInFinish() {
        const currentIndexPos = this._position
            .copy()
            .divide(this._ballTile.width)
        return currentIndexPos.equals(this._board.finishIndexPosition)
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
            console.log(`Cannot go ${direction}, out of board`)
            return
        }

        // Check if it is possible to move this way
        // First check current tile whether it is possible to go that way, if not return
        const currentIndexPos = this._position.copy().divide(this._ballTile.width)
        const currentTile = this._board.getGameBoardItem(currentIndexPos.x, currentIndexPos.y)
        const currentTileBoundary = currentTile.boundary.getBoundaryByDirection(direction)
        if (!currentTileBoundary) {
            console.log(`Current tile's ${direction} is blocked`)
            return
        }
        
        // Second check next tile whether it is possible to go that way, if not return
        const nextIndexPos = newPos.copy().divide(this._ballTile.width)
        const nextTile = this._board.getGameBoardItem(nextIndexPos.x, nextIndexPos.y)
        const nextTileBondary = nextTile.boundary.getBoundaryByDirection(reverseDirection(direction))
        if (!nextTileBondary) {
            console.log(`Next tile's ${direction} is blocked`)
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

function reverseDirection(dir: Direction) {
    switch (dir) {
        case Direction.UP:
            return Direction.DOWN
        case Direction.DOWN:
            return Direction.UP
        case Direction.LEFT:
            return Direction.RIGHT
        case Direction.RIGHT:
            return Direction.LEFT
    }
}