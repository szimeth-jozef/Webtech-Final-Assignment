<script lang="ts">
    import arrowsImage from "../assets/arrows.png"
    import sensorImage from "../assets/mobile_sensor.png"
    import NavBar from "../components/NavBar.svelte"
    import isMobile from "is-mobile"

    const showMobileContent = isMobile()
</script>


<NavBar text={"Popis"} />
<main class="page-container">
    <h1>Puzzle Path</h1>

    <section>
        <h2>O hre</h2>
        <p>
            Hra <strong>Puzzle Path</strong> je jednoduchá logická hra, ktorej úlohou je dostať loptičku
            po vytvorenej ceste do cieľa označeného bránkou. Hra má dve voliteľné obtiažnosti (ľahká, ťažká).
            Káždá obtiažnosť má 5 úrovní. Úroveň je úspešne dokončená, ak sa hráčovi podarí dostať loptičku do cieľa.
            Hráč nemôže hrať úroveň viac-krát, kým úspešne nedokončí ostatne úrovne.
        </p>
    </section>

    <section>
        <h2>Pravidlá hry</h2>
        <p>
            Hráč si vyberá políčka cesty zo spodnej časti obrazovky a vkladá ich potiahnutím na voľné políčka na hracej ploche.
            Po zaplnení všetkých voľných políčok na hracej ploche, sa odomkne tlačidlo (Položiť loptičku). Po jeho stlačení
            sa objaví loptička, ktorú sa snaží dostať zo štartu do cieľa po vytvorenej ceste za pomoci ovládacích prvkov.
        </p>
    </section>

    <section>
        <h2>Ovládanie</h2>
        <ul>
            <li>Presun políčok: Drag & Drop</li>
            {#if showMobileContent}
                <li>Pohyb loptičky: Naklánanie zariadenia po osiach x a y</li>
            {:else}
                <li>Pohyb loptičky: Šípkami na klavesnici</li>
            {/if}
        </ul>
        <div class="image-container">
            {#if showMobileContent}
                <img src={sensorImage} alt="mobile_sensor">
            {:else}
                <img src={arrowsImage} alt="keyboard_arrows">
            {/if}
        </div>
    </section>
</main>

<style>
    h1 {
        padding: 3rem 0;
        font-size: 3rem;
        text-align: center;
        white-space: nowrap;
        font-family: 'Press Start 2P', cursive;
    }

    section {
        margin-bottom: 2.5rem;
    }

    section > h2 {
        text-decoration: underline;
        padding-left: 0.75rem;
        padding-bottom: 0.5rem;
    }

    section > ul {
        margin-bottom: 2rem;
    }

    section > ul > li {
        margin-left: 1.1rem;
    }

    section >  p {
        text-indent: 1rem;
    }

    div.image-container {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    div.image-container > img {
        width: 100%;
        max-width: 380px;
    }

    @media print {
        @page {
            margin: 10mm 0mm;
        }

        h1 {
            font-family: 'Courier New', Courier, monospace;
        }
    }

    /* Tablet */
    @media screen and (max-width: 768px) {
        h1 {
            padding: 2.5rem 0;
            font-size: 2.48rem;
        }
    }

    /* Mobile devices */
    @media screen and (max-width: 480px) {
        h1 {
            padding: 2rem 0;
            font-size: 1.55rem;
        }
    }

    /* Tiny devices */
    @media screen and (max-width: 300px) {
        h1 {
            padding: 2rem 0;
            font-size: 1rem;
        }
    }
</style>