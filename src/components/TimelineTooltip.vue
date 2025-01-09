<script setup>
import TheExpertises from './TheExpertises.vue';

const props = defineProps({
    event: Object,
});
</script>

<template>
    <div class="tooltip">
        <h2>{{ event.title }}</h2>
        <TheExpertises :expertises="event.expertises" />
    </div>
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