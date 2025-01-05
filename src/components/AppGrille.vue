<script setup>
import { computed } from 'vue';

const props = defineProps({
    rows: {
        type : Number,
        default: 4
    },
    columns: {
        type : Number, 
        default: 10
    },
    height : {
        type : Number,
        required: true
    },
    width : {
        type : Number
    }
  });

const gridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    gridTemplateRows: `repeat(${props.rows}, 1fr)`
}))

const gridItemStyle = computed(() => ({
    backgroundColor: 'white',
    width: props.width? `${props.width/props.columns}px` : '100%',
    height: `${props.height/props.rows}px`
}))

</script>

<template>
    <div id="container" :style="gridStyle">
    <div
      v-for="item in rows * columns"
      :style="gridItemStyle"
    >
    </div>
    </div>
</template>

<style scoped>
#container{
    display: grid;
    gap: 1px; /* Espacement entre les cellules */
    background-color: black; /* Couleur des lignes */
}
</style>