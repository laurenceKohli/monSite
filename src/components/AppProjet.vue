<script setup>
import { ref, computed } from 'vue';
import { filteredEvents } from '../composables/useEvents';
import TheExpertises from './TheExpertises.vue';

const props = defineProps({
    index: {
        type: Number,
        required: true
    }
});

const event = computed(() => filteredEvents.value[props.index]);

const images = computed(() => event.value?.images || []);
const currentImage = ref(0);

const nextImage = () => {
    currentImage.value = (currentImage.value + 1) % images.value.length;
};

const prevImage = () => {
    currentImage.value = currentImage.value === 0 ? images.value.length - 1 : currentImage.value - 1;
};
</script>

<template>
    <article class="projet">
        <div class="carousel" v-if="event.tag != 0 && images.length > 0">
            <button class="carousel-btn prev" @click="prevImage">&#10094;</button>
            <img :src="images[currentImage]" :alt="event.title">
            <button class="carousel-btn next" @click="nextImage">&#10095;</button>
            <div class="dots">
                <span v-for="(_, index) in images" 
                      :key="index" 
                      :class="{ active: currentImage === index }"
                      @click="currentImage = index">
                </span>
            </div>
        </div>

        <div class="content">
            <h2>{{ event.title }}</h2>
            <div class="metadata">
                <span class="periode">{{ event.periode }}</span>
                <TheExpertises :expertises="event.expertises" />
            </div>
            <p class="description">{{ event.description }}</p>
        </div>
    </article>
</template>

<style scoped>
.projet {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.carousel {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.carousel img {
    height: 100%;
    object-fit: cover;
}

.carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 1rem;
    cursor: pointer;
    border-radius: 50%;
}

.prev { left: 1rem; }
.next { right: 1rem; }

.dots {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
}

.dots span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
}

.dots span.active {
    background: white;
}

.content {
    text-align: left;
}

h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
}

.metadata {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    color: #666;
}

.periode {
    font-style: italic;
}

.description {
    line-height: 1.6;
    color: #444;
}
</style>