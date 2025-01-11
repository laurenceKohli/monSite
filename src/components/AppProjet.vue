<script setup>
import { ref, onMounted } from 'vue';
import { useFetchApi } from '../composables/useFetchAPI';
import TheExpertises from './TheExpertises.vue';

const props = defineProps({
    index: {
        type: Number,
        required: true
    }
});

const { data: event, error, isLoading, fetchData } = useFetchApi(`events/${props.index}`);
const currentImage = ref(0);

onMounted(() => {
    fetchData();
});

const nextImage = () => {
    if (event.value?.images) {
        currentImage.value = (currentImage.value + 1) % event.value.images.length;
    }
};

const prevImage = () => {
    if (event.value?.images) {
        currentImage.value = currentImage.value === 0 ? 
            event.value.images.length - 1 : currentImage.value - 1;
    }
};
</script>

<template>
    <div v-if="isLoading">Chargement...</div>
    <div v-else-if="error">Erreur: {{ error }}</div>
    <article v-else-if="event" class="projet">
        <div class="carousel" v-if="event.images?.length > 0">
            <button class="carousel-btn prev" @click="prevImage">&#10094;</button>
            <img :src="event.images[currentImage]" :alt="event.title">
            <button class="carousel-btn next" @click="nextImage">&#10095;</button>
            <div class="dots">
                <span v-for="(_, index) in event.images" 
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
    <div v-else>Projet non trouvé</div>
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