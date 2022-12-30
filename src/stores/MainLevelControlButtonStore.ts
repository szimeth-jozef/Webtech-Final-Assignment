import { writable } from "svelte/store"

export enum MainButtonAction {
    BallRoll = "BALL_ROLL",
    EditBoard = "EDIT_BOARD"
}

export interface MainButtonState {
    isDisabled: boolean,
    buttonAction: MainButtonAction
}

export const mainButtonState = writable<MainButtonState>({
    isDisabled: true,
    buttonAction: MainButtonAction.BallRoll
})