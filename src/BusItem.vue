<template>
    <div 
        class="card"
        :class="{'border-success' : props.bus.arrived}"
    >
        <div class="card-body my-card-body">
            <div>
                {{ props.bus.name }}
            </div>

            <div 
                v-if="props.bus.arrived"
                class="text-secondary"
            >
                <FontAwesomeIcon :icon="faClock" />
                {{ timeFormat(props.bus.datetime) }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

const props = defineProps({
    bus: { 
        type: Object,
        required: true,
        default: () => {}
    },
})

const timeFormat = (datetime) => {
    let dt = new Date(datetime)
    return dt.toLocaleTimeString(undefined, { timeStyle: "short" })
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