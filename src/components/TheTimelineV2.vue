<script setup>
import { computed, onMounted, ref } from 'vue';
import TimelineLegend from './TimelineLegend.vue';
import TheTimelineEvent from './TheTimelineEvent.vue';
import TheTimelineFormation from './TheTimelineFormation.vue';
import { anneesEvents, initEvents } from '../composables/useEvents';
import { anneesFormations, initFormations } from '../composables/useFormations';
import { initTags } from '../composables/useTags';

const props = defineProps({
    box: Object,
});

const isLoading = ref(true);

onMounted(async () => {
    await Promise.all([
        initTags(),
        initEvents(),
        initFormations()
    ]);
    isLoading.value = false;
});

const totalWidth = computed(() => {
    return props.box.width > 700 ? props.box.width : 1000;
});

const height = computed(() => {
    return props.box.height;
});

const annees = computed(() => {
    return [...new Set([...anneesEvents.value, ...anneesFormations.value])].sort((a, b) => a - b);
});

const yearWidth = computed(() => {
    return totalWidth.value / annees.value.length;
});
</script>

<template>
    <div v-if="isLoading">Chargement...</div>
    <template v-else>
        <TimelineLegend />
        <svg :width="totalWidth" :height="height">
            <g v-for="(annee, index) in annees" :key="annee">
                <line :x1="index * yearWidth" :y1="height - 10" :x2="index * yearWidth" :y2="height" stroke="black"
                    stroke-width="2" />
                <text :x="index * yearWidth + yearWidth / 2" :y="height - 5" text-anchor="middle" class="year-text">
                    {{ annee }}
                </text>
            </g>
            <TheTimelineFormation :height="height" :yearWidth="yearWidth" :annees="annees" />
            <TheTimelineEvent :height="height" :yearWidth="yearWidth" :annees="annees" :totalWidth="totalWidth" />
        </svg>
    </template>
</template>

<style scoped>
.year-text {
    font-size: 12px;
    fill: black;
}
</style>