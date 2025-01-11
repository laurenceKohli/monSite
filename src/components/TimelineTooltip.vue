<script setup>
import TheExpertises from './TheExpertises.vue';

const props = defineProps({
    x: Number,
    y: Number,
    title: String,
    expertises: {
        type: Array,
        default: () => []
    }
});
</script>

<template>
    <foreignObject :x="x" :y="y" width="200" height="100">
        <div class="tooltip">
            <h2>{{ title }}</h2>
            <TheExpertises v-if="expertises && expertises.length" :expertises="expertises" />
        </div>
    </foreignObject>
</template>

<style scoped>
.tooltip {
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    z-index: 1000;
}

.tooltip h2 {
    font-size: 14px;
    margin: 0;
}
</style>