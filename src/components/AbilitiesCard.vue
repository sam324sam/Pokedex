<script setup>
import { ref, watchEffect } from 'vue'
import AbilitiesServices from '@/services/AbilitiesServices.js'

const props = defineProps({
  pokemonAbilityName: {
    type: String,
    required: true,
  },
})

const abilityDetails = ref(null)

watchEffect(async () => {
  try {
    const response = await AbilitiesServices.getAbility(props.pokemonAbilityName)
    abilityDetails.value = response
    // console.log('Lista de habilidades:', abilityDetails.value)
  } catch (error) {
    console.log('Error al obtener datos del Pokémon:', error)
  }
})

// Falta llamda para mostrar lo que hace cada habilidad
</script>

<template>
  <div class="cell-abiliti" v-if="abilityDetails">
    <h5>
      <strong>{{ abilityDetails.names.es.toUpperCase() }}</strong>
    </h5>
    <div class="ability-info">
      {{ abilityDetails.effect ?? 'N/A' }}
    </div>
  </div>
</template>

<style scoped>
h5 {
  color: #333;
  padding: 0px;
  margin: 0px;
}
.cell-abiliti {
  width: 90%;
  text-align: center;
  padding: 8px;
  gap: 10px;
  background-color: rgb(173, 171, 171);
  color: white;
  border-radius: 10px;
}
</style>
