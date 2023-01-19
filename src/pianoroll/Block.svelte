<script lang="ts">
    export let color: string;
    export let selected = false;
    export let playing = false;

    export let mouseDown;
    export let modeCallback: (mode: boolean) => void
    export let selectCallback: (selected: boolean) => void = null
    export let deleting = false; 

    let mouseHovered = false

    function setMode() {
        modeCallback(selected)
    }

    function onHover() {
        if (mouseDown && !mouseHovered) {
            setToMode()
            mouseHovered = true
        }
    }

    function setToMode() {
        selected = !deleting
        if (selectCallback) {
            selectCallback(selected)
        }
    }

    function onMouseDown() {
        console.log('mouseDown handler bottone')
        setMode()

        console.log(`deleting: ${deleting}`)

        setToMode()
    }

    $: {
        if(!mouseDown) {
            mouseHovered = false
        }
    }

    $: bg = selected ? color : '#eee'
</script>


<div
    style="background-color: {bg}"
    class:selected
    on:mouseover={onHover}
    on:focus={() => {}}
    on:mousedown={onMouseDown}
    class:playing={playing}
/>

<style>
    div {
        min-width: 30px;
        min-height: 20px;
        border: 1px solid #ddd
    }

    .playing {
        filter: brightness(150%);
    }
</style>