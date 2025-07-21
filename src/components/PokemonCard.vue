<script setup>
import PokemonService from '@/services/PokemonService'
import { ref, watchEffect } from 'vue'

// Uso del router para la pagina de errores

// Obtener el nombre del pokemon (proveniente de PokemonListView)
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

// Realizar la petición a la API con el nombre del pokemon para tener mas datos (no estoy seguro si debo hacerlo aquí o en el PokemonListView o en el PokemonCard)
const pokemonDetails = ref(null)

watchEffect(async () => {
  try {
    const response = await PokemonService.getPokemonCardData(props.name)
    pokemonDetails.value = response // Asegurarse de obtener los datos correctamente
    // console.log(pokemonDetails.value)
  } catch (error) {
    console.log('Error al obtener datos del Pokémon:', error)
  }
})
</script>

<template>
  <router-link
    v-if="pokemonDetails"
    class="pokemon-link"
    :to="{ name: 'pokemon-details', params: { name: pokemonDetails.name } }"
  >
    <div class="pokemon-card">
      <h2>{{ pokemonDetails.name.toUpperCase() }}</h2>
      <h3>Numero de pokedex {{ pokemonDetails.id }}</h3>
      <img :src="pokemonDetails.sprites" :alt="pokemonDetails.name" class="pokemon-sprite" />
      <!--Me recorre el array de tipos aun que maximo el pokemon tiene -->
      <div class="type">
        <div v-for="type in pokemonDetails.types" :key="type">
          <img :src="`/img/type/${type}.png`" :alt="type" />
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.pokemon-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  width: 1fr;
  cursor: pointer;
  border: 1px solid #39495c;
  margin-bottom: 18px;
  border-radius: 10px;
}
.pokemon-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
.pokemon-link {
  color: #2c3e50;
  text-decoration: none;
}

.pokemon-sprite {
  width: 200px;
}

.type {
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4px;
}
</style>
