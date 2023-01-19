<script lang="ts">
    import { onMount } from "svelte";
    import type { ClipInfo } from "./types";

    export let row: number;
    export let column: number;

    export let aspectRatio = { width: 3, height: 2 };

    export let clip: ClipInfo | null;
    let draggedOver = false;
    export let isDragStart: boolean = false;

    export let onDragStart: (e: DragEvent) => void = null;
    export let onDragEnd: (e: DragEvent) => void = null;
    export let onDrop: (e: DragEvent) => void = null;
    export let onDragOver: (e: DragEvent) => void = null;
    export let onDragEnter: (e: DragEvent) => void = null;
    export let onDragLeave: (e: DragEvent) => void = null;

    const hoverColor = "#bbb";
    const emptyColor = "#eee";

    let element: HTMLDivElement;

    onMount(() => {
        element.addEventListener("drop", (e) =>
            console.log("drop from listener")
        );
    });

    $: bgColor = draggedOver ? hoverColor : clip?.color ?? emptyColor;
</script>

<div
    bind:this={element}
    class:drag-start={isDragStart}
    draggable={clip !== null}
    style={`
        --bg-color: ${bgColor};
        --bars: ${clip?.bars ?? 1};
        --row: ${row + 1};
        --col: ${column + 1};
        --aspect-ratio-width: ${aspectRatio.width};
        --aspect-ratio-height: ${aspectRatio.height};
    `}
    on:dragstart={(e) => {
        if (onDragStart) {
            onDragStart(e);
        }
    }}
    on:dragend={(e) => {
        draggedOver = false;
        if (onDragEnd) {
            onDragEnd(e);
        }
    }}
    on:dragover={(e) => {
        draggedOver = true;
        if (onDragOver) {
            onDragOver(e);
        }
    }}
    on:dragenter={(e) => {
        draggedOver = true;
        if (onDragEnter) {
            onDragEnter(e);
        }
    }}
    on:dragleave={(e) => {
        draggedOver = false;
        if (onDragLeave) {
            onDragLeave(e);
        }
    }}
    on:drop={(e) => {
        draggedOver = false;
        if (onDrop) {
            onDrop(e);
        }
    }}
>
    {clip?.name ?? ""}
</div>

<style>
    div {
        background-color: var(--bg-color);

        grid-column-start: var(--col);
        grid-column-end: calc(var(--col) + var(--bars));

        /* grid-row-start: var(--row);
        grid-row-end: calc(var(--row) + 1); */

        aspect-ratio: calc(var(--aspect-ratio-width) * var(--bars)) / var(--aspect-ratio-height);

        display: flex;
        flex-direction: row;

        align-items: center;
        justify-content: baseline;
    }

    div.drag-start {
        opacity: 85%;
    }
</style>
