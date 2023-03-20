<template>
  <div>
    <Bar :options="options" :data="data" />
    <p class="font-bold mt-5">WIP</p>
    <p class="font-bold mt-5">What is this?</p>
    <p>Gravity models are a way to enumerate demand based on elements like distance population. At its most simple the equation for a gravity model for travel demand between two cities is (pop of city a * pop city of b) / (distance between city a and b)^2.
      The above graph shows the ten highest gravity scores between United States metropolitan statistical areas. The data itself is not very interesting because close areas score much higher, but it is a good example of how gravity models can be used in the real world.
      For a more in-depth look into a use case of gravity models, view the HSR City Pairs dataset</p>
    <p class="font-bold mt-5">Data Source</p>
    <p>Data was collected from wikidata using <a href="https://query.wikidata.org/" target="_blank">its query function</a>.</p>
  </div>
</template>

<script setup lang="ts">
// data
import CityPairs from '../assets/data/graphs/CityPairs.json'
// chart.js
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

var options = CityPairs.options
var data = CityPairs.data
</script>