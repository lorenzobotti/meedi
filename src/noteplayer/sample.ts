import type { Pitch } from "../notes";

export interface Sample {
    play: (context: AudioContext, pitch: Pitch) => void
}