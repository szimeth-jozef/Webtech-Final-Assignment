import type { Difficulty } from "../types/game.type"

interface DifficultyOption {
    id: Difficulty,
    text: string
}

export const difficultyTranslation = {
    "easy": "Ľahká",
    "hard": "Ťažká"
}

export const difficulties: Array<DifficultyOption> = [
    {
        id: "easy",
        text: difficultyTranslation["easy"]
    },
    {
        id: "hard",
        text: difficultyTranslation["hard"]
    }
]