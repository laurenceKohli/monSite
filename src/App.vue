<script setup>
import { ref, computed } from 'vue';
import TheNav from './components/TheNav.vue';
import AppCV from './components/AppCV.vue';
import AppPortefolio from './components/AppPortefolio.vue';

const routes = {
    '#CV': {
      component: AppCV,
      label: 'CV',
    },
    '#portefolio': {
      component: AppPortefolio,
      label: 'Portefolio',
    }
  }

  const currentPath = ref(window.location.hash);
  updateCurrentPath();

  function updateCurrentPath() {
    const path = window.location.hash;
    currentPath.value = routes[path] ? path : '#CV';
  }

  window.addEventListener('hashchange', updateCurrentPath);

  const currentView = computed(() => {
    return routes[currentPath.value].component;
  })

</script>

<template>
    <!-- <div>
      <TheNav :routes="routes" :currentPath="currentPath"/>
    </div> -->
    <main>
    <component :is="currentView" />
  </main>

  </template>
  
  <style scoped>
  h1 {
    color: blue;
  }
  </style>
  