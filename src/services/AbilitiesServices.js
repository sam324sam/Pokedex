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
let cachePokemonAbilities = JSON.parse(localStorage.getItem('pokemonAblities')) || []

function removeCacheLimit(cache, limitCache) {
  // console.log("A ver el sort ", cache)
  if (cache.length >= limitCache) {
    // Ordeno por prioridad
    cache.sort((a, b) => a.priority - b.priority)
    // Borro el item del cache
    cache.shift()
  }
  return cache
}

export default {
  getAbilities() {
    return apiClient.get('/abilities')
  },
  async getAbility(name) {
    /*
    De momento esto no funca
    console.log('Cache de habilidades', cachePokemonAbilities)
    cachePokemonAbilities.forEach(element => {
        console.log(element.name + " == " + name)
        console.log("aaa")
    })*/
    
    const cachePokemonAbility = cachePokemonAbilities.find((pokemon) => pokemon.names.en === name)
    if (cachePokemonAbility) {
      cachePokemonAbility.priority += 1
      cachePokemonAbility.ttl = Date.now() + timeLifeMoveCache
      // Guardo los cambios realizados (El find no es una copia del elemento si no que es el elemento en si)
      localStorage.setItem('pokemonAblities', JSON.stringify(cachePokemonAbilities))
      // console.log('Cache de habilidades', cachePokemonAbilities)
      return cachePokemonAbility
    } else {
      // console.log("No existe en el cache buscando en api")
      // Me llamo a la api
      const response = await apiClient.get('/ability/' + name)
      // Quitar informacion que solo consume espacio que el local storage es de 5MB
      const abilityData = response.data
      const abilityOpti = optimizerData(abilityData)

      cachePokemonAbilities.push(abilityOpti)
      cachePokemonAbilities = removeCacheLimit(cachePokemonAbilities, 20)

      localStorage.setItem('pokemonAblities', JSON.stringify(cachePokemonAbilities)) // Guardar como string valido
      // console.log('Cache de habilidades', cachePokemonAbilities)
      return abilityOpti
    }
  },
}

function optimizerData(data) {
  // Busco el nombre en español (Poner variable para el idioma global)
  let nameEs
  try {
    nameEs = data.names.find(element => element.language.name === "es").name
  } catch (e) {
    nameEs = data.name
    console.log("No tiene nombre en español dejando en default " + e)
  }
  // texto para el efecto de la habilidad
  data.flavor_text_entries.forEach((element) => {
    if (element.language.name === 'es') {
      data.effect = element.flavor_text
    }
  })

  const abilityOpti = {
    names: { en: data.name, es: nameEs },
    effect: data.effect,
    ttl: Date.now() + timeLifeMoveCache,
    priority: 0,
  }

  return abilityOpti
}
