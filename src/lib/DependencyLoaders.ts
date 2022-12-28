export function fetchLevels(difficulty: string) {
    const url = `levels/${difficulty}.json`

    return fetchJsonFile(url)
}

export function fetchTiles(): Promise<TilesData> {
    const url = "tiles.json"

    return fetchJsonFile(url)
}

async function fetchJsonFile(url: string) {
    const response = await fetch(url)
    if (response.ok) {
        return await response.json()
    }

    return Promise.reject(response.statusText)
}

export function fetchSpriteSheet(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        // ==== Artificial delay 3 seconds ====
        // image.onload = () => setTimeout(() => {
        //     console.log("Image loaded")
        //     resolve(image)
        // }, 3000)
        // ====================================
        image.onerror = () => reject(`Couldn't load sprite-sheet from [${url}]`)
        image.src = url
    })
}

// Tiles json interfaces
export interface TilesData {
    tileWidth:  number;
    tileHeight: number;
    tiles:      JsonTile[];
}

export interface JsonTile {
    name:       string;
    index:      number[];
    boundaries: boolean[] | null;
}