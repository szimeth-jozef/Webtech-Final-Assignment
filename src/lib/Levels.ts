// TODO: if cached level continue with that
// else get random level (FOR DEBUG IT IS ALWAYS THE FIRST LEVEL)

import Board from "./Board"
import type SpriteSheet from "./SpriteSheet"
import Tile, { type TileProperties } from "./Tile"

export function createBoard(levelsData, sprites: SpriteSheet) {
    const gameBoardSize: number = levelsData.gameBoardSizes
        
    const levelData = levelsData.levels[0]
    const pickBoardSize: number = levelData.pickBoardSize

    const board = new Board(gameBoardSize, pickBoardSize)
    board.printBoardState()

    for (let i = 0; i < gameBoardSize; i++) {
        for (let j = 0; j < gameBoardSize; j++) {
            const jsonTile = levelData.board[i][j]

            const tileProps: TileProperties = {
                rotable: jsonTile.rotable,
                movable: jsonTile.movable,
                receiver: jsonTile.receiver
            }

            const imgElm = sprites.get(jsonTile.tile)
            imgElm.setAttribute("id", `${j}-${i}`)

            const tile = new Tile(
                imgElm,
                jsonTile.orientation,
                tileProps,
                jsonTile.tile
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

        const imgElm = sprites.get(jsonTile.tile)
        imgElm.setAttribute("id", i.toString())

        const tile = new Tile(
            imgElm,
            jsonTile.orientation,
            tileProps,
            jsonTile.tile
        )
        board.setPickBoardItem(tile, i)
    }

    board.printBoardState()

    return board

}