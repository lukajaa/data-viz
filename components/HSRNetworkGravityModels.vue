<template>
  <div>
    <VueMultiselect 
      v-model="selected_csas"
      :options="cities"
      class="outline outline-offset-2 outline-indigo-500 rounded mb-10 text-center"
      multiple
      :close-on-select="false"
      :show-labels="false"
    >
    </VueMultiselect>
    <p class="mt-5 font-bold">Score: {{ network_score }}</p>
    <p class="mt-5 font-bold">Stations: {{ selected_csas.length }}</p>
    <p class="mt-5 font-bold">Average City Distance: {{ average_distance }}</p>
    <p class="mt-5 font-bold">Average Gravity: {{ average_gravity }}</p>

    <div
      v-for="csa in selected_csas"
      :key="csa"
    >
      <p class="mt-5">{{ csa }}</p>
      <p>Population: {{ CSAs[csa]['Population'] }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CSAs from '../assets/data/CSAs.json'
// import vue multiselect
import VueMultiselect from 'vue-multiselect'

const cities = Object.keys(CSAs)
const selected_csas = ref([])

function getDistanceFromLatLonInKm(lat1 : number, lon1 : number, lat2 : number, lon2 : number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg : number) {
  return deg * (Math.PI/180)
}

const average_gravity = ref(0)
const average_distance = ref(0)

const network_score = computed(function () {
    if (selected_csas.value.length <= 1) {
        return 0
    }
    const done_csas = []
    var score = 0
    var total_distance = 0
    // loop each selected CSA
    for (const csa of selected_csas.value) {
        const csa_data = CSAs[csa]
        done_csas.push(csa)
        for (const csa2 of selected_csas.value) {
            const csa2_data = CSAs[csa2]
            if (done_csas.includes(csa2)) {
                continue
            }
            var distance_between = getDistanceFromLatLonInKm(csa_data['Latitude'], csa_data['Longitude'], csa2_data['Latitude'], csa2_data['Longitude'])
            total_distance += distance_between
            if (distance_between > 1500) {
              continue
            }
            var modifier = 1
            var gravity = csa_data["Population"]**0.8 * csa2_data["Population"]**0.8 / distance_between ** 2
            if (distance_between <= 400) {
              modifier = distance_between / 400
            } else {
              modifier = 1 - distance_between / 1500
            }
            gravity = gravity * modifier
            score += gravity
          }
    }

    average_gravity.value = score / selected_csas.value.length
    average_distance.value = total_distance / selected_csas.value.length

    const nodes = selected_csas.value.length
    const multiplier = (- 10) / (1 + Math.E**(2/3 * nodes - 5)) + 10
    return multiplier * score
})
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>