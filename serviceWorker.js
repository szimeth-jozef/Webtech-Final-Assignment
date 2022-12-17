self.addEventListener("install", event => {
    console.log("Service worker installed");
    // Cache here

    // event.waitUtil(
    //     caches.open("static").then(cache => {
    //         return cache.addAll([
    //             "./",
    //             "icons/*.png"
    //         ])
    //     })
    // )
})