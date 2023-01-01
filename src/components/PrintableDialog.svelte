<script lang="ts">
    import { tilelighter } from "../stores/TileHighlighterStore";

    let isOpen: boolean

    export const open = () => {
        tilelighter.cancel()
        isOpen = true;
    }

    export const close = () => { isOpen = false }
</script>

<div class="dialog-background-mist" class:open={isOpen}>
    <div class="dialog">
        <span class="dialog__top-bar">
            <h2>Riešenie</h2>
            <button on:click={close}>
                <i>+</i>
            </button>
        </span>
        <slot />
    </div>
</div>

<style>
    div.open {
        visibility: visible !important;
    }

    div.dialog-background-mist {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        visibility: hidden;
    }

    div.dialog {
        display: flex;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        flex-direction: column;
        background-color: #3b3b3b;
        border: 1px solid white;
        border-radius: 10px;
        box-sizing: border-box;
        min-width: 200px;
    }

    span.dialog__top-bar {
        position: relative;
        border-radius: 10px 10px 0 0;
        background-color: #242424;
        height: 42px;
    }

    span.dialog__top-bar > h2 {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
    }

    span.dialog__top-bar > button {
        position: absolute;
        right: 0;
        height: 42px;
        margin-right: 0.5rem;
        background-color: transparent;
        border: none;
        padding: 5px 10px;
    }

    span.dialog__top-bar > button:hover {
        cursor: pointer;
    }

    span.dialog__top-bar > button > i {
        display: inline-block;
        transform: rotate(45deg);
        font-size: 1.75rem;
        font-weight: 700;
        font-style: normal;
        color: white;
    }

    /* Tablet */
    @media screen and (max-width: 768px) {
        div.dialog {
            width: 90%;
        }
    }

    /* Mobile devices */
    @media screen and (max-width: 480px) {
        div.dialog {
            width: calc(100% - 2px);
        }
    }

    @media print {
        div.dialog-background-mist {
            visibility: visible !important;
        }

        span.dialog__top-bar > button {
            visibility: hidden;
        }
    }
</style>