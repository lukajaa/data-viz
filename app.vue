<template>
  <div class="bg-indigo-50">
    <div class="p-10 mx-auto min-h-screen h-full md:w-6/12 text-center">
      <p class="text-5xl mb-5">Data Visualization</p>
      <select v-model="dataset" class="outline outline-offset-2 outline-indigo-500 rounded mb-10">
        <option value="" disabled>Pick a dataset</option>
        <option>Mindfulness</option>
        <option>Urban Stuff</option>
      </select>
      <div v-if="dataset == ''">
        A collection of various datasets that I am interested in, visualized with Chart.js.
      </div>
      <div v-else-if="dataset == 'Mindfulness'">
        <Bar
          :options="mindfulnessChartOptions"
          :data="mindfulnessChartData"
        />
        <p class="mt-5">Average Prelude Time: {{ averagePreludeTime }} | Average Meditation Time: {{ averageMeditationTime }} | Average Total Time: {{ averagePreludeTime + averageMeditationTime }}</p>
        <p class="mt-5"><span class="italic">"A minute of mindfulness":</span> Average number of meditation seconds from one minute: {{ Math.abs(averageMeditationTime - 60) }}</p>
        <p class="font-bold mt-5">What is this?</p>
        <p>This is a visualization of the lengths of mindfulness at the Bay School of San Francisco's Morning Meeting.</p>
        <p class="font-bold mt-5">Data Source</p>
        <p>All data was collected by myself.</p>
        <p>Prelude was measured from the first words spoken by the mindfulness speaker to the first ring of the bell.</p>
        <p>Meditation was measured from the first ring of the bell to the final ring of the bell.</p>
      </div>
      <div v-else-if="dataset == 'Advisory'">
          asd
      </div>
      <div class="p-10">
        Created by <a href="https://www.lucaskchang.com/#/" target="_blank">Lucas Chang</a> | Built with Nuxt.js, Chart.js, and Tailwind CSS
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// chart.js
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// refs
const dataset = ref("")

// data
var mindfulnessChartData= {
  labels: ['11/11/22', '11/14/22', '11/16/22', '11/28/22', '11/30/22', '12/2/22', '12/5/22', '12/7/22', '12/9/22', '12/14/22', '12/16/22', '1/6/23', '1/17/23', '2/2/23', '2/6/23', '2/8/2023', '2/10/23', '2/13/23', '2/14/23', '2/17/23', '2/22/23', '2/27/23', '3/1/23'],
  datasets: [ 
    { label: 'Prelude', backgroundColor: '#ef4444', data: [93, 85, 163, 62, 30, 75, 71, 42, 88, 69, 121, 71, 52, 46, 156, 84, 40, 48, 28, 54, 44, 103, 121] }, 
    { label: 'Meditation', backgroundColor: '#f87171', data: [57, 74, 67, 92, 256, 61, 74, 54, 78, 95, 228, 70, 106, 68, 60, 71, 114, 91, 26, 87, 71, 86, 63] } 
  ]
}
var mindfulnessChartOptions = {
  responsive: true,
  x: {
        stacked: true,
  },
  y: {
        stacked: true,
  },
  scales: {
    y: {
      max: 400,
      min: 0,
      ticks: {
        stepSize: 50
      },
      title: {
        display: true,
        text: 'Length (seconds)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    }
  }
}
var compute_average = array => array.reduce((a, b) => a + b) / array.length;
var averagePreludeTime = Math.round(compute_average(mindfulnessChartData.datasets[0].data))
var averageMeditationTime = Math.round(compute_average(mindfulnessChartData.datasets[1].data))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500&display=swap');

* {
  font-family: 'Noto Sans', sans-serif;
}

a {
  color: #7e22ce;
}
</style>