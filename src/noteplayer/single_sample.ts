import { Pitch, SEMITONE_RATIO } from "../notes";

export class SingleSample {
    buffer: AudioBuffer
    pitch: Pitch

    constructor(buffer: AudioBuffer, pitch: Pitch) {
        this.buffer = buffer
        this.pitch = pitch
    }

    static async fromUri(uri: string, pitch: Pitch, context: AudioContext): Promise<SingleSample> {
        const res = await fetch(uri)
        const buf = await res.arrayBuffer()

        const buffer = await context.decodeAudioData(buf)
        return new SingleSample(buffer, pitch)
    }

    // TODO: is it necessary to create a new source each time?
    private playBuffer(context: AudioContext, playbackRate: number) {
        const source = context.createBufferSource()
        source.buffer = this.buffer
        source.playbackRate.value = playbackRate
        source.connect(context.destination)
        source.start()
    }

    playRaw(context: AudioContext) {
        this.playBuffer(context, 1.0)
    }

    play(context: AudioContext, pitch: Pitch) {
        const semitonesDiff = pitch.difference(this.pitch)
        const speedDiff = 1.0 * Math.pow(SEMITONE_RATIO, semitonesDiff)

        this.playBuffer(context, speedDiff)
    }
}
