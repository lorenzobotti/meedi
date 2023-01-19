import type { Pitch } from "../notes";
import type { SingleSample } from "./single_sample";

export class MultiSample {
    samples: SingleSample[]
    
    constructor() {
        this.samples = []
    }

    addSample(sample: SingleSample): MultiSample {
        this.samples.push(sample)
        return this
    }

    play(context: AudioContext, pitch: Pitch) {
        if (this.samples.length === 0) {
            throw new Error('no samples to play')
        }

        const distance = (a: Pitch, b: Pitch) => Math.abs(a.difference(b))

        let closest = this.samples[0]
        let closestDistance = Infinity

        for (const sample of this.samples) {
            const dist = distance(pitch, sample.pitch)
            if (dist >= closestDistance) {
                continue
            }

            closest = sample
            closestDistance = dist
        }

        console.log(`playing ${closest.pitch.name()} for ${pitch.name()}`)
        closest.play(context, pitch)
    }
}