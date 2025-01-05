<script setup>
const props = defineProps({
    event: Object,
});
</script>

<template>
    <div id="projet" :data-date="event.date" :class="event.tag">
        <h2>{{ event.title }}</h2>
        <em>{{ event.date }}</em>
        <div v-if="event.tag === 'projet'" id="expertises">
            <p class="expertise" v-for="expertise in event.expertises">{{ expertise }}</p>
        </div>
        <p>{{ event.description }}</p>
    </div>
</template>

<style scoped>
h2 {
    color: #d04dd4;
    font-weight: bold;
    font-size: 1.6rem;
    line-height: 1.2;
}

em {
    display: block;
    font-style: italic;
    margin: 10px auto;
}

em::before, em::after {
    content: ' - ';
}

p {
    font-size: 1.4rem;
    color: #959595;
    line-height: 1.6;
}
#expertises {
    margin: 10px 0;
   display: flex;
    justify-content: center;
    gap: 10px;
}

.expertise {
    font-size: 0.8rem;
    padding: 0.2rem 0.8rem;
    border-radius: 0.35rem;
    background-color: #e7aeae;
}

.projet h2{
    color: #0d1fc2;
}
</style>