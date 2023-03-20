<template>
  <div class="bg-indigo-50">
    <div class="p-10 mx-auto min-h-screen h-full lg:w-9/12 xl:w-6/12 text-center">
      <!-- Header -->
      <p class="text-5xl mb-5">Data Visualization</p>
      <select v-model="dataset" class="outline outline-offset-2 outline-indigo-500 rounded mb-10 text-center">
        <option value="">Pick a dataset</option>
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
        <div class="flex flex-col text-left mt-5 space-y-5">
          <div class="flex flex-row rounded bg-indigo-500 text-white p-3 mx-auto transition ease-in-out hover:scale-105 w-full" @click="dataset='HSR Network Gravity Models'">
            <div class="flex flex-col justify-center">
              <Icon name="material-symbols:train-outline" size="5em" />
            </div>
            <div class="flex flex-col justify-center ml-1">
              <p class="text-xl">HSR Network Gravity Models</p>
              <p class="text-md">An interactive map displaying strengths and sizes of hypothetical high speed rail networks in the US.</p>
            </div>
          </div>
          <div class="flex flex-row rounded bg-red-500 text-white p-3 mx-auto transition ease-in-out hover:scale-105 w-full" @click="dataset='Mindfulness'">
            <div class="flex flex-col justify-center">
              <Icon name="mdi:meditation" size="5em" />
            </div>
            <div class="flex flex-col justify-center ml-1">
              <p class="text-xl">Mindfulness</p>
              <p class="text-md">A graphical representation of mindfulness lengths at the Bay School of San Francisco.</p>
            </div>
          </div>
          <div class="flex flex-row rounded bg-green-500 text-white p-3 mx-auto transition ease-in-out hover:scale-105 w-full" @click="dataset='HSR Gravity Models'">
            <div class="flex flex-col justify-center">
              <Icon name="material-symbols:location-city" size="5em" />
            </div>
            <div class="flex flex-col justify-center ml-1">
              <p class="text-xl">HSR Gravity Models</p>
              <p class="text-md">An graphical representation of the best pairs of metropolitan areas for building high speed rail.</p>
            </div>
          </div>
          <div class="flex flex-row rounded bg-blue-500 text-white p-3 mx-auto transition ease-in-out hover:scale-105 w-full" @click="dataset='Gravity Models'">
            <div class="flex flex-col justify-center">
              <Icon name="majesticons:planet-ring-2" size="5em" />
            </div>
            <div class="flex flex-col justify-center ml-1">
              <p class="text-xl">Gravity Models</p>
              <p class="text-md">An graphical representation of the metropolitan area pairs with the highest gravity score.</p>
            </div>
          </div>
        </div>
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