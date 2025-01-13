<script setup>
import { ref, computed } from 'vue';
import TheNav from './components/TheNav.vue';
import AppCV from './components/AppCV.vue';
import AppPortefolio from './components/AppPortefolio.vue';
import AppProjet from './components/AppProjet.vue';

const currentEventIndex = ref(null);
const routes = {
  '#portfolio': {
    component: AppPortefolio,
    label: 'Portefolio',
  },
  '#projet': {
    component: AppProjet,
    label: 'Projet',
    props: () => ({ index: currentEventIndex.value })
  }
}

const currentPath = ref(window.location.hash);
updateCurrentPath();

function updateCurrentPath() {
  const path = window.location.hash.split('?')[0];
  currentPath.value = routes[path] ? path : '#portfolio';

  if (path === '#projet') {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    currentEventIndex.value = parseInt(params.get('event'));
  }
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
    <component :is="currentView" v-bind="routes[currentPath].props?.()" />
  </main>
</template>

<style scoped>
h1 {
  color: blue;
}
</style>