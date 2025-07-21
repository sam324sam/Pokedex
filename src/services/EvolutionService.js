import axios from 'axios';

// Tiempo de vida en segundos * 1000 para pasar a milisegundos (30 minutos)
const timeLifeEvolutionCache = 1800 * 1000;

// Obtengo los datos que tenga el localStorage
let cachePokemonEvolution = JSON.parse(localStorage.getItem("pokemonEvolution")) || [];

// Funcion para eliminar cache antiguo si se supera el limite
function removeCacheLimit(cache, limitCache) {
    if (cache.length >= limitCache) {
        // Ordeno por prioridad
        cache.sort((a, b) => a.priority - b.priority);
        // Borro el item del cache con menor prioridad
        cache.shift();
    }
    return cache;
}

// Funcion recursiva
function getEvolutionsNames(chain, evolutionList = []) {
    // Agregar el nombre de la especie actual
    evolutionList.push(chain.species.name);

    // Si hay mas evoluciones las recorrerlas y se llama a si mismo para guardar el nombre
    if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach(evolution => {
            // Se vuelve a llamar a la funcion por cada interaccion para guardar los nombres
            getEvolutionsNames(evolution, evolutionList);
        })
    }
    // Retornar la lista final de evoluciones
    return evolutionList;
}

export default {
    async getEvolutionLine(speciesUrl, name) {
        try {
            // Buscar en la cache mediante el nombre para que pueda coincidir con un pokemon de misma cadena evolutiva
            let cacheEvolution = cachePokemonEvolution.find(item =>
                item.evolutionList.includes(name)
            );
            // Si existe en cache y no ha expirado
            if (cacheEvolution && Date.now() < cacheEvolution.ttl) {
                // Actualizar prioridad y tiempo de vida
                cacheEvolution.priority += 1;
                cacheEvolution.ttl = Date.now() + timeLifeEvolutionCache;

                // Guardar cambios en localStorage
                localStorage.setItem("pokemonEvolution", JSON.stringify(cachePokemonEvolution));
                // console.log("Cache", cacheEvolution)
                return cacheEvolution.evolutionList;
            } else {
                // Si no esta en cache o expiro, obtener de la API

                // Obtener URL de la cadena de evolucion
                const speciesResponse = await axios.get(speciesUrl);
                const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

                // Obtener datos de la cadena de evolucion
                const evolutionResponse = await axios.get(evolutionChainUrl);
                const evolutionData = evolutionResponse.data;

                // Extraer solo los nombres de los Pokemon
                const evolutionList = getEvolutionsNames(evolutionData.chain);
                // console.log("lista ", evolutionList)

                // Guardar en cache
                const evolutionCache = {
                    speciesUrl: speciesUrl,
                    evolutionList: evolutionList,
                    ttl: Date.now() + timeLifeEvolutionCache,
                    priority: 0
                };

                // Actulizo el array de cache
                cachePokemonEvolution.push(evolutionCache);

                // Limitar el tamaño del cache a 20 elementos
                cachePokemonEvolution = removeCacheLimit(cachePokemonEvolution, 20);

                // Guardar en localStorage
                localStorage.setItem("pokemonEvolution", JSON.stringify(cachePokemonEvolution));

                return evolutionList;
            }
        } catch (error) {
            console.error("Error al obtener la linea evolutiva:", error);
            return [];
        }
    }
}