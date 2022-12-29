import { describe, expect, it } from "vitest"
import { subtractArrays } from "../src/utils/math"


class Stock {
    public type: string
    constructor(type: string) {
      this.type = type
    }
  }

describe("#Math.subtractArrays", () => {

    it("empty array subtracted from base should return the same base array", () => {
        const base = [1, 2, 3, 4, 5]
        expect(subtractArrays(base, [])).toStrictEqual(base)
    })

    it("array with one of the item of the base array should return base array without that one common item", () => {
        const base = [1, 2, 3, 4, 5]
        expect(subtractArrays(base, [1, 8, 12, 9, 10])).toStrictEqual([2, 3, 4, 5])
        expect(subtractArrays(base, [2, 7, 10, 8])).toStrictEqual([1, 3, 4, 5])
        expect(subtractArrays(base, [3, 9, 11])).toStrictEqual([1, 2, 4, 5])
        expect(subtractArrays(base, [4, 50])).toStrictEqual([1, 2, 3, 5])
        expect(subtractArrays(base, [5])).toStrictEqual([1, 2, 3, 4])
    })

    it("array with two items of the base array should return base array without those two common items", () => {
        const base = [1, 2, 3, 4, 5]
        expect(subtractArrays(base, [1, 5, 12, 13, 14, 15])).toStrictEqual([2, 3, 4])
        expect(subtractArrays(base, [2, 3, 9, 10, 11])).toStrictEqual([1, 4, 5])
        expect(subtractArrays(base, [3, 4, 7, 8])).toStrictEqual([1, 2, 5])
        expect(subtractArrays(base, [4, 2, 6])).toStrictEqual([1, 3, 5])
        expect(subtractArrays(base, [5, 1])).toStrictEqual([2, 3, 4])
    })

    it("array with three items of the base array should return base array without those three common items", () => {
        const base = [1, 2, 3, 4, 5]
        expect(subtractArrays(base, [1, 5, 2, 12, 13, 14, 15])).toStrictEqual([3, 4])
        expect(subtractArrays(base, [2, 3, 1, 9, 10, 11])).toStrictEqual([4, 5])
        expect(subtractArrays(base, [3, 4, 1, 7, 8])).toStrictEqual([2, 5])
        expect(subtractArrays(base, [4, 2, 1, 6])).toStrictEqual([3, 5])
        expect(subtractArrays(base, [5, 1, 2])).toStrictEqual([3, 4])
    })

    it("array with the same item as base item should return empty array", () => {
        const base = [1, 2, 3, 4, 5]
        expect(subtractArrays(base, [1, 2, 3, 4, 5])).toStrictEqual([])
    })

})