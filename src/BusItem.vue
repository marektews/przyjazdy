<template>
    <div 
        class="card"
        :class="{'border-success' : arrived}"
        @click="onClick"
    >
        <div class="card-body my-card-body">
            <div>
                {{ props.bus.name }}
            </div>

            <div 
                v-if="arrived"
                class="text-secondary"
            >
                <FontAwesomeIcon :icon="faClock" />
                {{ timeFormat(datetime) }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

const props = defineProps({
    bus: { 
        type: Object,
        required: true,
        default: () => {}
    },
})

const emit = defineEmits(['change'])

const arrived = ref(props.bus.arrived)
const datetime = ref(props.bus.datetime)


const timeFormat = (datetime) => {
    let dt = new Date(datetime)
    return dt.toLocaleTimeString(undefined, { timeStyle: "short" })
}

const onClick = () => {
    console.log("onClick", props.bus)
    fetch("/api/arrivals/toggle", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bus_id: props.bus.bus_id,
        })
    })
    .then((resp) => {
        if(resp.status === 200) {
            arrived.value = !arrived.value
            datetime.value = new Date()
            emit('change', 1)
        }
    })
}
</script>

<style scoped>
.my-card-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 8pt;
}
</style>