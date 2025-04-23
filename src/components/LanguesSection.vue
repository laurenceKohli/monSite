<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  
})
</script>

<template>
    <section class="langues-section py-20 px-6 md:px-20 bg-gray-50 relative overflow-hidden">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-10 text-primary">Coordination & communication</h2>
        <p class="text-lg text-gray-700 mb-16">
          Dans tous mes projets, je joue le rôle de pont entre les personnes. Les langues me permettent de créer du lien.
        </p>
        <div class="relative space-y-10 md:space-y-0 md:flex md:justify-around md:items-center">
          <div class="langue-bulle" id="fr">
            <!-- <img src="/assets/icons/france.svg" alt="Français" class="flag"> -->
            <p class="bulle">“Bonjour ! Je suis prête à collaborer !”</p>
          </div>
          <div class="langue-bulle" id="de">
            <!-- <img src="/assets/icons/germany.svg" alt="Allemand" class="flag"> -->
            <p class="bulle">“Hallo! Ich freue mich auf das Projekt.”</p>
          </div>
          <div class="langue-bulle" id="en">
            <!-- <img src="/assets/icons/uk.svg" alt="Anglais" class="flag"> -->
            <p class="bulle">“Hi! Let’s build something great.”</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <style scoped>
  .langue-bulle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    opacity: 100; /* Initial pour GSAP */
  }
  
  .flag {
    width: 50px;
    height: auto;
  }
  
  .bulle {
    background-color: #fff;
    border-radius: 1rem;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    max-width: 220px;
    font-style: italic;
  }
  </style>
  