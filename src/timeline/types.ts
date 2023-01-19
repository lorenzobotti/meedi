export interface ClipInfo {
    name: string
    color: string
    bars: number
}

export interface Cell {
    clip?: ClipInfo | null
    row: number,
    column: number,
}

export interface Coord {
    row: number,
    col: number,
}

export interface DragInfo {
    movedClip: null | ClipInfo,

    start: Coord,
    current: Coord,
    dragging: boolean
}