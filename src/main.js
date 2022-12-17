import './style.css'

import 'phaser'

class MyGame extends Phaser.Scene {
    constructor() {
        super()
    }

    preload() {}

    create() {
    //   this.scale.startFullscreen()
    }

    update() {}
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MyGame
}

const game = new Phaser.Game(config)

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../serviceWorker.js")
        .then(reg => {
            console.log("Service worker registered")
            console.log(reg)
        })
        .catch(error => {
            console.error("Service worker restration failed")
            console.error(error)
        })
}
else {
    console.error("Device unable to support this application.")
}