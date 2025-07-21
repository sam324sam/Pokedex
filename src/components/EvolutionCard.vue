<script setup>
import { ref, watchEffect } from 'vue'
import EvolutionService from '@/services/EvolutionService.js'
import PokemonCard from '@/components/PokemonCard.vue'

const props = defineProps({
  speciesUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})

const evolutionList = ref([])

// Para el gift de carga
const loading = ref(true)
const loadingError = ref(false)

watchEffect(async () => {
  loading.value = true
  try {
    const response = await EvolutionService.getEvolutionLine(props.speciesUrl, props.name)
    evolutionList.value = response
    // console.log('Lista de evoluciones:', evolutionList.value)
  } catch (error) {
    console.log('Error al obtener datos del Pokémon:', error)
    loadingError.value = true
  } finally {
    setTimeout(function () {
      loading.value = false
    }, 500)
  }
})
</script>

<template>
  <div v-if="loading" class="loadingGift">
    <img src="/icon/loading.gif" alt="Loading..." />
  </div>
  <div v-show="!loading" class="evolution-container" v-if="evolutionList.length > 0 && !loadingError">
    <PokemonCard
      v-for="pokemon in evolutionList"
      :key="pokemon"
      :name="pokemon"
      class="evolution-cell"
    />
  </div>
  <div v-if="loadingError">
    <h2>Error al cargar los pokemons</h2>
    <img
      src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzUwZ2N3a3lrN3hvOHR1endxMmE3ZjJ6ZDR2ZWE3b21kbDJrYjVsbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/T8Dhl1KPyzRqU/giphy.gif"
      alt="Error"
    />
    <p>Por favor intenta de nuevo más tarde.</p>
  </div>
</template>

<style scoped>
.evolution-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.evolution-cell {
  width: 1fr;
}

.loadingGift {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding: 10px;
  height: 20vh;
  width: 20vw;
}
</style>
