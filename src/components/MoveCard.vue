<script setup>
import MoveService from '@/services/MoveService'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

const moveDetails = ref(null)
const showInfo = ref(false)

// LLamada a la api
watchEffect(async () => {
  try {
    const response = await MoveService.getMove(props.name)
    moveDetails.value = response
    // console.log(moveDetails.value)
  } catch (error) {
    console.log('Error al obtener datos del Pokémon:', error)
  }
})

// Funciones para mostrar y ocultar la descripcion (con con un display none en vue) solo cambiando un booleano y usandon un v-if
function showDescription() {
  showInfo.value = true
}

function hideDescription() {
  showInfo.value = false
}

</script>

<template>
  <div v-if="moveDetails" @mouseover="showDescription" @mouseout="hideDescription">
    <div class="move-card">
      <h5>
        <strong>{{ moveDetails.names.es.toUpperCase() }}</strong>
      </h5>
      <div>
        <div>
          <strong>Tipo:</strong
          ><img :src="`/img/type/${moveDetails.type}.png`" :alt="moveDetails.type" />
        </div>
        <div>
          <strong>Clase:</strong>
          <img :src="`/img/move/${moveDetails.damage_class}.png`" :alt="moveDetails.damage_class" />
        </div>
        <div><strong>Poder:</strong> {{ moveDetails.power ?? 'N/A' }}</div>
        <div><strong>Precicion:</strong> {{ moveDetails.accuracy ?? 'N/A' }}</div>
        <div><strong>PP:</strong> {{ moveDetails.pp }}</div>
      </div>
    </div>
    <div v-if="showInfo" class="more-data">
      <h5><strong>Descripcion</strong></h5>
      <div class="move-info">
        <div> {{ moveDetails.effect }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.move-card {
  background: #f8f9fa;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 130px;
  height: 170px;
  margin: auto;
  text-align: center;
}

h5 {
  color: #333;
  margin-bottom: 10px;
}

.more-data {
  position: absolute;
  background: #c3c3d3;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 130px;
  height: auto;
  text-align: center;
  margin-top: 10px;
}
</style>
