<script setup>
import PathAnimation from './PathAnimation.vue'
import AppGrille from './AppGrille.vue'
import TheTimeline from './TheTimeline.vue';


</script>

<template>
     <div class="graph-wrapper">
        <!-- <AppGrille :height="500" :rows="4" :columns="10"></AppGrille> -->
        <!-- <PathAnimation /> -->
        <TheTimeline />
    </div>
</template>

<style scoped>
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