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

    board.printBoardState()

    for (let i = 0; i < gameBoardSize; i++) {
        for (let j = 0; j < gameBoardSize; j++) {
            const jsonTile = levelData.board[i][j]

            const tileProps: TileProperties = {
                rotable: jsonTile.rotable,
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
            rotable: jsonTile.rotable,
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

    board.printBoardState()
    board.printBoundaryMap()

    return board
}

// Board json interfaces
export interface LevelsData {
    difficulty:     string;
    gameBoardSizes: number;
    tileDimensions: string;
    levels:         JsonLevel[];
}

export interface JsonLevel {
    name:            string;
    positions:       JsonPositions;
    pickBoardSize:   number;
    board:           Array<JsonPlayerPickTile[]>;
    playerPickTiles: JsonPlayerPickTile[];
    solution:        JsonSolution[];
}

export interface JsonPlayerPickTile {
    tile:        string;
    orientation: number;
    rotable:     boolean;
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

export interface Positions {
    start:  Vec2;
    finish: Vec2;
}
