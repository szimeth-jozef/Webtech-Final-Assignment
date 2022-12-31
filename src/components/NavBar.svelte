<script lang="ts">
    import { push } from 'svelte-spa-router'

    export let text: string
</script>

<header>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="back-button" on:click={() => push("/")}>
        <i class="arrow-back"></i>
    </span>
    <h1>{text}</h1>
</header>
<div class="fixed-navbar-bumber"></div>

<style>
    :root {
        --nav-bar-height: 4rem
    }

    header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #DD571C;
        height: var(--nav-bar-height);
    }

    div.fixed-navbar-bumber {
        height: var(--nav-bar-height);
    }

    h1 {
        text-align: center;
        margin-top: 18px;
    }

    span.back-button {
        position: absolute;
        height: var(--nav-bar-height);
        width: var(--nav-bar-height);
        cursor: pointer;
    }

    span.back-button::before {
        content: "";
        background-color: white;
        width: 30px;
        height: 30px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        border-radius: 50px;
        opacity: 0.25;
        transition: transform 0.15s ease-in;
        filter: blur(4px);
    }

    span.back-button:hover::before {
        transform: translate(-50%, -50%) scale(1.5);
    }

    i.arrow-back {
        margin: 25px;
        padding: 1px;
        display: inline-block;
        height: 12px;
        position: relative;
        width: 12px;
        -moz-transform: rotate(135deg);
        -webkit-transform: rotate(135deg);
        transform: rotate(135deg);
    }

    i.arrow-back::before {
        position: absolute;
        content: "";
        bottom: 1px;
        height: 20px;
        right: 0;
        transform-origin: bottom;
        width: 2px;
        -moz-transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        background-color: white;
    }

    i.arrow-back::after {
        border-bottom-style: solid;
        border-bottom-width: 2px;
        border-right-style: solid;
        border-right-width: 2px;
        content: "";
        display: inline-block;
        height: 12px;
        left: 0;
        position: absolute;
        top: 0;
        width: 12px;
    }

    @media print {
        header {
            display: none;
        }

        div {
            display: none;
        }
    }
</style>