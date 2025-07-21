<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'

// Nombre de todas las caches de la app
const cacheNames = [
  'pokemonCards',
  'pokemonsDetails',
  'pokemonMoves',
  'pokemonEvolution',
  'pokemonAblities',
]

/* Para pruebas
localStorage.clear()
cacheNames.forEach((element) => {
  localStorage.removeItem(element)
})*/

// Crear el wotker de la carpeta public
const myWorker = new Worker('/cache-clean-worker.js')

setInterval(() => {
  // Iterar en el array de nombre para enviar al worker
  cacheNames.forEach((cacheName) => {
    let cache = JSON.parse(localStorage.getItem(cacheName)) || []
    // Enviar tanto cache como cacheName
    myWorker.postMessage({ cache, cacheName })
  })
}, 5000)

// Esperar la respuesta del worker para
myWorker.onmessage = function (event) {
  const { newCache, cacheName } = event.data

  // console.log(`Guardando ${cacheName} actualizado:`, newCache)

  // Guardar en localStorage
  localStorage.setItem(cacheName, JSON.stringify(newCache))
}
</script>

<template>
  <header>
    <div class="logo">
      <RouterLink to="/"
        ><img
          class="logo_imagen"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/132.gif"
          alt="Logo de la aplicación"
      /></RouterLink>
      <h1 class="titulo">PokeAPI</h1>
    </div>
    <nav>
      <SearchBar />
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <div class="container">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/132.gif"
        alt="Pokeball"
      />
      <span>Pokédex App</span>
      <div>© 2025 Pokédex App. Todos los derechos reservados.</div>
    </div>
  </footer>
</template>

<style scoped>
main {
  flex: 1;
}
/*Cabecera*/
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #e05050;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo_imagen {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.titulo {
  font-size: 24px;
  font-weight: bold;
}

nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 24px;
}

nav a {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  transition: color 0.3s;
}

nav a:hover {
  color: #94d2bd;
}

/*Footer */
footer {
  background-color: #e05050;
  color: #fff;
  padding: 16px;
  margin-top: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
  flex: 1;
}
footer .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
