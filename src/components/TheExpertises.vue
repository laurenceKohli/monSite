<script setup>
const props = defineProps({
    expertises: Array,
});
</script>

<template>
    <div v-if="expertises" class="expertises">
            <span v-for="expertise in expertises" :key="expertise" class="expertise">
                {{ expertise }}
            </span>
        </div>
</template>

<style scoped>
.expertises {
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
</style>