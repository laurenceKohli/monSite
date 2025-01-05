<script setup>
import { ref, onMounted, computed } from 'vue';
import TimelineNavigation from './TimelineNavigation.vue';
import TimelineEvents from './TimelineEvents.vue';
import TimelineContent from './TimelineContent.vue';
import timelineData from '/backend/events.json';

const events = ref(timelineData.events);
const eventsMinDistance = 60;

const timelineTotWidth = computed(() => {
  if (!events.value.length) return 0;
  const dates = events.value.map(event => new Date(event.year));
  const timeSpan = dates[dates.length - 1] - dates[0];
  return Math.max(timeSpan / (1000 * 60 * 60 * 24) * eventsMinDistance / 30, 800);
});
const selectedEvent = ref(null);

const navState = ref({
  canGoNext: true,
  canGoPrev: false
});

const updateNavState = (state) => {
  navState.value = state;
};

// Initialize the timeline on component mount
onMounted(() => {
  // Set the default selected event to the first one
  if (events.value.length > 0) {
    selectedEvent.value = events.value[0];
  }
});

const selectEvent = (direction) => {
  if (typeof direction === 'string') {
    // Find the index of the currently selected event
    const currentIndex = events.value.findIndex(event => event === selectedEvent.value);

    let newIndex = currentIndex;
    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < events.value.length - 1) {
      newIndex = currentIndex + 1;
    }

    // Set the new selected event
    selectedEvent.value = events.value[newIndex];
    updateNavState({
      canGoNext: newIndex < events.value.length - 1,
      canGoPrev: newIndex > 0
    });
  } else {
    // Directly set the selected event (on event click)
    selectedEvent.value = direction;
  }
};
</script>

<template>
  <section class="cd-horizontal-timeline">
    <div class="timeline">
      <TimelineEvents
        :events="events"
        :selectedEvent="selectedEvent"
        :eventsMinDistance="eventsMinDistance"
        @selectEvent="selectEvent"
      />

      <TimelineNavigation
        :timelineTotWidth="timelineTotWidth"
        :canGoNext="navState.canGoNext"
        :canGoPrev="navState.canGoPrev"
        @navigate="selectEvent"
      />
    </div>

    <TimelineContent :events="events" :selectedEvent="selectedEvent" />
  </section>
</template>

<style scoped>
.cd-horizontal-timeline {
  position: relative;
  width: 90%;
  /* max-width: 800px; */
  margin: 2em auto;
}

.timeline {
  position: relative;
  height: 100px;
  margin: 0 40px;
}

/* Media Queries */
@media (min-width: 768px) {
  .cd-horizontal-timeline {
    margin: 4em auto;
  }
}

@media (min-width: 1100px) {
  .cd-horizontal-timeline {
    margin: 6em auto;
  }
}
</style>