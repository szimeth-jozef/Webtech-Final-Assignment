import { describe, expect, it } from "vitest"
import TileBoundary from "../src/lib/TileBoudary"
import { sum } from '../src/utils/math'

interface Range {
    from: number,
    to: number
}

function compareArrays(a: Array<any>, b: Array<any>): boolean {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

function testBoundaryClockwiseRotationOnRange(range: Range, boundaryGiven: boolean[], boundaryExpected: boolean[]): number[] {
    let testedCount = 0
    let correctCount = 0

    for (let i = range.from; i <= range.to; i++) {
        const tileBoundary = new TileBoundary(boundaryGiven, i)
        if (compareArrays(boundaryExpected, tileBoundary.boundary)) {
            correctCount++
        }
        testedCount++
    }

    return [testedCount, correctCount]
}

describe("#TileBoundary.rotateClockwise", () => {

    it("bundaries should be the same when orientation is not given, so by default 0", () => {
        const boundary = [false, true, true, true]
        const tileBoundary = new TileBoundary(boundary)
        expect(compareArrays(boundary, tileBoundary.boundary)).toBe(true)
    })

    it("bundaries should be the same when orientation is from range <0, 89>", () => {
        const boundary = [false, true, false, true]
        
        const range: Range = { from: 0, to: 89 }
        const [testedCount, correctCount] = testBoundaryClockwiseRotationOnRange(range, boundary, boundary)

        expect(correctCount).toBe(testedCount)
    })

    it("bundaries should be rotated clockwise by 1 when orientation is from range <90, 179>", () => {
        const boundaryGiven = [false, false, true, true]
        const boundaryExpected = [true, false, false, true]
        
        const range: Range = { from: 90, to: 179 }
        const [testedCount, correctCount] = testBoundaryClockwiseRotationOnRange(range, boundaryGiven, boundaryExpected)

        expect(correctCount).toBe(testedCount)
    })

    it("bundaries should be rotated clockwise by 2 when orientation is from range <180, 269>", () => {
        const boundaryGiven = [false, false, true, true]
        const boundaryExpected = [true, true, false, false]

        const range: Range = { from: 180, to: 269 }
        const [testedCount, correctCount] = testBoundaryClockwiseRotationOnRange(range, boundaryGiven, boundaryExpected)

        expect(correctCount).toBe(testedCount)
    })

    it("bundaries should be rotated clockwise by 3 when orientation is from range <270, 359>", () => {
        const boundaryGiven = [false, false, true, true]
        const boundaryExpected = [false, true, true, false]

        const range: Range = { from: 270, to: 359 }
        const [testedCount, correctCount] = testBoundaryClockwiseRotationOnRange(range, boundaryGiven, boundaryExpected)

        expect(correctCount).toBe(testedCount)
    })

    it("if orientation is more than 359 it should be clipped to range <0, 359> and rotate accordingly", () => {
        let range: Range = { from: 360, to: 449 }
        const [testedCount1, correctCount1] = testBoundaryClockwiseRotationOnRange(
            range,
            [false, false, true, true],
            [false, false, true, true]
        )

        range = { from: 450, to: 539 }
        const [testedCount2, correctCount2] = testBoundaryClockwiseRotationOnRange(
            range,
            [false, false, true, true],
            [true, false, false, true]
        )

        range = { from: 540, to: 629 }
        const [testedCount3, correctCount3] = testBoundaryClockwiseRotationOnRange(
            range,
            [false, false, true, true],
            [true, true, false, false]
        )

        range = { from: 630, to: 719 }
        const [testedCount4, correctCount4] = testBoundaryClockwiseRotationOnRange(
            range,
            [false, false, true, true],
            [false, true, true, false]
        )

        expect(sum(correctCount1, correctCount2, correctCount3, correctCount4))
            .toBe(sum(testedCount1, testedCount2, testedCount3, testedCount4))
    })

})