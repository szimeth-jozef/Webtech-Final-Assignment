import { Vec2 } from "../utils/math"
import Board from "./Board"
import type SpriteSheet from "./SpriteSheet"
import Tile, { type TileProperties } from "./Tile"

export function createBoard(levelData: JsonLevel, sprites: SpriteSheet, gameBoardSize: number, tileDimensions: number) {
    const pickBoardSize: number = levelData.pickBoardSize

    const positions: Positions =  {
        start: new Vec2(levelData.positions.start[0], levelData.positions.start[1]),
        finish: new Vec2(levelData.positions.finish[0], levelData.positions.finish[1])
    }

    const board = new Board(gameBoardSize, pickBoardSize, positions)

    for (let i = 0; i < gameBoardSize; i++) {
        for (let j = 0; j < gameBoardSize; j++) {
            const jsonTile = levelData.board[i][j]

            const tileProps: TileProperties = {
                movable: jsonTile.movable,
                receiver: jsonTile.receiver
            }

            const imgElm = sprites.getTile(jsonTile.tile, tileDimensions)
            imgElm.setAttribute("id", `${j}-${i}`)

            const tile = new Tile(
                imgElm,
                jsonTile.orientation,
                tileProps,
                jsonTile.tile,
                sprites.getBoundaries(jsonTile.tile)
            )
            board.setGameBoardItem(tile, j, i)
        }
    }

    for (let i = 0; i < pickBoardSize; i++) {
        const jsonTile = levelData.playerPickTiles[i]

        const tileProps: TileProperties = {
            movable: jsonTile.movable,
            receiver: jsonTile.receiver
        }

        const imgElm = sprites.getTile(jsonTile.tile, tileDimensions)
        imgElm.setAttribute("id", i.toString())

        const tile = new Tile(
            imgElm,
            jsonTile.orientation,
            tileProps,
            jsonTile.tile,
            sprites.getBoundaries(jsonTile.tile)
        )
        board.setPickBoardItem(tile, i)
    }

    return board
}

export function renderSolutionBoardImage(levelData: JsonLevel, sprites: SpriteSheet, tileDimensions: number): string {
    const boardSize = levelData.board.length
    const buffer = document.createElement("canvas")
    buffer.width = boardSize*tileDimensions
    buffer.height = boardSize*tileDimensions

    const tileBuffers = []

    // Get unsolved board tiles
    for (const jsonRow of levelData.board) {
        tileBuffers.push(jsonRow.map(jsonTile => {
            return sprites.getOrientedBuffer(
                jsonTile.tile,
                tileDimensions,
                jsonTile.orientation
            )
        }))
    }

    // Replace missing tiles based on the solution
    for (const solution of levelData.solution) {
        const x = solution.pos[0]
        const y = solution.pos[1]
        tileBuffers[y][x] = sprites.getOrientedBuffer(
            solution.name,
            tileDimensions,
            solution.orientation
        )
    }

    // Render single image from tile buffers
    const ctx = buffer.getContext("2d")
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const img = tileBuffers[i][j]
            ctx.drawImage(img,
                0, 0, tileDimensions, tileDimensions,
                j*tileDimensions, i*tileDimensions, tileDimensions, tileDimensions
            )
        }
    }

    return buffer.toDataURL()
}

// Board json interfaces
export interface LevelsData {
    difficulty:     string;
    gameBoardSizes: number;
    tileDimensions: string;
    levels:         JsonLevel[];
}

export interface JsonLevel {
    name:                string;
    positions:           JsonPositions;
    pickBoardSize:       number;
    board:               Array<JsonBoardTile[]>;
    playerPickTiles:     JsonBoardTile[];
    solution:            JsonSolution[];
    solutionDescription: JsonSolutionDescription;
}

export interface JsonBoardTile {
    tile:        string;
    orientation: number;
    movable:     boolean;
    receiver:    boolean;
}

export interface JsonPositions {
    start:  number[];
    finish: number[];
}

export interface JsonSolution {
    pos:         number[];
    name:        string;
    orientation: number;
}

export interface JsonSolutionDescription {
    mobile:  string;
    desktop: string;
}

export interface Positions {
    start:  Vec2;
    finish: Vec2;
}
