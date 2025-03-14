<script setup>
import { ref } from 'vue';
import { getEventPosition, filteredEvents, currentEvent } from '../composables/useEvents';
import { getEventColor } from '../composables/useTags';
import TimelineTooltip from './TimelineTooltip.vue';

const props = defineProps({
    yearWidth: Number,
    height: Number,
    annees: Array,
    totalWidth: Number
});

const computePositions = (event) => {
    const eventPosition = getEventPosition(event.position, props.yearWidth, props.height, props.annees);
    const eventX = eventPosition.x - 10;
    const isRightSide = eventX > props.totalWidth / 2;

    const tooltipPosition = {
        x: isRightSide ? eventX - 200 : eventX,
        y: event.tag === 1 ? eventPosition.y - 30 : eventPosition.y - 45
    };

    return {
        eventPosition,
        tooltipPosition
    };
};

const activeTooltip = ref(null);

const showTooltip = (event) => {
    activeTooltip.value = event.title;
};

const hideTooltip = () => {
    activeTooltip.value = null;
};

const goToProject = (event) => {
    currentEvent.value = event;
    window.location.hash = `#projet`;
};
</script>

<template>
    <g v-for="event in filteredEvents" :key="event.id" class="event-point">
        <template v-for="{ eventPosition, tooltipPosition } of [computePositions(event)]">
            <circle :cx="eventPosition.x" :cy="eventPosition.y" r="5" :fill="getEventColor(event.tag)"
                @mouseover="showTooltip(event)" @mouseleave="hideTooltip" @click="goToProject(event)" />

            <TimelineTooltip v-if="activeTooltip === event.title" :x="tooltipPosition.x" :y="tooltipPosition.y"
                :title="event.title" :expertises="event.expertises" />
        </template>
    </g>
</template>

<style scoped>
.event-point circle {
    cursor: pointer;
    transition: r 0.2s ease;
}

.event-point circle:hover {
    r: 8;
}
</style>