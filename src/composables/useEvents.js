// import { computed } from 'vue';
// import timelineData from '/backend/eventsV2.json';

// import { tags, activeTags } from './useTags';

// export const events = timelineData.events;

// export const filteredEvents = computed(() => {
//     return events.filter(event => {
//         const tagName = tags[event.tag].name;
//         return activeTags.value.includes(tagName);
//     });
// });

// export const anneesEvents = events.map(event => {
//     event.year = parseInt(event.year);
//     return event.year;
// });

// export const getEventPosition = (date, yearWidth, height, annees) => {
//     const [jour, mois, annee] = date.split('/').map(Number);
//     const anneeIndex = annees.indexOf(parseInt(annee));

//     const x = (anneeIndex * yearWidth) + ((mois - 1) / 12 * yearWidth);
//     const y = height - (jour / 31 * (height - 40)) - 40;

//     return { x, y };
// };
import { ref, computed } from 'vue';
import { useFetchApi } from './useFetchAPI';
import { tags, activeTags } from './useTags';

export const events = ref([]);
const { data, error, isLoading, fetchData } = useFetchApi('events');

// Initialisation des événements
export const initEvents = async () => {
    await fetchData();
    if (data.value) {
        events.value = data.value.map(event => ({
            ...event,
            year: parseInt(event.year)
        }));
    }
};

export const filteredEvents = computed(() => {
    return events.value.filter(event => {
        const tag = tags.value.find(t => t.id === event.tag_id);
        return tag && activeTags.value.includes(tag.name);
    });
});

export const anneesEvents = computed(() => {
    return [...new Set(events.value.map(event => event.year))];
});

export const getEventPosition = (date, yearWidth, height, annees) => {
    const [jour, mois, annee] = date.split('/').map(Number);
    const anneeIndex = annees.indexOf(parseInt(annee));

    const x = (anneeIndex * yearWidth) + ((mois - 1) / 12 * yearWidth);
    const y = height - (jour / 31 * (height - 40)) - 40;

    return { x, y };
};

// Initialiser les événements au démarrage
initEvents();