export function randint(a: number, b: number): number {
    const random = Math.random() * (b - a + 1)
    return Math.floor(random) + a
}

export function randchoice(pool: Array<any>) {
    if (pool.length === 0) {
        return null
    }

    const randIndex = randint(0, pool.length - 1)
    return pool[randIndex]
}