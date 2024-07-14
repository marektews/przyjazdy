<template>
    <div class="container my-2">
        <h3 class="text-center">
            Poranne przyjazdy autokarów
        </h3>
        <div class="text-center text-muted">
            Klikaj w kafelek, żeby zmieniać stan
        </div>
        <div 
            v-if="allBusesCnt > 0"
            class="text-center text-muted"
        >
            Statystyka: {{ arrivalsCnt }} z {{ allBusesCnt }}
        </div>
        <main class="mt-3">
            <BusItem 
                v-for="(bus, index) of allBuses" 
                :key="index"
                :bus="bus"
                @change="onBusItemChanged"
            />
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BusItem from './BusItem.vue'

const allBuses = ref([])
const timer = ref(undefined)

const allBusesCnt = computed(() => allBuses.value ? allBuses.value.length : 0)
const arrivalsCnt = computed(() => {
    let cnt = 0
    allBuses.value.forEach((bus) => {
        if(bus.arrived) ++cnt
    })
    return cnt
})

onMounted(() => {
    updateData()
    startTimer()
})
onUnmounted(() => stopTimer())

const onBusItemChanged = (ev) => {
    console.log("onBusItemChanged", ev)
    updateData()
}

const stopTimer = () => {
    if(timer.value) {
        clearTimeout(timer.value)
        timer.value = undefined
    }
}

const startTimer = () => {
    timer.value = setTimeout(() => {
        updateData()
    }, 20000)
}

const updateData = () => {
    stopTimer()

    fetch("/api/arrivals/all")
    .then((resp) => {
        startTimer()
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
