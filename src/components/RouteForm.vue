<template>
  <div class="route-form">
    <div class="coordinate-grid">
      <div v-for="(point, index) in coordinates" :key="index" class="grid-row">
        <q-input
          v-model="point.x"
          type="number"
          placeholder="Широта"
          dense
          outlined
          class="grid-cell"
        />
        <q-input
          v-model="point.y"
          type="number"
          placeholder="Долгота"
          dense
          outlined
          class="grid-cell"
        />
        <div v-if="index === 0 || index === coordinates.length - 1" class="empty-cell"></div>
        <q-btn v-else flat round icon="delete" color="negative" @click="removePoint(index)" />
      </div>
    </div>

    <q-btn label="Добавить точку" color="primary" @click="addPoint" class="add-point-btn" />

    <q-input
      v-model="speed"
      type="number"
      placeholder="Средняя скорость (км/ч)"
      dense
      outlined
      class="speed-input"
    />

    <q-btn label="Добавить маршрут" color="positive" @click="submitForm" class="submit-btn" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoutesStore } from '../stores/routes'

const routesStore = useRoutesStore()

const coordinates = ref<{ x: string; y: string }[]>([
  { x: '', y: '' },
  { x: '', y: '' },
])
const speed = ref('')

const addPoint = () => {
  coordinates.value.splice(coordinates.value.length - 1, 0, { x: '', y: '' })
}

const removePoint = (index: number) => {
  if (coordinates.value.length > 2) {
    coordinates.value.splice(index, 1)
  }
}

const submitForm = () => {
  const parsedCoordinates = coordinates.value.map((point) => {
    const x = parseFloat(point.x)
    const y = parseFloat(point.y)
    if (isNaN(x) || isNaN(y)) {
      alert('Пожалуйста, введите корректные координаты.')
      return null
    }
    return [x, y]
  })

  if (parsedCoordinates.some((coord) => coord === null)) {
    return
  }

  const parsedSpeed = parseFloat(speed.value)
  if (isNaN(parsedSpeed) || parsedSpeed <= 0) {
    alert('Пожалуйста, введите корректную среднюю скорость.')
    return
  }

  const routeCoordinates = JSON.stringify(parsedCoordinates)
  routesStore.addRoute(parsedSpeed, routeCoordinates)

  coordinates.value = [
    { x: '', y: '' },
    { x: '', y: '' },
  ]
  speed.value = ''
}
</script>

<style scoped>
.route-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coordinate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
}

.grid-row {
  display: contents;
}

.grid-cell {
  width: 100%;
}

.empty-cell {
  visibility: hidden;
  width: 40px;
}

.add-point-btn {
  align-self: flex-start;
}

.speed-input {
  margin-top: 8px;
}

.submit-btn {
  align-self: flex-end;
}
</style>
