import * as n from '../notes'
import { SingleSample } from '../noteplayer/single_sample'
import { MultiSample } from '../noteplayer/multisample'
import { Sample } from '../noteplayer/sample'

const SAMPLE_SERVER = 'http://localhost:5005'

export const AVAILABLE_SAMPLES = {
    strings: [
        new n.Pitch(n.NOTE_A, 2),
        new n.Pitch(n.NOTE_A, 3),
        new n.Pitch(n.NOTE_A, 4),
        new n.Pitch(n.NOTE_C, 2),
        new n.Pitch(n.NOTE_C, 3),
        new n.Pitch(n.NOTE_C, 4),
        new n.Pitch(n.NOTE_D_SHARP, 2),
        new n.Pitch(n.NOTE_D_SHARP, 3),
        new n.Pitch(n.NOTE_D_SHARP, 4),
        new n.Pitch(n.NOTE_F_SHARP, 2),
        new n.Pitch(n.NOTE_F_SHARP, 3),
        new n.Pitch(n.NOTE_F_SHARP, 4),
    ],
    trumpet: [
        new n.Pitch(n.NOTE_A, 4),
        new n.Pitch(n.NOTE_A, 5),
        new n.Pitch(n.NOTE_C, 4),
        new n.Pitch(n.NOTE_C, 5),
        new n.Pitch(n.NOTE_D_SHARP, 4),
        new n.Pitch(n.NOTE_D_SHARP, 5),
        new n.Pitch(n.NOTE_F_SHARP, 4),
        new n.Pitch(n.NOTE_F_SHARP, 5),
    ],
}

export type Sound = keyof typeof AVAILABLE_SAMPLES

export async function loadSamples(context: AudioContext, sound: Sound): Promise<MultiSample> {
    const pitches = AVAILABLE_SAMPLES[sound]
    const promises: Promise<SingleSample>[] = []

    for (const pitch of pitches) {
        const pitchName = pitch.name({ lowercase: true, spellAccidentals: true })
        const fileName = `${sound}_${pitchName}.wav`
        const uri = `${SAMPLE_SERVER}/${fileName}`
        // const uri = `noteplayer/samples/${fileName}`

        const sample = SingleSample.fromUri(uri, pitch, context)
        
        promises.push(sample)
    }

    const samples = await Promise.all(promises)
    const multiSample = new MultiSample()
    for (const sample of samples) {
        multiSample.addSample(sample)
    }

    return multiSample
}