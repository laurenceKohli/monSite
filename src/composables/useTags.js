import { ref } from 'vue';
import { useFetchApi } from './useFetchAPI';

export const tags = ref([]);
export const activeTags = ref([]);
const excludedTags = ['camps', 'default'];

// Charger les tags depuis l'API
const { data, error, fetchData } = useFetchApi('/tags');

// Fonction d'initialisation
export const initTags = async () => {
    await fetchData();
    if (data.value) {
        tags.value = data.value;
        // Filtrer les tags actifs
        activeTags.value = data.value
            .map(tag => tag.name)
            .filter(name => !excludedTags.includes(name));
    }
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
    const tag = tags.value.find(t => t.id === tagId);
    return tag ? tag.color : tags.value.find(t => t.name === 'default')?.color;
};

// Initialiser les tags au démarrage
initTags();