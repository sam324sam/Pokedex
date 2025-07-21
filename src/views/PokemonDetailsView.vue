<script setup>
import { ref, watchEffect } from 'vue'
import PokemonService from '@/services/PokemonService.js'
// Para mostrar la informacion de los movimientos
import MoveCard from '@/components/MoveCard.vue'
// Para la foto carnet rara del pokemon
import PokemonCard from '@/components/PokemonCard.vue'
// La informacion de nombre tamaño y estadisticas
import StatsCard from '@/components/StatsCard.vue'
// Las habilidades del pokemon
import AbilitiesCard from '@/components/AbilitiesCard.vue'
// La evolucion del pokemon
import EvolutionCard from '@/components/EvolutionCard.vue'

// Uso del router para la pagina de errores
import { useRouter } from 'vue-router'
const router = useRouter()

// Parecido a Pokemon Card pero el prop debe recibir un string del nombre del pokemon desde la url
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const pokemonDetails = ref(null)

watchEffect(async () => {
  try {
    const response = await PokemonService.getPokemonDetails(props.name)
    pokemonDetails.value = response
    // console.log(pokemonDetails.value)
  } catch (error) {
    console.log('Error al obtener datos del Pokémon:', error)
    router.push({ name: '404NotFound' })
  }
})
</script>

<template>
  <!--Espero que los datos del pokemon lleguen-->
  <div v-if="pokemonDetails" class="details">
    <!--Luego debo Transformar en un componente esta parte-->

    <!--Carnet del pokimion-->
    <div class="pokemon-carnet">
      <PokemonCard :name="props.name" />
    </div>

    <!--Informacion Caracteristicas-->
    <StatsCard :pokemonInfo="pokemonDetails" />

    <!--Informacion de habilidades-->
    <div class="ability-card">
      <h3 class="title" style="background-color: rgb(69, 69, 182)">Habilidades</h3>
      <AbilitiesCard
        v-for="ability in pokemonDetails.abilities"
        :key="ability"
        :pokemonAbilityName="ability"
      />
    </div>

    <!--Informacion de la evolucion-->
    <div class="evolution-card">
      <h3 class="title" style="background-color: green">Linea evolutiva</h3>
      <EvolutionCard :speciesUrl="pokemonDetails.speciesUrl" :name="pokemonDetails.name" />
    </div>

    <!--Informacion de movimientos-->
    <div class="move-card">
      <h3 class="title" style="background-color: gray">Movimientos</h3>
      <div class="move-card-imfo">
        <MoveCard v-for="move in pokemonDetails.moves" :key="move" :name="move" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.details {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 5px;
  padding: 16px;
  margin: 16px;
  border-radius: 20px;
  border-left: solid red 20px;
  border-right: solid red 20px;
  background-color: #f0f0f0;
  min-width: 650px;
  height: 100%;
}

.pokemon-carnet {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.ability-card {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
}

.evolution-card {
  grid-column: 1 / 4;
}

.move-card {
  grid-column: 1 / 5;
}

.move-card-imfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-basis: auto;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.title {
  margin-left: auto;
  margin-right: auto;
  padding: 4px;
  width: 95%;
  text-align: center;
  border-bottom-right-radius: 40px;
  border-top-left-radius: 40px;
  color: white;
}
</style>
