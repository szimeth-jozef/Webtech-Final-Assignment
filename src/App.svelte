<script lang="ts">
    import Router from "svelte-spa-router"
    import Start from "./routes/Start.svelte"
    import Game from "./routes/Game.svelte"
    import Description from "./routes/Description.svelte"
    import { SvelteToast } from "@zerodevx/svelte-toast"

    const routes = {
        "/": Start,
        "/game/:difficulty": Game,
        "/description": Description,
        // "*": NotFound  TODO: maybe later add a not found page, not important
    }

    const options = {}
</script>


<Router {routes} />
<SvelteToast {options} />
