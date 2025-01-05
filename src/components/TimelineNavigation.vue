<script setup>
const props = defineProps({
  timelineTotWidth: Number,
  canGoNext: Boolean,
  canGoPrev: Boolean
});

const emit = defineEmits(['navigate']);

const navigate = (direction) => {
  if ((direction === 'prev' && !props.canGoPrev) || 
      (direction === 'next' && !props.canGoNext)) return;
  emit('navigate', direction);
};
</script>

<template>
  <ul class="cd-timeline-navigation">
    <li>
      <a href="#0" 
         :class="{ prev: true, inactive: !canGoPrev }" 
         @click.prevent="navigate('prev')">
        <span class="material-symbols-outlined">arrow_back</span>
      </a>
    </li>
    <li>
      <a href="#0" 
         :class="{ next: true, inactive: !canGoNext }"
         @click.prevent="navigate('next')">
        <span class="material-symbols-outlined">arrow_forward</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.cd-timeline-navigation {
    position: absolute;
  z-index: 10;
  left: -10px;
  top: 20px;
  height: 2px;
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding: 0 10px;
    width: 100%;
}

a {
    display: block;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 2px solid #dfdfdf;
    transition: border-color 0.3s;
}

span{
    display: flex;
    justify-content: center;
}

a:hover {
    border: 2px solid #005695;
    color: #005695;
}

a.inactive {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>