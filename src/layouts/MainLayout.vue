<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Quasar App </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Добавить маршрут</q-item-label>
        <RouteForm />

        <q-item-label header>Маршруты</q-item-label>
        <q-item v-for="route in routes" :key="route.id" class="q-pa-sm">
          <q-item-section>
            <q-item-label>
              Ср. скорость:
              <q-input
                v-model="speedInputs[route.id]"
                type="number"
                dense
                outlined
                @update:model-value="updateSpeed(route.id)"
              />
            </q-item-label>

            <q-item-label caption>
              <q-table
                :rows="getCoordinateRows(route.coordinates)"
                :columns="coordinateColumns"
                row-key="index"
                dense
                hide-pagination
                :pagination="{ rowsPerPage: 0 }"
                class="custom-table"
              />
            </q-item-label>

            <q-item-label caption>
              Время отправления:
              <q-input
                v-model="departureTimeInputs[route.id]"
                type="datetime-local"
                dense
                outlined
                @update:model-value="updateDepartureTime(route.id)"
              />
            </q-item-label>

            <q-item-label caption>
              Время прибытия:
              <div class="arrival-time">
                {{ formatDate(route.arrivalTime) }}
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn flat round icon="delete" color="negative" @click="deleteRoute(route.id)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoutesStore } from '../stores/routes'
import RouteForm from '../components/RouteForm.vue'

const routesStore = useRoutesStore()

const routes = routesStore.routes

const departureTimeInputs = ref<{ [key: number]: string }>({})

const speedInputs = ref<{ [key: number]: number }>({})

const deleteRoute = (id: number) => {
  routesStore.deleteRoute(id)
}

const toUTC = (localDate: Date): string => {
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

const updateDepartureTime = (id: number) => {
  const departureTimeInput = departureTimeInputs.value[id]
  if (!departureTimeInput) {
    console.error(`Время отправления для маршрута с ID ${id} не найдено.`)
    return
  }

  const newDepartureTime = new Date(departureTimeInput)

  if (isNaN(newDepartureTime.getTime())) {
    console.error(`Некорректное значение времени отправления для маршрута с ID ${id}.`)
    return
  }

  routesStore.updateDepartureTime(id, newDepartureTime)
}

const updateSpeed = (id: number) => {
  const speedInput = speedInputs.value[id]
  if (!speedInput || isNaN(speedInput)) {
    console.error(`Некорректное значение скорости для маршрута с ID ${id}.`)
    return
  }

  routesStore.updateSpeed(id, speedInput)
}

const initializeRouteData = () => {
  departureTimeInputs.value = {}
  speedInputs.value = {}
  routes.forEach((route) => {
    departureTimeInputs.value[route.id] = toUTC(route.departureTime)

    speedInputs.value[route.id] = route.speed
  })
}

watch(
  () => routesStore.routes,
  () => {
    initializeRouteData()
  },
  { deep: true },
)

const getCoordinateRows = (coordinates: [number, number][]) => {
  return coordinates.map((coord, index) => ({
    index: index + 1,
    x: coord[0],
    y: coord[1],
  }))
}

const coordinateColumns = [
  { name: 'index', label: '№', field: 'index', align: 'left' as const },
  { name: 'x', label: 'X (широта)', field: 'x', align: 'left' as const },
  { name: 'y', label: 'Y (долгота)', field: 'y', align: 'left' as const },
]

const formatDate = (date: Date): string => {
  const formattedDate = date.toLocaleDateString()
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${formattedDate}, ${formattedTime}`
}

const leftDrawerOpen = ref(false)
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  initializeRouteData()
})
</script>

<style scoped>
.q-item {
  border-top: 3px solid #1976d2;
}

.arrival-time {
  color: black;
  font-size: 14px;
  margin-top: 4px;
  display: block;
  padding-left: 14px;
}
</style>
