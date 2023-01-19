export const NOTE_C = 0
export const NOTE_C_SHARP = 1
export const NOTE_D_FLAT = 1
export const NOTE_D = 2
export const NOTE_D_SHARP = 3
export const NOTE_E_FLAT = 3
export const NOTE_E = 4
export const NOTE_F = 5
export const NOTE_F_SHARP = 6
export const NOTE_G_FLAT = 6
export const NOTE_G = 7
export const NOTE_G_SHARP = 8
export const NOTE_A_FLAT = 8
export const NOTE_A = 9
export const NOTE_A_SHARP = 10
export const NOTE_B_FLAT = 10
export const NOTE_B = 11

export const NUMBER_OF_NOTES = 12 // octave is divided in 12 notes
export const SEMITONE_RATIO = 1.05946309436 // 12th root of 2
export const A_440 = 440 // 440Hz

export type Note =
    | typeof NOTE_C
    | typeof NOTE_C_SHARP | typeof NOTE_D_FLAT
    | typeof NOTE_D
    | typeof NOTE_D_SHARP | typeof NOTE_E_FLAT
    | typeof NOTE_E
    | typeof NOTE_F
    | typeof NOTE_F_SHARP | typeof NOTE_G_FLAT
    | typeof NOTE_G
    | typeof NOTE_G_SHARP | typeof NOTE_A_FLAT
    | typeof NOTE_A
    | typeof NOTE_A_SHARP | typeof NOTE_B_FLAT
    | typeof NOTE_B


export class Pitch {
    note: Note
    octave: number

    constructor(note: Note, octave: number) {
        this.note = note
        this.octave = octave
    }

    frequency(): number {
        const semitonesDiff = this.difference(new Pitch(NOTE_A, 4))
        const ratio = Math.pow(SEMITONE_RATIO, semitonesDiff)
        
        const freq = A_440 * ratio
        return freq
    }

    difference(other: Pitch): number {
        const semitonesThis = this.note + this.octave * NUMBER_OF_NOTES
        const semitonesOther = other.note + other.octave * NUMBER_OF_NOTES
    
        return semitonesThis - semitonesOther
    }

    name(options?: NameOptions): string {
        return pitchName(this, options)
    }
}

export interface NameOptions {
    preferFlat?: boolean
    spellAccidentals?: boolean
    spellAccidentalsWithSpace?: boolean
    includeOctave?: boolean
    lowercase?: boolean
    dash?: boolean
}

export function noteName(note: Note, options?: NameOptions): string {
    const notes = {
        normal: {
            [NOTE_C]: 'C',
            [NOTE_D]: 'D',
            [NOTE_E]: 'E',
            [NOTE_F]: 'F',
            [NOTE_G]: 'G',
            [NOTE_A]: 'A',
            [NOTE_B]: 'B',
        }, 
        accidentals: {
            [NOTE_C_SHARP]: {sharp: 'C#', flat: 'Db'},
            [NOTE_D_SHARP]: {sharp: 'D#', flat: 'Eb'},
            [NOTE_F_SHARP]: {sharp: 'F#', flat: 'Gb'},
            [NOTE_G_SHARP]: {sharp: 'G#', flat: 'Ab'},
            [NOTE_A_SHARP]: {sharp: 'A#', flat: 'Bb'},
        },
    }

    if (note in notes.normal) {
        let name: string = notes.normal[note]

        if (options?.lowercase) {
            name = name.toLowerCase()
        }

        return name
    }

    if (note in notes.accidentals) {
        const preferFlat = options?.preferFlat ?? false
        const option = preferFlat ? 'flat' : 'sharp'

        let name: string = notes.accidentals[note][option]

        if (options?.lowercase) {
            name = name.toLowerCase()
        }

        if (options?.spellAccidentals) {
            const ntName = name.slice(0, -1)
            const useSpace = options.spellAccidentalsWithSpace ?? false
            const space = useSpace ? ' ' : ''

            name = ntName + space + option
        }

        return name
    }

    throw new Error(`can't find note ${note}`)
}

export function pitchName(pitch: Pitch, options?: NameOptions): string {
    const ntName = noteName(pitch.note, options)
    const octave = pitch.octave

    if (options?.dash) {
        return `${ntName}-${octave}`
    } else {
        return `${ntName}${octave}`
    }
}