<script lang="ts">
  import svelteLogo from '../assets/svelte.svg'
  import { push } from 'svelte-spa-router'
  import { isMobileBrowser } from '../utils/platform'

  interface Difficulty {
    id: string,
    text: string
  }

  const difficulties: Array<Difficulty> = [
    { id:"easy", text: "Ľahká" },
    { id:"hard", text: "Ťažká" }
  ]

  let selected: Difficulty

  async function lockScreenToPortrait() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
    }
    return await screen.orientation.lock("portrait")
  }

  function onStartGameButtonClicked() {
    if (isMobileBrowser()) {
      lockScreenToPortrait()
        .then(() => {
            console.log("Screen locked to portrait.")
            document.getElementById("screen-lock").innerText = "Screen locked to portrait."
            push(`/game/${selected.id}`)
          })
        .catch(err => {
          console.error(`Failed locking the screen to portrait: ${err}`)
          document.getElementById("screen-lock").innerText = `Failed locking the screen to portrait: ${err}`
        })
    }
    else {
      push(`/game/${selected.id}`)
    }
  }

</script>

<main>
  <h1>Welcome, gamer. Select what you wanna do next...</h1>
  <h2 id="screen-lock">x</h2>
  <button on:click={onStartGameButtonClicked}>Začat novú hru</button>

  <select bind:value={selected}>
    {#each difficulties as difficulty}
      <option value={difficulty}>
        {difficulty.text}
      </option>
    {/each}
  </select>

  <button on:click={() => push("/description")}>Popis hry</button>

  <div>
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer"> 
        <img src="/vite.svg" class="logo" alt="Vite Logo" />
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noreferrer"> 
        <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
      </a>
    </div>
    <h1>Vite + Svelte</h1>

    <p>
      Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
    </p>
  
    <p class="read-the-docs">
      Click on the Vite and Svelte logos to learn more
    </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }

  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }

  .read-the-docs {
    color: #888;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }

  a:hover {
    color: #535bf2;
  }

  h1 {
    font-size: 3.2em;
    line-height: 1.1;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }

  button:hover {
    border-color: #646cff;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>