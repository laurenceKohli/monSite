<script setup>
import { formations, getFormationPosition } from '../composables/useFormations';

const props = defineProps({
    yearWidth: Number,
    height: Number,
    annees: Array,
});
</script>

<template>
    <g v-for="(formation, index) in formations" :key="formation.debut">
        <rect :x="getFormationPosition(formation, yearWidth, annees).x"
            :y="index % 2 === 0 ? height - 60 : height - 100"
            :width="getFormationPosition(formation, yearWidth, annees).width" height="30" fill="#fff" stroke="#666"
            rx="5" />
        <a :href="formation.lien" target="_blank" v-if="formation.lien">
            <text
                :x="getFormationPosition(formation, yearWidth, annees).x + getFormationPosition(formation, yearWidth, annees).width / 2"
                :y="index % 2 === 0 ? height - 40 : height - 80" text-anchor="middle" class="formation-text">
                {{ formation.ecole }}
            </text>

        </a>
        <text v-else
            :x="getFormationPosition(formation, yearWidth, annees).x + getFormationPosition(formation, yearWidth, annees).width / 2"
            :y="index % 2 === 0 ? height - 40 : height - 80" text-anchor="middle" class="formation-text">
            {{ formation.ecole }}
        </text>
    </g>
</template>

<style scoped></style>