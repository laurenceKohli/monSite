import { ref } from 'vue';
import timelineData from '/backend/eventsV2.json';

export const tags = timelineData.tags;

const excludedTags = ['camps', 'default'];
export const activeTags = ref(tags.map(tag => tag.name).filter(name => !excludedTags.includes(name)));

export const toggleTag = (tagName) => {
    const index = activeTags.value.indexOf(tagName);
    if (index === -1) {
        activeTags.value.push(tagName);
    } else {
        activeTags.value.splice(index, 1);
    }
};

export const getEventColor = (tagIndex) => {
    const tag = tags[tagIndex];
    return tag ? tag.color : tags.find(t => t.name === 'default').color;
};