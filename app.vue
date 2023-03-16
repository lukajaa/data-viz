<template>
  <div class="bg-indigo-50">
    <div class="p-10 mx-auto min-h-screen h-full lg:w-9/12 xl:w-6/12 text-center">
      <!-- Header -->
      <p class="text-5xl mb-5">Data Visualization</p>
      <select v-model="dataset" class="outline outline-offset-2 outline-indigo-500 rounded mb-10 text-center">
        <option value="" disabled>Pick a dataset</option>
        <option disabled>Personal</option>
        <option>Mindfulness</option>
        <option disabled>Urbanism</option>
        <option>Gravity Models</option>
        <option>HSR Gravity Models</option>
        <option>HSR Network Gravity Models</option>
      </select>

      <!-- Content -->
      <div v-if="dataset == ''">
        A collection of various datasets that I am interested in, visualized with Chart.js.
      </div>
      <Mindfulness v-else-if="dataset == 'Mindfulness'"/>
      <GravityModels v-else-if="dataset == 'Gravity Models'"/>
      <HSRGravityModels v-else-if="dataset == 'HSR Gravity Models'"/>
      <HSRNetworkGravityModels v-else-if="dataset == 'HSR Network Gravity Models'"/>

      <!-- Footer -->
      <div class="p-10">
        Created by <a href="https://www.lucaskchang.com/#/" target="_blank">Lucas Chang</a> | Built with <a href="https://github.com/lukajaa/data-viz" target="_blank">Nuxt.js, Chart.js, and Tailwind CSS</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const dataset = ref("")
</script> 

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500&display=swap');

* {
  font-family: 'Noto Sans', sans-serif;
}

a {
  color: #7e22ce;
}
</style>