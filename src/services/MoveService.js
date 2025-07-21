import axios from 'axios'

localStorage.clear()
const cacheNames = ['pokemonCards', 'pokemonsDetails', 'pokemonMoves', 'pokemonEvolution', 'pokemonAblities']
cacheNames.forEach((element) => {
  localStorage.removeItem(element)
})

const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Tiempo de vida en segundos * 10000 para pasar a milisegundos
const timeLifeMoveCache = 1800 * 10000

// Importo el cache local
let cachePokemonMoves = JSON.parse(localStorage.getItem("pokemonMoves")) || []

// Borrado de cache de mas
function removeCacheLimit(cache, limitCache) {
  // console.log("A ver el sort ", cache)
  if (cache.length >= limitCache) {
    // Ordeno por prioridad
    cache.sort((a, b) => a.priority - b.priority);
    // Borro el item del cache
    cache.shift()
  }
  return cache
}

export default {
  getMoves() {
    return apiClient.get('/move')
  },
  async getMove(name) {
    const cachePokemonMove = cachePokemonMoves.find(pokemon => pokemon.names.en === name)
    if (cachePokemonMove) {
      cachePokemonMove.priority += 1
      cachePokemonMove.ttl = Date.now() + timeLifeMoveCache
      // Guardo los cambios realizados (El find no es una copia del elemento si no que es el elemento en si)
      //localStorage.setItem("pokemonMoves", JSON.stringify(cachePokemonMoves))
      // console.log("Datos del pokemon encontrado en cache del "+ name, cachePokemonMove)
      return cachePokemonMove
    } else {
      // Me llamo a la api
      const response = await apiClient.get('/move/' + name)
      // Quitar informacion que solo consume espacio que el local storage es de 5MB
      const moveData = response.data
      const moveOpti = optimizerData(moveData)
      // console.log("movedata ", moveData)
      cachePokemonMoves.push(moveOpti)
      // Limito el tamaño del cache y lo filtro por prioridad
      cachePokemonMoves = removeCacheLimit(cachePokemonMoves, 100)

      localStorage.setItem("pokemonMoves", JSON.stringify(cachePokemonMoves)) // Guardar como string valido
      return moveOpti
    }
  },
}

function optimizerData(data) {
  // Busco el nombre en español y si no tiene le dejo el nombre original
  let nameEs
  try {
    nameEs = data.names.find(element => element.language.name === "es").name
  } catch (e) {
    nameEs = data.name
    console.log("No tiene nombre en español dejando en default " + e)
  }
  let effect = null
  try {
    effect = data.flavor_text_entries.find(element => element.language.name === 'es').flavor_text
  } catch (e) {
    effect = "Sin datos"
    console.log("No tiene nombre en español dejando en default " + e)
  }
  
  const moveOpti = {
    names: {en: data.name, es: nameEs},
    id: data.id,
    type: data.type.name,
    damage_class: data.damage_class.name,
    power: data.power,
    pp: data.pp,
    accuracy: data.accuracy,
    effect: effect,
    ttl: Date.now() + timeLifeMoveCache,
    priority: 0,
  }

  // console.log("moveOpti ", moveOpti)

  return moveOpti
}