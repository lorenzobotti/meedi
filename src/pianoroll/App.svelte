<script lang="ts">
	import { Note, Pitch } from '../src/notes'
	import * as n from '../src/notes'
	import { COLORS } from '../src/colors'
	import Block from './Block.svelte'
    import { Sequence } from './sequence';
    import { loadSamples } from './sample';
    import { MultiSample } from '../noteplayer/multisample';
	
	export let pitches: Pitch[] = [
		new Pitch(n.NOTE_C, 3),
		new Pitch(n.NOTE_D, 3),
		new Pitch(n.NOTE_E, 3),
		new Pitch(n.NOTE_F, 3),
		new Pitch(n.NOTE_G, 3),
		new Pitch(n.NOTE_A, 3),
		new Pitch(n.NOTE_B, 3),
		new Pitch(n.NOTE_C, 4),
		new Pitch(n.NOTE_D, 4),
		new Pitch(n.NOTE_E, 4),
		new Pitch(n.NOTE_F, 4),
		new Pitch(n.NOTE_G, 4),
		new Pitch(n.NOTE_A, 4),
		new Pitch(n.NOTE_B, 4),
		new Pitch(n.NOTE_C, 5),
		new Pitch(n.NOTE_D, 5),
		new Pitch(n.NOTE_E, 5),
		new Pitch(n.NOTE_F, 5),
		new Pitch(n.NOTE_G, 5),
		new Pitch(n.NOTE_A, 5),
		new Pitch(n.NOTE_B, 5),
	].reverse()
	export let steps = 16
	let currentStep = 0

	let samplesLoaded = false
	const audioContext = new AudioContext()

	// function resizeMatrix(a,b,c,d): boolean[][] { return [[]] }  
	const grid = new Sequence(pitches, steps, audioContext, new MultiSample)
	grid.onStep(step => currentStep = step)
	console.log(grid)

	loadSamples(audioContext, 'trumpet')
		.then(sample => {
			samplesLoaded = true
			grid.sample = sample
			grid.startInterval(200)
		})

	function printGrid() {
		console.log(grid)
		gridInput = grid.sequence.map(row => row.map(cell => cell ? 'x' : ' ').join('')).join('|')
	}

	let gridInput: string
	function parseGrid() {
		grid.sequence = gridInput.split('|')
			.map(row => row.split('').map(letter => letter === 'x' ? true : false))
	}

	// mouse control
	let mouseDown = false

	// wether dragging will create or delete notes
	let deleting = false

	function modeCallback(value: boolean) {
		deleting = value

		console.log(`global delete set to ${deleting}`)
	}

	setInterval(() => console.log(grid.pitches.map(pitch => pitch.name())), 5000)
</script>

<div
	class="midi-grid"
	style="
		--notes: {grid.pitches.length};
		--steps: {grid.steps}
	"
	
	on:mousedown={() => {console.log('mouseDown handler griglia'); mouseDown = true}}
	on:mouseup={() => mouseDown = false}
	on:mouseleave={() => mouseDown = false}
	>

	{#each grid.sequence as row, rowIndex}
		{grid.pitches[rowIndex].name()}

		{#each row as cell, colIndex}
			<Block
				color={COLORS[grid.pitches[rowIndex].note]}
				{mouseDown}
				{modeCallback}
				{deleting}
				playing={currentStep === colIndex}
				bind:selected={cell}/>
		{/each}
	{/each}
</div>

<button on:click={printGrid}>print grid</button>

<textarea bind:value={gridInput} rows={grid.pitches.length} cols={steps}></textarea>
<button on:click={parseGrid}>import grid</button>

<br>

<button on:click={() => grid.play()}>play step</button>
<button on:click={() => grid.nextStep()}>next step</button>

<style>
	.midi-grid {
		display: grid;
		grid-template-columns: repeat(calc(var(--steps) + 1), 1fr);
		grid-template-rows: repeat(var(--notes), 1fr);
		gap: 0;

		height: calc(100vh - 80px);
		width: calc(100vw - 10px);
	}
</style>