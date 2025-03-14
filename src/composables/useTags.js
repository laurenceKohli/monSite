import { ref } from 'vue';
import timelineData from '/backend/eventsV2.json';

export const tags = ref([]);
export const activeTags = ref([]);
const excludedTags = ['camps', 'default'];


// Fonction d'initialisation
const initTags = () => {
        tags.value = timelineData.tags;
        // Filtrer les tags actifs
        activeTags.value = tags.value
            .map(tag => tag.name)
            .filter(name => !excludedTags.includes(name));
};

export const toggleTag = (tagName) => {
    const index = activeTags.value.indexOf(tagName);
    if (index === -1) {
        activeTags.value.push(tagName);
    } else {
        activeTags.value.splice(index, 1);
    }
};

export const getEventColor = (tagId) => {
    const tag = tags.value[tagId-1];
    return tag ? tag.color : tags.value.find(t => t.name === 'default')?.color;
};

// Initialiser les tags au démarrage
initTags();