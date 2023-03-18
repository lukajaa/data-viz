<template>
  <div>
    <Multiselect 
      v-model="selected_csas"
      :options="cities"
      class="outline outline-offset-2 outline-indigo-500 rounded mb-10 text-center"
      mode="tags"
      :closeOnSelect="false"
      :searchable="true"
      style="z-index: 10000"
    />
    <p class="mt-5 font-bold">Score: {{ Math.round(network_score).toLocaleString("en-US") }}</p>
    <p class="mt-5 font-bold">Stations: {{ selected_csas.length }}</p>
    <p class="mt-5 font-bold">Network Length: {{ Math.round(length).toLocaleString("en-US") }} miles</p>

    <div style="height:500px; width: 100%" class="mt-5">
      <l-map 
        ref="map" 
        :zoom="zoom" 
        :center="[40, -98]" 
        :useGlobalLeaflet="false" 
        style="background-color:rgb(238, 242, 255);"
        :options="{ zoomControl: false, scrollWheelZoom: false, dragging: false, doubleClickZoom: false, touchZoom: false, }"
      >
        <l-geo-json :geojson="us_map" :options-style="geoJsonStyles" />
        <l-polyline
          v-for="edge in spanning_tree"
          :key="edge"
          :lat-lngs="[[CSAs[edge[0]]['Latitude'], CSAs[edge[0]]['Longitude']], [CSAs[edge[1]]['Latitude'], CSAs[edge[1]]['Longitude']]]"
          :options="{ color: '#a855f7', weight: 2 }" 
        />
        <l-circle-marker
          v-for="csa in selected_csas"
          :key="csa"
          :lat-lng="[CSAs[csa]['Latitude'], CSAs[csa]['Longitude']]" 
          :radius="CSAs[csa]['Population']**0.75 / 10000 > 1.5 ? CSAs[csa]['Population']**0.75 / 10000 : 1.5"
          :options="{ fillColor: '#a855f7', fillOpacity: 0.5, color: '#a855f7', weight: 1 }"
        >
          <l-popup class="text-center"> {{ csa }} <br /> {{ CSAs[csa]['Population'].toLocaleString("en-US") }} </l-popup>
        </l-circle-marker>
      </l-map>
    </div>
  </div>
</template>

<script setup lang="ts">
//i import data
import CSAs from '../assets/data/CSAs.json'
// import vue multiselect
import Multiselect from '@vueform/multiselect'
// import leaflet
import "leaflet/dist/leaflet.css";
import { LMap, LGeoJson, LCircleMarker, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";

import us_map from '../assets/geojson/us_outline.json';

const cities = Object.keys(CSAs)
const selected_csas = ref([])
const zoom = ref(4)
const length = ref(0)

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

const geoJsonStyles = {
  fillColor: "#c7d2fe",
  fillOpacity: 1,
  color: "#fff",
  weight: 1,
}

const spanning_tree = computed(function () {
  if (selected_csas.value.length <= 1) {
    return []
  }
  var forest = []
  var length_of = 0
  var vertices = [...selected_csas.value]
  while (vertices.length > 0) {
    var vertex = vertices.pop()
    var vertex_data = CSAs[vertex]
    var closest_vertex = null
    var closest_distance = 1000000
    for (const v of vertices) {
      var v_data = CSAs[v]
      var distance = getDistanceFromLatLonInKm(vertex_data['Latitude'], vertex_data['Longitude'], v_data['Latitude'], v_data['Longitude'])
      if (distance < closest_distance) {
        closest_distance = distance
        closest_vertex = v
      }
    }
    if (closest_vertex == null) {
      continue
    }
    length_of += closest_distance
    forest.push([vertex, closest_vertex])
  }
  length.value = length_of / 1.6
  return forest
})



const network_score = computed(function () {
    if (selected_csas.value.length <= 1) {
        return 0
    }
    const done_csas : string[] = []
    var score = 0
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

            var modifier = 1
            var gravity = csa_data["Population"]**0.8 * csa2_data["Population"]**0.8 / distance_between ** 2
            if (distance_between <= 400) {
              modifier = distance_between / 400
            } else if (distance_between <= 1000) {
              modifier = 1 - distance_between / 1000
            } else {
              modifier = 0.1
            }
            gravity = gravity * modifier
            score += gravity
          }
    }

    const nodes = selected_csas.value.length
    const multiplier = (- 5) / (1 + Math.E**(2/3 * nodes - 5)) + 10
    return multiplier * score
})
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
