const staticDevCoffee = "gestao-despesas-pwa-v1"
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/images/icons/android-launchericon-512-512.png",
    "/images/icons/android-launchericon-192-192.png",
    "/images/icons/android-launchericon-144-144.png",
    "/images/icons/android-launchericon-96-96.png",
    "/images/icons/android-launchericon-72-72.png",
    "/images/icons/android-launchericon-48-48.png",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticDevCoffee).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
      caches.keys()
        .then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== staticTravelBudgetPlan) {
              console.log('[ServiceWorker] Removing old cache', key)
              return caches.delete(key)
            }
          }))
        })
        .then(() => self.clients.claim())
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })