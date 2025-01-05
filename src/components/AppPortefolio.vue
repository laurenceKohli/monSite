<script setup>
import { ref } from 'vue'
import PathAnimation from './PathAnimation.vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <section id="monParcours">
      <div class="graph-wrapper">
        <PathAnimation />
    </div>
  </section>
</template>

<style scoped>
 #monParcours {
     display: flex;
      justify-content: center;
      overflow-x: hidden;
      height: 300vh;
    }
    .graph-wrapper {
      position: fixed;
      top: 50px;
      width: 90%;
      max-width: 1000px;
      height: 500px;
      background: #fff;
      border: 1px solid #ccc;
      overflow: hidden;
    }
</style>
