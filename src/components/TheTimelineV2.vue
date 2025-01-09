<script setup>
import { computed } from 'vue';
import TimelineLegend from './TimelineLegend.vue';
import TheTimelineEvent from './TheTimelineEvent.vue';
import TheTimelineFormation from './TheTimelineFormation.vue';
import { anneesEvents } from '../composables/useEvents';
import { anneesFormations } from '../composables/useFormations';

const props = defineProps({
    box: Object,
});

const totalWidth = computed(() => {
    return props.box.width > 700 ? props.box.width : 1000;
});

const height = computed(() => {
    return props.box.height;
});

const annees = [...new Set([...anneesEvents, ...anneesFormations])].sort((a, b) => a - b);

const yearWidth = computed(() => {
    return totalWidth.value / annees.length;
});
</script>

<template>
    <TimelineLegend />
    <svg :width="totalWidth" :height="height">
        <g v-for="(annee, index) in annees" :key="annee">
            <line :x1="index * yearWidth" :y1="height - 10" :x2="index * yearWidth" :y2="height" stroke="black"
                stroke-width="2" />
            <text :x="index * yearWidth + yearWidth / 2" :y="height - 5" text-anchor="middle" class="year-text">
                {{ annee }}
            </text>
        </g>
        <TheTimelineFormation :height :yearWidth :annees />
        <TheTimelineEvent :height :yearWidth :annees :totalWidth />
    </svg>
</template>

<style scoped>
.year-text {
    font-size: 12px;
    fill: black;
}
</style>