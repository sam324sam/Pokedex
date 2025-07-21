<script setup>
import { ref } from 'vue';

// Uso del router para redirigir a la vista de detalles del pokemon con router.push
import { useRouter } from 'vue-router';
const router = useRouter();

const searchInput = ref(''); // lo que me llegara del input

const search = () => {
  if (searchInput.value) {
    router.push({ name: 'pokemon-details', params: { name: searchInput.value.toLowerCase() } }); // Redirige a PokemonDetailsView cambiar despues de terminar curso de las rutas
    // Queda recargar la vista de detalles con el nombre del pokemon al momento de cambiar la ruta de esta manera
  }
};
</script>

<template>
  <div class="search-container">
    <input 
      v-model="searchInput" 
      type="text" 
      placeholder="Buscar Pokémon..." 
      class="search-input"
      @keydown.enter="search" 
    /><!-- Ejecuta la busqueda al presionar enter (finalmente lo use) -->
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  max-width: 400px;
  margin: auto;
  display: flex;
  justify-content: center;
  padding: 10px;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
}

.search-input:focus {
  border-color: #007bff;
}
</style>
