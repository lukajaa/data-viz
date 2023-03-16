<template>
  <div>
    <Bar :options="options" :data="data" />
    <p class="mt-5">Average Prelude Time: {{ averagePreludeTime }} | Average Meditation Time: {{ averageMeditationTime }} | Average Total Time: {{ averagePreludeTime + averageMeditationTime }}</p>
    <p class="mt-5"><span class="italic">"A minute of mindfulness":</span> Average number of meditation seconds from one minute: {{ Math.abs(averageMeditationTime - 60) }}</p>
    <p class="font-bold mt-5">What is this?</p>
    <p>This is a visualization of the lengths of mindfulness at the Bay School of San Francisco's Morning Meeting.</p>
    <p class="font-bold mt-5">Data Source</p>
    <p>All data was collected by myself.</p>
    <p>Prelude was measured from the first words spoken by the mindfulness speaker to the first ring of the bell.</p>
    <p>Meditation was measured from the first ring of the bell to the final ring of the bell.</p>
  </div>
</template>

<script setup lang="ts">
// data
import MindfulnessData from '../assets/data/graphs/Mindfulness.json'
// chart.js
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

var data = MindfulnessData.data
var options = MindfulnessData.options

var compute_average = array => array.reduce((a, b) => a + b) / array.length;
var averagePreludeTime = Math.round(compute_average(data.datasets[0].data))
var averageMeditationTime = Math.round(compute_average(data.datasets[1].data))
</script>