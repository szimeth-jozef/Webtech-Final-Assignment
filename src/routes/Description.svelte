<script lang="ts">
    import arrowsImage from '../assets/arrows.png'
    import sensorImage from '../assets/mobile_sensor.png'
</script>

<main>
    <h1>Puzzle Path</h1>
    <p>
        Hra <strong>Puzzle Path</strong> je jednoduchá logická hra, ktorej úlohou je dostať loptičku
        po vytvorenej ceste do cieľa označeného bránkou. Hra má dve voliteľné obtiažnosti (ľahká, ťažká).
        Káždá obtiažnosť má 5 úrovní. Úroveň je úspešne dokončená, ak sa hráčovi podarí dostať loptičku do cieľa.
        Hráč nemôže hrať úroveň viac-krát, kým úspešne nedokončí ostatne úrovne.
    </p>
    <h3>Pravidlá hry</h3>
    <p>
        Hráč si vyberá políčka cesty zo spodnej časti obrazovky a vkladá ich potiahnutím na voľné políčka na hracej ploche.
        Po zaplnení všetkých voľných políčok na hracej ploche, sa odomkne tlačidlo (Položiť loptičku). Po jeho stlačení
        sa objaví loptička, ktorú sa snaží dostať zo štartu do cieľa po vytvorenej ceste za pomoci ovládacích prvkov.
    </p>
    <h3>Ovládanie</h3>
    * Presun políčok: Drag & Drop<br>
    * Pohyb loptičky:
    <div class="flex">
        <p><img src={arrowsImage} alt="keyboard_arrows"></p>
        <p><img src={sensorImage} alt="mobile_sensor"></p>
    </div>
</main>

<style>
    h1{
        font-size: xxx-large;
    }
    h3{
        font-size: xx-large;
    }
    p{
        font-size: larger;
    }
    strong{
        font-size: x-large;
    }
    img{
        height: inherit;
    }
    .flex{
        display: flex;
        flex-direction: row;
    }
    .flex *{
        width: 50%;
    }
</style>