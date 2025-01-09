<script setup>
import { ref } from 'vue';
import { getEventPosition, filteredEvents } from '../composables/useEvents';
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
        y: event.tag == 0 ? eventPosition.y - 30 : eventPosition.y - 45
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

const goToProject = (index) => {
    window.location.hash = `#projet?event=${index}`;
};
</script>

<template>
    <g v-for="(event, index) in filteredEvents" :key="index" class="event-point">
        <template v-for="{ eventPosition, tooltipPosition } of [computePositions(event)]">
            <circle
                :cx="eventPosition.x"
                :cy="eventPosition.y"
                r="5"
                :fill="getEventColor(event.tag)"
                @mouseenter="showTooltip(event)"
                @mouseleave="hideTooltip"
                @click="goToProject(index)"
            />
            <foreignObject
                :x="tooltipPosition.x"
                :y="tooltipPosition.y"
                width="200"
                height="90"
                :style="{ display: activeTooltip === event.title ? 'block' : 'none' }"
            >
                <TimelineTooltip :event="event" />
            </foreignObject>
        </template>
    </g>
</template>

<style scoped></style>