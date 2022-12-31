export type Difficulty = "easy" | "hard"

export type LevelDetails = {
    difficulty: Difficulty,
    gameBoardSize: number,
    tileDimensions: number,
}