import { computed } from 'vue';
import timelineData from '/backend/eventsV2.json';

import { tags, activeTags } from './useTags';

export const events = timelineData.events;

export const filteredEvents = computed(() => {
    return events.filter(event => {
        const tagName = tags[event.tag].name;
        return activeTags.value.includes(tagName);
    });
});

export const anneesEvents = events.map(event => {
    event.year = parseInt(event.year);
    return event.year;
});

export const getEventPosition = (date, yearWidth, height, annees) => {
    const [jour, mois, annee] = date.split('/').map(Number);
    const anneeIndex = annees.indexOf(parseInt(annee));

    const x = (anneeIndex * yearWidth) + ((mois - 1) / 12 * yearWidth);
    const y = height - (jour / 31 * (height - 40)) - 40;

    return { x, y };
};