<script setup>
import TheParcours from './TheParcours.vue';
defineProps({
  msg: String,
})

</script>

<template>
  <section id="monParcours">
     <TheParcours />
  </section>
</template>

<style scoped>
 #monParcours {
     display: flex;
      justify-content: center;
      overflow-x: hidden;
      height: 300vh;
    }
</style>
