<script setup>
const props = defineProps({
  events: Array,
  selectedEvent: Object,
});
</script>

<template>
  <div class="events-content">
    <ol>
      <li
        v-for="event in events"
        :key="event.date"
        :data-date="event.date"
        :class="{ selected: event === selectedEvent }"
      >
        <h2>{{ event.title }}</h2>
        <em>{{ event.date }}</em>
        <p>{{ event.description }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.events-content {
  position: relative;
  width: 100%;
  margin: 2em 0;
  overflow:visible;
  transition: height 0.4s;
}
ol {
  list-style: none;
  padding: 0;
}
.events-content li {
  position: absolute;
  z-index: 1;
  width: 100%;
  left: 0;
  top: 0;
  transform: translateX(-100%);
  opacity: 0;
  padding: 0 5%;
  animation-duration: 0.4s;
  animation-timing-function: ease-in-out;
}

.events-content li.selected {
  position: relative;
  z-index: 2;
  opacity: 1;
  transform: translateX(0);
}

.enter-right {
  animation-name: cd-enter-right;
}

.enter-left {
  animation-name: cd-enter-left;
}

@keyframes cd-enter-right {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}

@keyframes cd-enter-left {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0%);
  }
}

/* Styles existants conservés */
h2 {
  color: #005695;
  font-weight: bold;
  font-size: 1.6rem;
  line-height: 1.2;
}

em {
  display: block;
  font-style: italic;
  margin: 10px auto;
}

em::before {
  content: '- ';
}

p {
  font-size: 1.4rem;
  color: #959595;
  line-height: 1.6;
  margin-bottom: 15px;
}
</style>