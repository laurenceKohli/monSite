<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
    events: Array,
    selectedEvent: Object,
    eventsMinDistance: Number,
});

const emit = defineEmits(['selectEvent']);
const eventsWrapper = ref(null);
const filling = ref(null);
const contentWidth = ref(0);
const translateX = ref(0);

// Calcul des positions sur la timeline avec gestion des événements multiples
const eventPositions = computed(() => {
    if (!props.events.length) return [];

    const positions = [];
    let currentPosition = 0;
    let lastYear = null;

    props.events.forEach((event, index) => {
        const currentYear = parseInt(event.year);

        if (lastYear !== null) {
            // Calculer l'écart d'années
            const yearGap = currentYear - lastYear;
            // Ajouter un espace proportionnel à l'écart
            currentPosition += yearGap * (props.eventsMinDistance * 2);
        }

        if (index > 0 && currentYear === lastYear) {
            // Pour les événements de la même année
            currentPosition += props.eventsMinDistance;
        }

        positions.push(currentPosition);
        lastYear = currentYear;
    });

    return positions;
});

const handleEventClick = (event) => {
    emit('selectEvent', event);
};

// Mise à jour de la ligne de remplissage
const updateFillingLine = () => {
    if (!filling.value || !props.selectedEvent) return;

    // Trouver l'index actuel
    const selectedIndex = props.events.findIndex(event => event === props.selectedEvent);

    // Obtenir la position actuelle depuis eventPositions
    const currentPosition = eventPositions.value[selectedIndex];

    // Calculer la largeur totale jusqu'au point actuel
    const scaleValue = (currentPosition / contentWidth.value) + 0.005;

    // Appliquer la transformation
    filling.value.style.transform = `scaleX(${scaleValue})`;
};


onMounted(() => {
    const dates = props.events.map(event => new Date(event.year));
    const timeSpan = dates[dates.length - 1] - dates[0];
    const timeSpanDays = Math.round(timeSpan / (1000 * 60 * 60 * 24));
    contentWidth.value = Math.max(timeSpanDays * props.eventsMinDistance / 30, 800);
    updateFillingLine();
});

watch(() => props.selectedEvent, updateFillingLine);
</script>

<template>
    <div class="events-wrapper" ref="eventsWrapper" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
        <div class="events" :style="{ transform: `translateX(${translateX}px)`, width: `${contentWidth}px` }">
            <ol>
                <li v-for="(event, index) in events" :key="event.date">
                    <a href="#0" :data-date="event.date" 
                    :class="[event.tag, { selected: event === selectedEvent }]"
                        :style="{ left: `${eventPositions[index]}px` }" @click.prevent="handleEventClick(event)">
                        {{ event.year }}
                    </a>
                </li>
            </ol>
            <span class="filling-line" ref="filling" aria-hidden="true"></span>
        </div>
    </div>
</template>
<style scoped>
.events-wrapper {
    position: relative;
    height: 100%;
    margin: 0 40px;
    overflow: hidden;
}

.events {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 49px;
    height: 2px;
    background: #dfdfdf;
    transition: transform 0.4s;
}

.events ol {
    list-style: none;
    padding: 0;
}

.events a {
    z-index: 2;
    position: absolute;
    bottom: -4px;
    padding-bottom: 15px;
    color: #383838;
    transform: translateZ(0);
}

.events a::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -3px;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #f8f8f8;
    border: 3px solid #dfdfdf;
    transform: translateX(-50%);
    transition: background-color 0.3s, border-color 0.3s;
}
a.projet::after{
    border-color: #0d1fc2;
}
a.formation::after{
    border-color: #d04dd4;
}

.events a.selected::after {
    background: #75f192;
}



.filling-line {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: #fd8204;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.3s;
}
</style>
