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
                @click="onBusItemClicked(bus)"
            />
        </main>

        <div 
            id="myModal"
            class="modal fade" 
            tabindex="-1"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Potwierdzenie
                        </h5>
                        <button 
                            type="button" 
                            class="btn-close" 
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                        />
                    </div>
                    <div class="modal-body">
                        <h5>{{ bus_changing ? bus_changing.name : "" }}</h5>
                        <p>Czy na pewno zmienić status autokaru?</p>
                    </div>
                    <div class="modal-footer">
                        <button 
                            type="button" 
                            class="btn btn-secondary" 
                            data-bs-dismiss="modal"
                        >
                            <FontAwesomeIcon :icon="faChevronLeft" />
                            <span class="ms-2">Anuluj</span>
                        </button>
                        <button 
                            type="button" 
                            class="btn btn-primary" 
                            data-bs-dismiss="modal"
                            @click="onChangeState"
                        >
                            <FontAwesomeIcon :icon="faCircleCheck" />
                            <span class="ms-2">Zmień</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import BusItem from './BusItem.vue'

const allBuses = ref([])
const timer = ref(undefined)
const bus_changing = ref(undefined)

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

const onBusItemClicked = (bus) => {
    bus_changing.value = bus
    const dlg = new Modal('#myModal')
    dlg.show()
}

const onChangeState = () => {
    console.log("onChangeState", bus_changing.value)
    
    fetch("/api/arrivals/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            bus_id: bus_changing.value.bus_id,
            state: !bus_changing.value.arrived
        })
    })
    .then((resp) => {
        if(resp.status === 200) {
            updateData()
        }
        bus_changing.value = undefined
    })
}

const stopTimer = () => {
    if(timer.value != undefined) {
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
