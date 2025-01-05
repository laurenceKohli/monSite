<script setup>
import timelineDate from '/backend/events.json';
const events = timelineDate.events;

document.addEventListener('DOMContentLoaded', function () {
  var timelines = document.querySelectorAll('.cd-horizontal-timeline');
  var eventsMinDistance = 60;

  if (timelines.length > 0) {
    initTimeline(timelines);
  }

  function initTimeline(timelines) {
    timelines.forEach(function (timeline) {
      var timelineComponents = {};
      // Cache timeline components
      timelineComponents['timelineWrapper'] = timeline.querySelector('.events-wrapper');
      timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].querySelector('.events');
      timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].querySelector('.filling-line');
      timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].querySelectorAll('a');
      timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
      timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
      timelineComponents['timelineNavigation'] = timeline.querySelector('.cd-timeline-navigation');
      timelineComponents['eventsContent'] = timeline.querySelector('.events-content');

      // Assign a left position to the single events along the timeline
      setDatePosition(timelineComponents, eventsMinDistance);
      // Assign a width to the timeline
      var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
      // The timeline has been initialized - show it
      timeline.classList.add('loaded');

      // Ajouter cette section après l'initialisation
      // Sélectionner le premier événement par défaut
      if (timelineComponents['timelineEvents'].length > 0) {
        const firstEvent = timelineComponents['timelineEvents'][0];
        const firstContent = timelineComponents['eventsContent'].querySelector('li');

        firstEvent.classList.add('selected');
        firstContent.classList.add('selected');
        updateFilling(firstEvent, timelineComponents['fillingLine'], timelineTotWidth);
      }

      // Detect click on the next arrow
      timelineComponents['timelineNavigation'].querySelector('.next').addEventListener('click', function (event) {
        event.preventDefault();
        updateSlide(timelineComponents, timelineTotWidth, 'next');
      });
      // Detect click on the prev arrow
      timelineComponents['timelineNavigation'].querySelector('.prev').addEventListener('click', function (event) {
        event.preventDefault();
        updateSlide(timelineComponents, timelineTotWidth, 'prev');
      });
      // Detect click on a single event - show new event content
      timelineComponents['eventsWrapper'].querySelectorAll('a').forEach(function (eventElement) {
        eventElement.addEventListener('click', function (event) {
          event.preventDefault();
          timelineComponents['timelineEvents'].forEach(function (ev) { ev.classList.remove('selected'); });
          eventElement.classList.add('selected');
          updateOlderEvents(eventElement);
          updateFilling(eventElement, timelineComponents['fillingLine'], timelineTotWidth);
          updateVisibleContent(eventElement, timelineComponents['eventsContent']);
        });
      });

      // On swipe, show next/prev event content
      timelineComponents['eventsContent'].addEventListener('swipeleft', function () {
        var mq = checkMQ();
        if (mq === 'mobile') showNewContent(timelineComponents, timelineTotWidth, 'next');
      });
      timelineComponents['eventsContent'].addEventListener('swiperight', function () {
        var mq = checkMQ();
        if (mq === 'mobile') showNewContent(timelineComponents, timelineTotWidth, 'prev');
      });

      // Keyboard navigation
      document.addEventListener('keyup', function (event) {
        if (event.keyCode === 37 && elementInViewport(timeline)) {
          showNewContent(timelineComponents, timelineTotWidth, 'prev');
        } else if (event.keyCode === 39 && elementInViewport(timeline)) {
          showNewContent(timelineComponents, timelineTotWidth, 'next');
        }
      });
    });
  }

  function updateSlide(timelineComponents, timelineTotWidth, string) {
    // Retrieve translateX value of timelineComponents['eventsWrapper']
    var translateValue = getTranslateValue(timelineComponents['eventsWrapper']);
    var wrapperWidth = parseFloat(window.getComputedStyle(timelineComponents['timelineWrapper']).width);
    // Translate the timeline to the left('next')/right('prev') 
    if (string === 'next') {
      translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth);
    } else {
      translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
    }
  }

  function showNewContent(timelineComponents, timelineTotWidth, string) {
    // Go from one event to the next/previous one
    var visibleContent = timelineComponents['eventsContent'].querySelector('.selected');
    var newContent = (string === 'next') ? visibleContent.nextElementSibling : visibleContent.previousElementSibling;

    if (newContent) {
      var selectedDate = timelineComponents['eventsWrapper'].querySelector('.selected');
      var newEvent = (string === 'next') ? selectedDate.parentElement.nextElementSibling.querySelector('a') : selectedDate.parentElement.previousElementSibling.querySelector('a');

      updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
      updateVisibleContent(newEvent, timelineComponents['eventsContent']);
      newEvent.classList.add('selected');
      selectedDate.classList.remove('selected');
      updateOlderEvents(newEvent);
      updateTimelinePosition(string, newEvent, timelineComponents, timelineTotWidth);
    }
  }

  function updateTimelinePosition(string, event, timelineComponents, timelineTotWidth) {
    // Translate timeline to the left/right according to the position of the selected event
    var eventStyle = window.getComputedStyle(event);
    var eventLeft = parseFloat(eventStyle.getPropertyValue("left"));
    var timelineWidth = parseFloat(window.getComputedStyle(timelineComponents['timelineWrapper']).width);
    var timelineTotWidth = parseFloat(window.getComputedStyle(timelineComponents['eventsWrapper']).width);
    var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

    if ((string === 'next' && eventLeft > timelineWidth - timelineTranslate) || (string === 'prev' && eventLeft < -timelineTranslate)) {
      translateTimeline(timelineComponents, -eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
    }
  }

  function translateTimeline(timelineComponents, value, totWidth) {
    var eventsWrapper = timelineComponents['eventsWrapper'];
    value = (value > 0) ? 0 : value; // Only negative translate value
    value = (!(typeof totWidth === 'undefined') && value < totWidth) ? totWidth : value; // Do not translate more than timeline width
    setTransformValue(eventsWrapper, 'translateX', value + 'px');
    // Update navigation arrows visibility
    if (value === 0) {
      timelineComponents['timelineNavigation'].querySelector('.prev').classList.add('inactive');
    } else {
      timelineComponents['timelineNavigation'].querySelector('.prev').classList.remove('inactive');
    }
    if (value === totWidth) {
      timelineComponents['timelineNavigation'].querySelector('.next').classList.add('inactive');
    } else {
      timelineComponents['timelineNavigation'].querySelector('.next').classList.remove('inactive');
    }
  }

  function updateFilling(selectedEvent, filling, totWidth) {
    // Change .filling-line length according to the selected event
    var eventStyle = window.getComputedStyle(selectedEvent);
    var eventLeft = parseFloat(eventStyle.getPropertyValue("left"));
    var eventWidth = parseFloat(eventStyle.getPropertyValue("width"));
    eventLeft = eventLeft + eventWidth / 2;
    var scaleValue = eventLeft / totWidth;
    setTransformValue(filling, 'scaleX', scaleValue);
  }

  function setDatePosition(timelineComponents, min) {
    for (var i = 0; i < timelineComponents['timelineDates'].length; i++) {
      var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]);
      var distanceNorm = Math.round(distance / timelineComponents['eventsMinLapse']) + 2;
      timelineComponents['timelineEvents'][i].style.left = (distanceNorm * min) + 'px';
    }
  }

  function setTimelineWidth(timelineComponents, width) {
    var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length - 1]);
    var timeSpanNorm = Math.round(timeSpan / timelineComponents['eventsMinLapse']) + 4;
    var totalWidth = timeSpanNorm * width;
    timelineComponents['eventsWrapper'].style.width = totalWidth + 'px';
    updateFilling(timelineComponents['timelineEvents'][0], timelineComponents['fillingLine'], totalWidth);

    return totalWidth;
  }

  function updateVisibleContent(event, eventsContent) {
    var eventDate = event.dataset.date;
    var visibleContent = eventsContent.querySelector('.selected');
    var selectedContent = eventsContent.querySelector('[data-date="' + eventDate + '"]');

    // Vérification de sécurité
    if (!visibleContent || !selectedContent) return;

    var selectedContentHeight = selectedContent.offsetHeight;

    var classEntering = selectedContent.index > visibleContent.index ? 'selected enter-right' : 'selected enter-left';
    var classLeaving = selectedContent.index > visibleContent.index ? 'leave-left' : 'leave-right';

    selectedContent.className = classEntering;
    visibleContent.className = classLeaving;
    eventsContent.style.height = selectedContentHeight + 'px';
  }

  function updateOlderEvents(event) {
    if (!event || !event.parentElement) return;

    // Gestion des événements précédents
    const prevSibling = event.parentElement.previousElementSibling;
    if (prevSibling) {
      const prevEvents = prevSibling.querySelectorAll('a');
      prevEvents.forEach(ev => ev.classList.add('older-event'));
    }

    // Gestion des événements suivants
    const nextSibling = event.parentElement.nextElementSibling;
    if (nextSibling) {
      const nextEvents = nextSibling.querySelectorAll('a');
      nextEvents.forEach(ev => ev.classList.remove('older-event'));
    }
  }

  function getTranslateValue(timeline) {
    var timelineStyle = window.getComputedStyle(timeline);
    var timelineTranslate = timelineStyle.getPropertyValue("transform");
    if (timelineTranslate.indexOf('(') >= 0) {
      timelineTranslate = timelineTranslate.split('(')[1].split(')')[0].split(',');
      return parseFloat(timelineTranslate[4]);
    } else {
      return 0;
    }
  }

  function setTransformValue(element, property, value) {
    element.style["-webkit-transform"] = property + "(" + value + ")";
    element.style["-moz-transform"] = property + "(" + value + ")";
    element.style["-ms-transform"] = property + "(" + value + ")";
    element.style["-o-transform"] = property + "(" + value + ")";
    element.style["transform"] = property + "(" + value + ")";
  }

  function parseDate(events) {
    var dateArrays = [];
    events.forEach(function (event) {
      var dateComp = event.dataset.date.split('/');
      var newDate = new Date(dateComp[2], dateComp[1] - 1, dateComp[0]);
      dateArrays.push(newDate);
    });
    return dateArrays;
  }

  function daydiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  function minLapse(dates) {
    var dateDistances = [];
    for (var i = 1; i < dates.length; i++) {
      var distance = daydiff(dates[i - 1], dates[i]);
      dateDistances.push(distance);
    }
    return Math.min.apply(null, dateDistances);
  }

  function elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  }

  function checkMQ() {
    return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
  }
});
</script>

