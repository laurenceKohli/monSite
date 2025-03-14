<script setup>
import {useTemplateRef, onMounted, ref, onUnmounted} from 'vue';

import PathAnimation from './PathAnimation.vue'
import AppGrille from './AppGrille.vue'
import TheTimeline2 from './TheTimeline2.vue';
// import TheTimelineV2 from './TheTimelineV2.vue';
import TheTimelineV3 from './TheTimelineV3.vue';

const graphWrapper = ref(null);
const wrapperSize = ref({ width: 0, height: 0 });
let resizeObserver;

onMounted(() => {
    // Mesure initiale
    Object.assign(wrapperSize.value, {
        width: graphWrapper.value.clientWidth,
        height: graphWrapper.value.clientHeight
    });

    // Observer les changements de taille
    resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        Object.assign(wrapperSize.value, {
            width: entry.contentRect.width,
            height: entry.contentRect.height
        });
    });

    resizeObserver.observe(graphWrapper.value);
});

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});
</script>

<template>
    <div class="graph-wrapper" ref="graphWrapper">
        <!-- <AppGrille :height="500" :rows="4" :columns="10"></AppGrille> -->
        <!-- <PathAnimation /> -->
        <!-- <TheTimeline2 /> -->
         <TheTimelineV3 :box="wrapperSize"/>
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