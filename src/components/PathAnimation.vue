<script setup>
import { ref } from 'vue'
import { usePathAnimation } from '../composables/usePathAnimation'

const path = ref(null)
const point = ref(null)

usePathAnimation(path, point)
</script>

<template>
    <div id="curve">
    <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
      <path 
        ref="path"
        d="M0,100 C100,50 200,50 300,120 C400,200 500,400 600,350 C700,300 800,200 900,250 C1000,300 1000,400 1000,400"
        fill="none"
        stroke="black"
        stroke-width="2"
      />
      <circle 
        ref="point"
        id="movingPoint" 
        r="5" 
        fill="red"
      />
    </svg>
    </div>
</template>

<style scoped>
 /* Courbe sous forme de chemin SVG */
 #curve {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
</style>