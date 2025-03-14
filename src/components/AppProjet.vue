<script setup>
import { ref, onMounted } from 'vue';
// import { useFetchApi } from '../composables/useFetchAPI';
import { getEventColor, } from '../composables/useTags';
import TheExpertises from './TheExpertises.vue';
import { currentEvent } from '../composables/useEvents';

// const props = defineProps({
//     index: {
//         type: Number,
//         required: true
//     }
// });

// const { data: event, error, isLoading, fetchData } = useFetchApi(`events/${props.index}`);
const currentImage = ref(0);

// onMounted(() => {
//     fetchData();
// });

const nextImage = () => {
    if (currentEvent.value?.images) {
        currentImage.value = (currentImage.value + 1) % currentEvent.value.images.length;
    }
};

const prevImage = () => {
    if (currentEvent.value?.images) {
        currentImage.value = currentImage.value === 0 ?
        currentEvent.value.images.length - 1 : currentImage.value - 1;
    }
};

const goBack = () => {
    location.hash = '#portefolio';
};
</script>

<template>
    <article v-if="currentEvent" class="projet">
        <div class="carousel" v-if="currentEvent.images?.length > 0">
            <button class="carousel-btn prev" @click="prevImage">&#10094;</button>
            <img :src="currentEvent.images[currentImage]" alt="Image du projet" />
            <button class="carousel-btn next" @click="nextImage">&#10095;</button>
            <div class="dots">
                <span v-for="(_, index) in currentEvent.images" :key="index" :class="{ active: currentImage === index }"
                    @click="currentImage = index">
                </span>
            </div>
        </div>

        <div class="content">
            <div class="header">
                <h1 :style="{ color: getEventColor(currentEvent.tag) }">{{ currentEvent.title }}</h1>
                <button class="btn-retour" @click="goBack">Retour</button>
            </div>
            <div class="metadata">
                <TheExpertises :expertises="currentEvent.expertises" />
                <span class="periode">{{ currentEvent.periode }}</span>
                <a v-if="currentEvent.url && currentEvent.id == 2" :href="currentEvent.url" target="_blank" rel="noopener noreferrer" class="btn-url">
                    Voir le résultat
                </a>
                <a v-else :href="currentEvent.url" target="_blank" rel="noopener noreferrer" class="btn-url">
                    En savoir plus
                </a>
            </div>
            <div class="description">
                <!-- <div class="description" v-html="event.description"> -->
                <h2>Objectifs</h2>
                <ul>
                    <div v-html="currentEvent.objectifs"></div>
                </ul>
                <template v-if="currentEvent.description || currentEvent.contribution || currentEvent.challenges">
                <h2>Le projet</h2>
                <div v-html="currentEvent.description"></div>
                <template v-if="currentEvent.team">
                    <h3>L'équipe</h3>
                    <p>{{ currentEvent.team }}</p>
                </template>
                <h3>Les technologies utilisées</h3>
                <ul>
                    <li v-for="techno in currentEvent.technologies" :key="techno" class="techno">
                        {{ techno }}</li>
                </ul>
                <template v-if="currentEvent.contribution">
                    <h3>Ma contribution</h3>
                    <div v-html="currentEvent.contribution"></div>
                </template>
                <template v-else>
                    <h3>Mes challenges et difficultés</h3>
                    <div v-html="currentEvent.challenges"></div>
                </template>
                <template v-if="currentEvent.fiertes">
                    <h3>Ma plus grande fierté sur le projet</h3>
                    <p>{{ currentEvent.fiertes }}</p>
                </template>
            </template>
            </div>
        </div>
    </article>
    <div v-else>Projet non trouvé</div>
</template>

<style scoped>
.header {
    display: flex;
    gap: 1rem;
    align-items: center;
}

h1 {
    margin-bottom: 20px;
}

.btn-retour {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;
}

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

.prev {
    left: 1rem;
}

.next {
    right: 1rem;
}

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
</style>