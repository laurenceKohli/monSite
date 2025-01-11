<script setup>
import { ref, computed } from 'vue';
import TheNav from './components/TheNav.vue';
import AppCV from './components/AppCV.vue';
import AppPortefolio from './components/AppPortefolio.vue';
import AppProjet from './components/AppProjet.vue';
// import { useDatabase } from './composables/useDatabase.js';

// const isLoading = ref(true);
// const error = ref(null);
const currentEventIndex = ref(null);
const routes = {
  '#CV': {
    component: AppCV,
    label: 'CV',
  },
  '#portefolio': {
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
  currentPath.value = routes[path] ? path : '#CV';

  if (path === '#projet') {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    currentEventIndex.value = parseInt(params.get('event'));
  }
}

window.addEventListener('hashchange', updateCurrentPath);

const currentView = computed(() => {
  return routes[currentPath.value].component;
})

// // Initialisation des données
// async function initializeApp() {
//   try {
//     isLoading.value = true;
//     await useDatabase.loadAllData();
//     updateCurrentPath();
//   } catch (e) {
//     error.value = "Erreur lors du chargement des données";
//     console.error(e);
//   } finally {
//     isLoading.value = false;
//   }
// }

// onMounted(() => {
//   initializeApp();
// });

</script>

<template>
  <!-- <div>
      <TheNav :routes="routes" :currentPath="currentPath"/>
    </div> -->
  <!-- <div v-if="isLoading" class="loading">
    Chargement...
  </div>
  <div v-else-if="error" class="error">
    {{ error }}
  </div> -->
  <!-- <template v-else> -->
    <main>
      <component :is="currentView" v-bind="routes[currentPath].props?.()" />
    </main>
  <!-- </template> -->
</template>

<style scoped>
h1 {
  color: blue;
}
</style>