<template>
  <section class="cd-horizontal-timeline">
    <div class="timeline">
      <div class="events-wrapper">
        <div class="events">
          <ol>
            <li v-for="event in events">
              <a href="#0" :data-date="event.date">{{ event.year }}</a>
            </li>
          </ol>

          <span class="filling-line" aria-hidden="true"></span>
        </div> <!-- .events -->
      </div> <!-- .events-wrapper -->

      <ul class="cd-timeline-navigation">
        <li><a href="#0" class="prev inactive">Prev</a></li>
        <li><a href="#0" class="next">Next</a></li>
      </ul> <!-- .cd-timeline-navigation -->
    </div> <!-- .timeline -->

    <div class="events-content">
      <ol>
        <li v-for="event in events" :key="event.date" :data-date="event.date">
          <h2>{{ event.title }}</h2>
          <em>{{ event.year }}</em>
          <p>{{ event.description }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.cd-horizontal-timeline a {
  text-decoration: none;
}

.cd-horizontal-timeline {
  opacity: 0;
  margin: 2em auto;
  -webkit-transition: opacity 0.2s;
  -moz-transition: opacity 0.2s;
  transition: opacity 0.2s;
}

.cd-horizontal-timeline::before {
  /* never visible - this is used in jQuery to check the current MQ */
  content: 'mobile';
  display: none;
}

.cd-horizontal-timeline.loaded {
  /* show the timeline after events position has been set (using JavaScript) */
  opacity: 1;
}

.cd-horizontal-timeline .timeline {
  position: relative;
  height: 100px;
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
}

.cd-horizontal-timeline .events-wrapper {
  position: relative;
  height: 100%;
  margin: 0 40px;
  overflow: hidden;
}

.cd-horizontal-timeline .events-wrapper::after,
.cd-horizontal-timeline .events-wrapper::before {
  /* these are used to create a shadow effect at the sides of the timeline */
  content: '';
  position: absolute;
  z-index: 2;
  top: 0;
  height: 100%;
  width: 20px;
}

.cd-horizontal-timeline .events-wrapper::before {
  left: 0;
  background-image: -webkit-linear-gradient(left, #f8f8f8, rgba(248, 248, 248, 0));
  background-image: linear-gradient(to right, #f8f8f8, rgba(248, 248, 248, 0));
}

.cd-horizontal-timeline .events-wrapper::after {
  right: 0;
  background-image: -webkit-linear-gradient(right, #f8f8f8, rgba(248, 248, 248, 0));
  background-image: linear-gradient(to left, #f8f8f8, rgba(248, 248, 248, 0));
}

.cd-horizontal-timeline .events {
  /* this is the grey line/timeline */
  position: absolute;
  z-index: 1;
  left: 0;
  top: 49px;
  height: 2px;
  /* width will be set using JavaScript */
  background: #dfdfdf;
  -webkit-transition: -webkit-transform 0.4s;
  -moz-transition: -moz-transform 0.4s;
  transition: transform 0.4s;
}

.cd-horizontal-timeline .filling-line {
  /* this is used to create the green line filling the timeline */
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: #fd8204;
  -webkit-transform: scaleX(0);
  -moz-transform: scaleX(0);
  -ms-transform: scaleX(0);
  -o-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transform-origin: left center;
  -moz-transform-origin: left center;
  -ms-transform-origin: left center;
  -o-transform-origin: left center;
  transform-origin: left center;
  -webkit-transition: -webkit-transform 0.3s;
  -moz-transition: -moz-transform 0.3s;
  transition: transform 0.3s;
}

.cd-horizontal-timeline .events a {
  position: absolute;
  bottom: 0;
  z-index: 2;
  text-align: center;
  font-size: 1.3rem;
  padding-bottom: 15px;
  color: #383838;
  /* fix bug on Safari - text flickering while timeline translates */
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}

.cd-horizontal-timeline .events a::after {
  /* this is used to create the event spot */
  content: '';
  position: absolute;
  left: 50%;
  right: auto;
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  -o-transform: translateX(-50%);
  transform: translateX(-50%);
  bottom: -5px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  border: 2px solid #fd8204;
  background-color: #f8f8f8;
  -webkit-transition: background-color 0.3s, border-color 0.3s;
  -moz-transition: background-color 0.3s, border-color 0.3s;
  transition: background-color 0.3s, border-color 0.3s;
}

.no-touch .cd-horizontal-timeline .events a:hover::after {
  background-color: #085796;
  border-color: #085796;
}

.cd-horizontal-timeline .events a.selected {
  pointer-events: none;
}

.cd-horizontal-timeline .events a.selected::after {
  background-color: #085796;
  border-color: #085796;
}

@media only screen and (min-width: 1100px) {
  .cd-horizontal-timeline {
    margin: 6em auto;
  }

  .cd-horizontal-timeline::before {
    /* never visible - this is used in jQuery to check the current MQ */
    content: 'desktop';
  }
}

.cd-timeline-navigation a {
  /* these are the left/right arrows to navigate the timeline */
  position: absolute;
  z-index: 1;
  top: 50%;
  bottom: auto;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  height: 34px;
  width: 34px;
  border-radius: 50%;
  border: 2px solid #dfdfdf;
  color: #dfdfdf;
  /* replace text with an icon */
  overflow: hidden;
  color: transparent;
  text-indent: 100%;
  white-space: nowrap;
  -webkit-transition: border-color 0.3s;
  -moz-transition: border-color 0.3s;
  transition: border-color 0.3s;
}

.cd-timeline-navigation a:hover {
  border: 2px solid #005695;
  color: #005695;
}

.cd-timeline-navigation a.prev::before {
  content: "\f053";
  font-family: FontAwesome;
  color: #ccc;
  font-size: 1.4rem;
  display: block;
  position: absolute;
  top: 9px;
  left: -22px;
  z-index: 10000;
  height: 100%;
  width: 100%;
  text-align: center;
}

.cd-timeline-navigation a.next::before {
  content: "\f054";
  font-family: FontAwesome;
  font-size: 1.4rem;
  display: block;
  position: absolute;
  top: 9px;
  left: -18px;
  z-index: 10000;
  color: #ccc;
  height: 100%;
  width: 100%;
  text-align: center;
}

.cd-timeline-navigation a:hover:before {
  color: #005695;
}


.cd-timeline-navigation a.next {
  right: 0;
}


.no-touch .cd-timeline-navigation a:hover {
  border-color: #7b9d6f;
}

.cd-timeline-navigation a.inactive {
  cursor: not-allowed;
}

.cd-timeline-navigation a.inactive::after {
  background-position: 0 -16px;
}

.no-touch .cd-timeline-navigation a.inactive:hover {
  border-color: #dfdfdf;
}

.cd-horizontal-timeline .events-content {
  position: relative;
  width: 100%;
  margin: 2em 0;
  overflow: hidden;
  -webkit-transition: height 0.4s;
  -moz-transition: height 0.4s;
  transition: height 0.4s;
}

.cd-horizontal-timeline .events-content li {
  position: absolute;
  z-index: 1;
  width: 100%;
  left: 0;
  top: 0;
  -webkit-transform: translateX(-100%);
  -moz-transform: translateX(-100%);
  -ms-transform: translateX(-100%);
  -o-transform: translateX(-100%);
  transform: translateX(-100%);
  padding: 0 5%;
  opacity: 0;
  -webkit-animation-duration: 0.4s;
  -moz-animation-duration: 0.4s;
  animation-duration: 0.4s;
  -webkit-animation-timing-function: ease-in-out;
  -moz-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.cd-horizontal-timeline .events-content li.selected {
  /* visible event content */
  position: relative;
  z-index: 2;
  opacity: 1;
  -webkit-transform: translateX(0);
  -moz-transform: translateX(0);
  -ms-transform: translateX(0);
  -o-transform: translateX(0);
  transform: translateX(0);
}

.cd-horizontal-timeline .events-content li.enter-right,
.cd-horizontal-timeline .events-content li.leave-right {
  -webkit-animation-name: cd-enter-right;
  -moz-animation-name: cd-enter-right;
  animation-name: cd-enter-right;
}

.cd-horizontal-timeline .events-content li.enter-left,
.cd-horizontal-timeline .events-content li.leave-left {
  -webkit-animation-name: cd-enter-left;
  -moz-animation-name: cd-enter-left;
  animation-name: cd-enter-left;
}

.cd-horizontal-timeline .events-content li.leave-right,
.cd-horizontal-timeline .events-content li.leave-left {
  -webkit-animation-direction: reverse;
  -moz-animation-direction: reverse;
  animation-direction: reverse;
}

.cd-horizontal-timeline .events-content li>* {
  max-width: 800px;
  margin: 0 auto;
}

.cd-horizontal-timeline .events-content h2 {
  color: #005695;
  font-weight: bold;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
}

.cd-horizontal-timeline .events-content em {
  display: block;
  font-style: italic;
  margin: 10px auto;
}

.cd-horizontal-timeline .events-content em::before {
  content: '- ';
}

.cd-horizontal-timeline .events-content p {
  font-size: 1.4rem;
  color: #959595;
}

.cd-horizontal-timeline .events-content em,
.cd-horizontal-timeline .events-content p {
  line-height: 1.6;
}

.cd-horizontal-timeline .events-content p {
  display: block;
  margin-bottom: 15px;
}

@media only screen and (min-width: 768px) {
  .cd-horizontal-timeline .events-content h2 {
    font-size: 2.6rem;
    color: #005695;
  }

  .cd-horizontal-timeline .events-content em {
    font-size: 2rem;
  }

  .cd-horizontal-timeline .events-content p {
    font-size: 1.8rem;
  }
}

@-webkit-keyframes cd-enter-right {
  0% {
    opacity: 0;
    -webkit-transform: translateX(100%);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateX(0%);
  }
}

@-moz-keyframes cd-enter-right {
  0% {
    opacity: 0;
    -moz-transform: translateX(100%);
  }

  100% {
    opacity: 1;
    -moz-transform: translateX(0%);
  }
}

@keyframes cd-enter-right {
  0% {
    opacity: 0;
    -webkit-transform: translateX(100%);
    -moz-transform: translateX(100%);
    -ms-transform: translateX(100%);
    -o-transform: translateX(100%);
    transform: translateX(100%);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateX(0%);
    -moz-transform: translateX(0%);
    -ms-transform: translateX(0%);
    -o-transform: translateX(0%);
    transform: translateX(0%);
  }
}

@-webkit-keyframes cd-enter-left {
  0% {
    opacity: 0;
    -webkit-transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateX(0%);
  }
}

@-moz-keyframes cd-enter-left {
  0% {
    opacity: 0;
    -moz-transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    -moz-transform: translateX(0%);
  }
}

@keyframes cd-enter-left {
  0% {
    opacity: 0;
    -webkit-transform: translateX(-100%);
    -moz-transform: translateX(-100%);
    -ms-transform: translateX(-100%);
    -o-transform: translateX(-100%);
    transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateX(0%);
    -moz-transform: translateX(0%);
    -ms-transform: translateX(0%);
    -o-transform: translateX(0%);
    transform: translateX(0%);
  }
}
</style>