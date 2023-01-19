<script lang="ts">
	import { makeMatrix } from "../pianoroll/utils";
	import Clip from "./Clip.svelte";
	import type { Cell, ClipInfo, Coord, DragInfo } from "./types";

	export let rows: number = 4;
	export let columns: number = 4;

	// let grid: Slot[][] = makeMatrix(4, 4, null)
	let clips: Cell[] = [
		{
			clip: { color: "lime", name: "bass intro", bars: 1 },
			row: 1,
			column: 0,
		},
		{
			clip: { color: "brown", name: "chorus", bars: 1 },
			row: 1,
			column: 1,
		},
		{
			clip: { color: "orange", name: "outro", bars: 2 },
			row: 2,
			column: 1,
		},
		{ clip: { color: "red", name: "verse 1", bars: 1 }, row: 3, column: 3 },
	];

	function makeGrid(clips: Cell[]) {
		const newGrid: Cell[][] = [];

		for (let currentRow = 0; currentRow < rows; currentRow++) {
			const thisRow: Cell[] = [];
			let lastEmptyColumn = 0;

			cellLoop:
			for (let currentColumn = 0; currentColumn < columns; currentColumn++) {
				if (currentColumn < lastEmptyColumn) {
					continue cellLoop
				}

				const thisCell: Cell | null =
					clips.find(
						(c) => c.row == currentRow && c.column === currentColumn
					) ?? null;

				if (thisCell) {
					lastEmptyColumn = currentColumn + thisCell.clip.bars;
					thisRow.push(thisCell)

					console.log(`${currentRow}-${currentColumn} -> ${thisCell.clip.name}`);
				} else {
					thisRow.push({
						column: currentColumn,
						row: currentRow,
						clip: null,
					})
				}
			}

			newGrid.push(thisRow)
		}

		console.log(newGrid)

		return newGrid;
	}

	function printGrid(g: Cell[][]) {
		let output = "";

		for (const row of g) {
			for (const cell of row) {
				if (cell.clip) {
					output += `c${cell.clip.bars}`;
				} else {
					output += `n`;
				}
			}

			output += "\n";
		}

		console.log(output);
	}

	function moveClip(from: Coord, to: Coord) {
		const clipIndex = clips
			.findIndex(c => c.column === from.col && c.row === from.row)

		if (clipIndex < 0) {
			throw new Error(`can't find clip at ${from.row}-${from.col}`)
		}

		clips[clipIndex].column = to.col
		clips[clipIndex].row = to.row

		clips = clips
	}

	// const grid: Cell[][] = [
	// 	[
	// 		{column: 0, row: 0, clip: null},
	// 		{column: 1, row: 0, clip: null},
	// 		{column: 2, row: 0, clip: null},
	// 		{column: 3, row: 0, clip: null},
	// 	],
	// 	[
	// 		{column: 0, row: 1, clip: null},
	// 		{column: 1, row: 1, clip: null},
	// 		{column: 2, row: 1, clip: null},
	// 		{column: 3, row: 1, clip: null},
	// 	],
	// 	[
	// 		{column: 0, row: 2, clip: null},
	// 		{column: 1, row: 2, clip: { bars: 2, color: 'coral', name: 'burger' }},
	// 		{column: 3, row: 2, clip: null},
	// 	],
	// 	[
	// 		{column: 0, row: 3, clip: null},
	// 		{column: 1, row: 3, clip: null},
	// 		{column: 2, row: 3, clip: null},
	// 		{column: 3, row: 3, clip: null},
	// 	],
	// ]

	let grid = makeGrid(clips)
	$: grid = makeGrid(clips);

	let dragInfo: DragInfo = {
		movedClip: null,

		start: { row: 0, col: 0 },
		current: { row: 0, col: 0 },
		dragging: false,
	};
</script>

<div
	class="timeline"
	style="--num-rows: {grid.length}; --num-cols: {grid[0].length};"
>
	{#each grid as row, rowIndex}
		{#each row as cell, colIndex}
			<Clip
				row={cell.row}
				column={cell.column}
				clip={cell.clip}
				isDragStart={dragInfo.dragging &&
					dragInfo.start.row == cell.row &&
					dragInfo.start.col == cell.column}


				onDragStart={(e) => {
					e.dataTransfer.effectAllowed = "move";
					e.dataTransfer.dropEffect = "move";
					e.dataTransfer.setData("text/plain", "dummy data");

					dragInfo.dragging = true;
					dragInfo.movedClip = cell.clip;
					dragInfo.start.row = cell.row;
					dragInfo.start.col = cell.column;
				}}
				onDragEnd={(e) => {
					e.preventDefault();

					dragInfo.dragging = false;
					moveClip(dragInfo.start, dragInfo.current)

				}}
				onDragOver={(e) => {
					e.preventDefault();
					return false;
				}}
				onDrop={(e) => {
					console.log("drop");
					e.preventDefault();
				}}
				onDragEnter={() => {
					dragInfo.current.row = rowIndex;
					dragInfo.current.col = colIndex;
				}}
			/>
		{/each}
	{/each}
</div>





<div class="other-grid">
	<!-- first row-->
	<div class="long-1 weird">a1 - a2</div>
	<div>a3</div>
	
	<!-- second row-->
	<div class="tall-1 weird">b1 - c1</div>
	<div class="long-2 weird">b2 - b3</div>

	<!-- third row-->
	<div>c2</div>
	<div>c3</div>
</div>

<style>
	.timeline {
		display: grid;
		grid-template-columns: repeat(var(--num-cols), 1fr);
		grid-template-rows: repeat(var(--num-rows), 1fr);
	}
	
	.other-grid {
		border: 1px solid coral;

		width: 100vw;
		height: 100vh;

		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);

		gap: 1em;
	}

	.other-grid > div {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		text-transform: uppercase;
	}

	.other-grid > :not(.weird) {
		background-color: coral;
	}

	.other-grid > .long-1 {
		background-color: brown;
		grid-column-start: 1;
		grid-column-end: 3;
	}
	
	.other-grid > .long-2 {
		background-color: tomato;
		grid-column-start: 2;
		grid-column-end: 4;
	}

	.other-grid > .tall-1 {
		background-color: tan;
		grid-row-start: 2;
		grid-row-end: 4;
	}
</style>
