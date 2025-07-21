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

// localStorage.clear()
// obtengo los datos que tenga el localStrage
let cachePokemonDetails = JSON.parse(localStorage.getItem("pokemonsDetails")) || []
let cachePokemonCards = JSON.parse(localStorage.getItem("pokemonCards")) || []

// Tiempo de vida en segundos * 10000 para pasar a milisegundos
const timeLifePokemonCache = 1800 * 10000

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
  getPokemons(perPage, page) {
    const offset = page * perPage
    // Documentacion de la API: https://pokeapi.co/docs/v2
    // Cosas importantes para las peticiones a la API:
    // limit: numero de resultados que se quieren obtener
    // offset: numero de resultados que se quieren saltar (para paginacion se multiplica por el limit ya que salta cada x numero de pokemon) 
    // console.log('https://pokeapi.co/api/v2/pokemon?limit=' + perPage + '&offset=' + offset)
    return apiClient.get('/pokemon?limit=' + perPage + '&offset=' + offset)
  },
  async getPokemonDetails(name) {
    // Buscar en la cache mediante el nombre para pasarle el pokemon que pide
    let cachePokemon = cachePokemonDetails.find(pokemon => pokemon.name === name)
    if (cachePokemon && Date.now() < cachePokemon.ttl) {
      // console.log("Datos del pokemon encontrado en cache")
      cachePokemon.priority += 1
      cachePokemon.ttl = Date.now() + timeLifePokemonCache
      // Guardo los cambios realizados (El find no es una copia del elemento si no que es el elemento en si)
      localStorage.setItem("pokemonsDetails", JSON.stringify(cachePokemonDetails));
      return cachePokemon
    } else {
      // Me llamo a la api
      const response = await apiClient.get('/pokemon/' + name)

      // Quitar informacion que solo consume espacio que el local storage es de 5MB
      const pokemonData = response.data
      const pokemonOpti = optimizerPokemonDetails(pokemonData)

      cachePokemonDetails.push(pokemonOpti)
      // Para eliminar cache no prioritario
      cachePokemonDetails = removeCacheLimit(cachePokemonDetails, 10)
      localStorage.setItem("pokemonsDetails", JSON.stringify(cachePokemonDetails)) // Guardar como string valido
      // console.log("Datos del pokemon guardados en cache")
      return pokemonOpti
    }
  },
  // Funcion similar a la de arriba por que no se me ocurre otra forma de hacerlo
  async getPokemonCardData(name) {
    let cachePokemonCard = cachePokemonCards.find(pokemon => pokemon.name === name)
    if (cachePokemonCard && Date.now() < cachePokemonCard.ttl) {
      // console.log("Pokemon card encontrado en cache")
      cachePokemonCard.priority += 1
      cachePokemonCard.ttl = Date.now() + timeLifePokemonCache
      // Guardo los cambios realizados (El find no es una copia del elemento si no que es el elemento en si)
      localStorage.setItem("pokemonCards", JSON.stringify(cachePokemonCards));
      return cachePokemonCard
    } else {
      // Me llamo a la api
      const response = await apiClient.get('/pokemon/' + name)

      // Datos nesesarios solo para la cards
      const pokemonData = response.data
      const pokemonOpti = optimizerPokemonCard(pokemonData)

      cachePokemonCards.push(pokemonOpti)
      // Limite de datos guardados en cache de 60 objetos
      cachePokemonCards = removeCacheLimit(cachePokemonCards, 60)
      localStorage.setItem("pokemonCards", JSON.stringify(cachePokemonCards))
      // console.log("Pokecard guardado en cache")
      return pokemonOpti
    }
  }
}

function optimizerPokemonDetails(data) {
  // Me quito las url que no uso
  let abilities = []
  data.abilities.forEach(element => {
    abilities.push(element.ability.name)
  })
  let moves = []
  data.moves.forEach(element => {
    moves.push(element.move.name)
  })
  let types = []
  data.types.forEach(element => {
    types.push(element.type.name)
  })
  let stasts = []
  data.stats.forEach(element => {
    stasts.push({
      name: element.stat.name,
      base_stat: element.base_stat,
    })
  })

  const pokemonOpti = {
    name: data.name,
    id: data.id,
    types: types,
    height: data.height,
    weight: data.weight,
    stats: stasts,
    abilities: abilities,
    moves: moves,
    speciesUrl: data.species.url,
    ttl: Date.now() + timeLifePokemonCache,
    priority: 0,
  }
  return pokemonOpti
}

function optimizerPokemonCard(data) {
  let types = []
  data.types.forEach(element => {
    types.push(element.type.name)
  })

  const pokemonOpti = {
    name: data.name,
    id: data.id,
    sprites: data.sprites.other["official-artwork"].front_default, // Para obtener la img de mi best game
    types: types,
    ttl: Date.now() + timeLifePokemonCache,
    priority: 0,
  }
  return pokemonOpti
}