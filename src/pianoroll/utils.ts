export function repeat<T>(arr: T[], times: number): T[] {
    let output = []

    for (let i = 0; i < times; i++) {
        output = output.concat(...arr)
    }

    return output
}

export function canMatrixContain<T>(matrix: T[][], row: number, col: number): boolean {
    if (row >= matrix.length || matrix.length === 0) {
        return false
    }
    
    if (col >= matrix[row].length || matrix[row].length === 0) {
        return false
    }

    return true
}

export function makeMatrix<T>(rows: number, cols: number, value: T): T[][] {
    return resizeMatrix([], rows, cols, value)
}

export function resizeMatrix<T>(matrix: T[][], rows: number, cols: number, zeroValue: T): T[][] {
    let newMatrix = []

    for (let row = 0; row < rows; row++) {
        let thisRow = []
        
        for (let col = 0; col < cols; col++) {
            if (canMatrixContain(matrix, row, col)) {
                thisRow.push(matrix[row][col])
            } else {
                thisRow.push(zeroValue)
            }
        }

        newMatrix.push(thisRow)
    }


    return newMatrix
}