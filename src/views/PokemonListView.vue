<script setup>
import { defineProps, ref, watchEffect } from 'vue'
import PokemonCard from '@/components/PokemonCard.vue'
import PokemonService from '@/services/PokemonService'
import PaginationButtons from '@/components/PaginationButtons.vue'

const props = defineProps(['page'])

// Controlar elementos por pagina
const limitPage = 20
let pokemonsCount = 0
const pokemons = ref(null)

// Para el gift de carga
const loading = ref(true)
const loadingError = ref(false)

// Obtener la lista de pokemons
watchEffect(() => {
  loading.value = true
  PokemonService.getPokemons(limitPage, props.page)
    .then((response) => {
      pokemons.value = response.data.results
      pokemonsCount = response.data.count
      // console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
      loadingError.value = true
    })
    .finally(() => {
      setTimeout(function () {
        loading.value = false
      }, 500)
    })
})
</script>

<template>
  <!--Botones e paginancion paso el array de pokemons y el numero pagina en la que nos encontramos-->
  <PaginationButtons
    v-if="pokemons"
    :pokemonsCount="pokemonsCount"
    :page="props.page"
    :limit="limitPage"
  />

  <div class="pokedex">
    <h1>Pokedex</h1>
    <div v-if="loading" class="loadingGift">
      <img src="/icon/loading.gif" alt="Loading..." />
    </div>
    <div v-show="!loading" v-if="pokemons && !loadingError" class="pokemons">
      <PokemonCard v-for="pokemon in pokemons" :key="pokemon.name" :name="pokemon.name" />
    </div>
    <div v-if="loadingError">
      <h2>Error al cargar los pokemons</h2>
      <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzUwZ2N3a3lrN3hvOHR1endxMmE3ZjJ6ZDR2ZWE3b21kbDJrYjVsbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/T8Dhl1KPyzRqU/giphy.gif" alt="Error" />
      <p>Por favor intenta de nuevo más tarde.</p>
    </div>
  </div>

  <PaginationButtons
    v-if="pokemons"
    :pokemonsCount="pokemonsCount"
    :page="props.page"
    :limit="limitPage"
  />
</template>

<style scoped>
.pokedex {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  margin: 16px;
  border-radius: 20px;
  border-left: solid red 20px;
  border-right: solid red 20px;
  background-color: #f0f0f0;
  min-width: 450px;
}

.pokemons {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-basis: auto;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  opacity: 1;
  transform: translateY(20px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.loadingGift {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
