<template>
  <div>
    <Bar :options="options" :data="data" />
    <p class="mt-5 font-bold">WIP</p>
  </div>
</template>
  
<script setup lang="ts">
// data
import CityPairs from '../assets/data/graphs/HSRCityPairs.json'
// chart.js
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

var options = CityPairs.options
var data = CityPairs.data
</script>