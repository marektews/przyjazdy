<template>
    <div class="container my-2">
        <h3 class="text-center">
            Poranne przyjazdy autokarów
        </h3>
        <div class="text-center text-muted">
            Klikaj w kafelek, żeby zmieniać stan
        </div>
        <main class="mt-3">
            <BusItem 
                v-for="(bus, index) of allBuses" 
                :key="index"
                :bus="bus"
            />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BusItem from './BusItem.vue'

const allBuses = ref([])
const timer = ref(undefined)

onMounted(() => {
    updateData()
    timer.value = setInterval(() => {
        updateData()
    }, 20000)
})
onUnmounted(() => {
    if(timer.value) {
        clearInterval(timer.value)
        timer.value = undefined
    }
})

const updateData = () => {
    fetch("/api/arrivals/all")
    .then((resp) => {
        if(resp.status === 200)
            return resp.json()
        else
            return []
    })
    .then((data) => {
        data.sort((a,b) => a.name.localeCompare(b.name))
        allBuses.value = data
    })
}
</script>

<style>
body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    transition: color 0.5s, background-color 0.5s;
    text-rendering: optimizeLegibility;
    user-select: none;
}

main {
    display: grid;
    grid-template-columns: auto;
    gap: 4pt;
}
@media (width > 500px) {
    main {
        grid-template-columns: repeat(2, auto);
    }
}
@media (width > 1000px) {
    main {
        grid-template-columns: repeat(3, auto);
    }
}
@media (width > 1500px) {
    main {
        grid-template-columns: repeat(4, auto);
    }
}

</style>
