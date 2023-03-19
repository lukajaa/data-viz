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
        <l-geo-json :geojson="us_map" :options="geoJsonStyles" />
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
          :options="lineOptions"
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

const lineOptions = { 
  fillColor: '#a855f7', 
  fillOpacity: 0.5, 
  color: '#a855f7', 
  weight: 1
}

function kruskal(graph) {
  // Initialize an array to hold the edges of the minimum spanning tree
  const mst = [];
  
  // Sort the edges by weight in non-decreasing order
  const edges = graph.edges.sort((a, b) => a.weight - b.weight);
  
  // Initialize a disjoint-set data structure to track which vertices belong to which connected components
  const dsu = new DisjointSetUnion(graph.vertices);
  
  // Iterate over the edges in non-decreasing order of weight
  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    
    // If the endpoints of the edge are in different connected components, add the edge to the minimum spanning tree
    if (dsu.find(u) !== dsu.find(v)) {
      mst.push(edge);
      dsu.union(u, v);
    }
  }
  
  // Return the edges of the minimum spanning tree
  return mst;
}

class DisjointSetUnion {
  constructor(vertices) {
    // Initialize each vertex as its own connected component
    this.parent = {};
    for (const v of vertices) {
      this.parent[v] = v;
    }
  }
  
  find(x) {
    // If x is not the parent of itself, recursively find the parent of its parent
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }
  
  union(x, y) {
    // Find the parents of the connected components containing x and y
    const px = this.find(x);
    const py = this.find(y);
    
    // If x and y are not already in the same connected component, merge the components
    if (px !== py) {
      this.parent[px] = py;
    }
  }
}

const spanning_tree = computed(function () {
  const edges = [];
  const vertices = selected_csas.value

  // Find edges between all pairs of vertices
  for (let i = 0; i < vertices.length; i++) {
    const vertex1 = vertices[i];
    const vertex1_data = CSAs[vertex1];
    for (let j = i + 1; j < vertices.length; j++) {
      const vertex2 = vertices[j];
      const vertex2_data = CSAs[vertex2];
      const distance = getDistanceFromLatLonInKm(vertex1_data['Latitude'], vertex1_data['Longitude'], vertex2_data['Latitude'], vertex2_data['Longitude']);
      edges.push({source: vertex1, target: vertex2, weight: distance});
    }
  }

  const graph = {vertices, edges};
  const mst = kruskal(graph);
  const spanning_tree = mst.map(edge => [edge.source, edge.target]);
  
  length.value = mst.reduce((acc, edge) => acc + edge.weight, 0) / 1.6;
  return spanning_tree
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
