<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  pokemonsCount: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 20,
  },
})

// const props = defineProps(['pokemons', 'page', 'limit'])

//console.log("Props recibidos:", props)

let lastPage = ref(false);
// No va de momento por algun extraño motivo la condicion es true en la page 65 pero no quita el el boton de siguiente
watchEffect(() => {
  lastPage.value = props.page >= Math.ceil(props.pokemonsCount / props.limit) - 1;
  // console.log(Math.ceil(props.pokemonsCount / props.limit) - 1)
  // console.log('Ultima pagina ? ' + lastPage.value)
});

</script>

<template>
  <div class="pagination">
    <RouterLink
      id="page-prev"
      :to="{ name: 'PokemonListView', query: { page: props.page - 1 } }"
      rel="prev"
      v-if="page > 0"
      >Prev Page</RouterLink
    >
    <!-- Se agrega la paginacion con RouterLink Y con v-if  se comprueba para no dar negativo en las paginas-->
    <RouterLink
      id="page-next"
      :to="{ name: 'PokemonListView', query: { page: props.page + 1 } }"
      rel="next"
      v-if="!lastPage.value"
      >Next Page</RouterLink
    >
  </div>
</template>

<style scoped>

.pagination{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px;
}

</style>