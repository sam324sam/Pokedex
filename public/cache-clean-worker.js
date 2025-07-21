
self.onmessage = function (event) {
    const { cache, cacheName } = event.data; // Obtener los parametros del event
    // console.log(event)
    if (!Array.isArray(cache)) {
        console.error(`Error: cache no es un array en ${cacheName}`, cache)
        return
    }

    // Filtrar elementos expirados (Mejor que el for each que tenia antes)
    let newCache = cache.filter((element) => element.ttl > Date.now())

    // Enviar los datos procesados de vuelta
    self.postMessage({ newCache, cacheName })
}
