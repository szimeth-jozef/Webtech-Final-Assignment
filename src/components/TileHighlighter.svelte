<script lang="ts">
    import { tilelighter } from "../stores/TileHighlighterStore";

    export let tileDimensions: number

    let currentTimeoutId: NodeJS.Timeout = null

    const styles = {
        "tile-size": tileDimensions + "px",
        "top-pos": "0",
        "left-pos": "0",
        "highlight-color": "none"
    }

    $: cssVarStyles = Object.entries(styles)
        .map(([key, value]) => `--${key}:${value}`)
        .join(";")

    tilelighter.subscribe((state) => {
        const highlighter = document.querySelector("div.highlighter")
        if (!(state && highlighter)) {
            return
        }

        if (currentTimeoutId !== null) {
            clearTimeout(currentTimeoutId)
        }

        styles["left-pos"] = state.position.x + "px"
        styles["top-pos"] = state.position.y + "px"
        styles["highlight-color"] = state.color

        highlighter.classList.add("tilelight")

        currentTimeoutId = setTimeout(() => {
            currentTimeoutId = null
            highlighter.classList.remove("tilelight")
        }, state.duration)
    })
</script>

<div style="{cssVarStyles}"
     class="highlighter">
</div>

<style>
    div.highlighter {
        pointer-events: none;
        position: absolute;
        width: var(--tile-size, 10);
        height: var(--tile-size, 10);
        top: var(--top-pos);
        left: var(--left-pos);
        opacity: 0;
        box-shadow: inset 0 0 15px 6px var(--highlight-color);
        transition: opacity 150ms ease-out;
        z-index: 99;
    }

    :global(div.highlighter.tilelight) {
        transition: opacity 150ms ease-out;
        opacity: 0.75;
    }
</style>