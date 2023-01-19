import type { Note, Pitch } from "../notes"
import { makeMatrix } from "./utils"
import type { Sample } from '../noteplayer/sample'

export type StepCallback = (step: number) => void

export class Sequence {
    pitches: Pitch[]
    octaves: number
    steps: number
    sequence: boolean[][]

    audioContext: AudioContext
    sample: Sample
    currentStep: number = 0

    playInterval: NodeJS.Timer
    stepCallback: StepCallback | null = null

    constructor(pitches: Pitch[], steps: number, audioContext: AudioContext, sample: Sample) {
        this.pitches = pitches
        this.steps = steps

        this.sequence = makeMatrix(this.pitches.length, steps, false)

        this.audioContext = audioContext
        this.sample = sample
    }

    onStep(callback: StepCallback) {
        this.stepCallback = callback
    }

    play() {
        const pitchesPlayed: Pitch[] = []
        for (const [i, row] of this.sequence.entries()) {
            const cell = row[this.currentStep]
            if (cell) {
                pitchesPlayed.push(this.pitches[i])
            }
        }

        for (const pitch of pitchesPlayed) {
            this.sample.play(this.audioContext, pitch)
        }
    }

    nextStep() {
        this.currentStep += 1
        this.currentStep %= this.steps

        if (this.stepCallback) {
            this.stepCallback(this.currentStep)
        }
    }

    startInterval(stepMs: number) {
        if (this.playInterval) {
            return
        }

        this.playInterval = setInterval(() => {
            this.play()
            this.nextStep()
        }, stepMs)
    }

    clearInterval() {
        clearInterval(this.playInterval)
    }
}

