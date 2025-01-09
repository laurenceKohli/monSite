<script setup>
import { tags, activeTags, toggleTag } from '../composables/useTags';
</script>

<template>
    <div class="legend">
        <div v-for="tag in tags" :key="tag.name" class="tag-filter"
            :class="{ inactive: !activeTags.includes(tag.name) }" @click="toggleTag(tag.name)"> <svg width="10"
                height="10" class="tag-circle">
                <circle cx="5" cy="5" r="5" :fill="tag.color"
                    :style="{ opacity: activeTags.includes(tag.name) ? 1 : 0.2 }" />
            </svg>
            {{ tag.name }}
        </div>
    </div>
</template>

<style scoped>
.legend {
    position: absolute;
    display: inline-block;
    border: 1px solid #ccc;
}

.tag-filter {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    cursor: pointer;
}

.tag-circle {
    display: inline-block;
    margin-right: 5px;
}
</style>