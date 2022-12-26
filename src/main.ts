import './app.css'
import App from './App.svelte'

// TODO: register service worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./serviceWorker.js")
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

const app = new App({
  target: document.getElementById('app'),
})

export default app
