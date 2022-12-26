export async function fetchLevels(difficulty:string) {
    const url = `levels/${difficulty}.json`

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