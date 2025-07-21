<script setup>
const props = defineProps({
  pokemonInfo: {
    type: Object,
    required: true,
  },
})

// Maximo valor base en stats para calcular la barra de stats
const maxStat = 255

// Tamaño de cada barrita de estadistica
const calculateWidth = (baseStat) => {
  return (baseStat / maxStat) * 100
}

// Color de la barra para determinar si es bueno en x estadistica
const calculateColor = (baseStat) => {
  if (baseStat < 50) return '#FF5959'
  if (baseStat < 100) return '#FFD700'
  return '#4CAF50'
}
// console.log(props.pokemonInfo)
</script>

<template>
  <div class="pokemon-info">
    <h3 class="title">Informacion</h3>
    <div>
      <p>Altura: {{ props.pokemonInfo.height / 10 }} m</p>
      <p>Peso: {{ props.pokemonInfo.weight / 10 }} Kg</p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Estadisticas</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in pokemonInfo.stats" :key="stat.name">
          <td>{{ stat.name }}</td>
          <td>
            {{ stat.base_stat }}
            <div class="stat-container">
              <div
                class="statBar"
                :style="{
                  width: calculateWidth(stat.base_stat) + '%',
                  backgroundColor: calculateColor(stat.base_stat),
                }"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.pokemon-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.title {
  margin-left: auto;
  margin-right: auto;
  padding: 4px;
  width: 95%;
  text-align: center;
  border-bottom-right-radius: 40px;
  border-top-left-radius: 40px;
  background-color: rgb(233, 58, 58);
  color: white;
}

table {
  width: 100%;
  max-width: 400px;
  border-collapse: collapse;
  margin-top: 10px;
}

thead {
  background-color: #f4f4f4;
}

td,
th {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.stat-container {
  width: 100%;
  max-width: 200px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
  height: 12px;
  margin: 0 auto;
}

.statBar {
  height: 12px;
  border-radius: 5px;
  transition: width 0.3s ease-in-out;
}
</style>
