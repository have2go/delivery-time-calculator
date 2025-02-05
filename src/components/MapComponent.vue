<template>
  <q-page class="flex flex-center column" style="width: 100%">
    <div id="map" class="map-container"></div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet-draw'
import { useRoutesStore } from '../stores/routes'

const routesStore = useRoutesStore()

let map: L.Map
let drawnItems: L.FeatureGroup

onMounted(() => {
  map = L.map('map').setView([51.505, -0.09], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  drawnItems = new L.FeatureGroup()
  map.addLayer(drawnItems)

  const drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
    },
    draw: {
      polygon: false,
      circlemarker: false,
      marker: false,
      circle: false,
      rectangle: false,
      polyline: {
        shapeOptions: {
          color: 'blue',
        },
        showLength: false,
      },
    },
  })
  map.addControl(drawControl)

  map.on(L.Draw.Event.CREATED, (event) => {
    const layer = event.layer

    if (layer instanceof L.Polyline) {
      const coordinates = (layer.getLatLngs() as L.LatLng[]).map((latlng) => [
        latlng.lat,
        latlng.lng,
      ])

      const speed = prompt('Введите среднюю скорость (км/ч):')
      if (!speed || isNaN(parseFloat(speed))) {
        alert('Некорректная скорость. Маршрут не добавлен.')
        return
      }

      const routeCoordinates = JSON.stringify(coordinates)
      routesStore.addRoute(parseFloat(speed), routeCoordinates)
    }

    drawnItems.addLayer(layer)
  })

  drawRoutes()
})

const drawRoutes = () => {
  console.log('Drawing routes...')
  if (!map) {
    console.error('Map is not initialized!')
    return
  }
  map.eachLayer((layer) => {
    if (layer instanceof L.Polyline || layer instanceof L.Marker) {
      map.removeLayer(layer)
    }
  })

  routesStore.routes.forEach((route) => {
    const polyline = L.polyline(route.coordinates, { color: 'blue' }).addTo(map)
    map.fitBounds(polyline.getBounds())

    const startPoint = route.coordinates[0]
    if (!startPoint) return

    const startMarker = L.marker(startPoint).addTo(map)
    updateStartMarkerPopup(startMarker, route.id, route.departureTime)

    const endPoint = route.coordinates[route.coordinates.length - 1]
    if (!endPoint) return

    const endMarker = L.marker(endPoint).addTo(map)
    updateEndMarkerPopup(endMarker, route)
  })
}

interface Route {
  id: number
  speed: number
  coordinates: [number, number][]
  departureTime: Date
  arrivalTime: Date
}

const updateStartMarkerPopup = (marker: L.Marker, routeId: number, departureTime: Date) => {
  const popupContent = `
    <div>
      <label>Время отправления:</label>
      <input
        type="datetime-local"
        value="${toUTC(departureTime)}"
        onchange="updateDepartureTime(${routeId}, this.value)"
      />
    </div>
  `
  marker.bindPopup(popupContent).openPopup()
}

const updateEndMarkerPopup = (marker: L.Marker, route: Route) => {
  const remainingTime = Math.max(0, route.arrivalTime.getTime() - Date.now())
  const hours = Math.floor(remainingTime / (1000 * 60 * 60))
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)

  const popupContent = `
    <div>
      <strong>Время прибытия:</strong> ${route.arrivalTime.toLocaleTimeString()}<br>
      <strong>Ср. скорость:</strong>
      <input
        type="number"
        value="${route.speed}"
        onchange="updateSpeed(${route.id}, this.value)"
      ><br>
      <strong>Осталось времени:</strong> ${hours}ч ${minutes}мин ${seconds}сек<br>
      <button onclick="deleteRoute(${route.id})">Удалить маршрут</button>
    </div>
  `
  marker.bindPopup(popupContent).openPopup()
}

const toUTC = (localDate: Date): string => {
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

interface WindowWithGlobals extends Window {
  updateDepartureTime: (id: number, newValue: string) => void
  updateSpeed: (id: number, newValue: string) => void
  deleteRoute: (id: number) => void
}

declare let window: WindowWithGlobals

window.updateDepartureTime = (id: number, newValue: string) => {
  const newDepartureTime = new Date(newValue)
  if (isNaN(newDepartureTime.getTime())) {
    alert('Некорректное значение времени отправления.')
    return
  }
  routesStore.updateDepartureTime(id, newDepartureTime)
}

window.updateSpeed = (id: number, newValue: string) => {
  const newSpeed = parseFloat(newValue)
  if (isNaN(newSpeed) || newSpeed <= 0) {
    alert('Некорректное значение средней скорости.')
    return
  }
  routesStore.updateSpeed(id, newSpeed)
}

window.deleteRoute = (id: number) => {
  routesStore.deleteRoute(id)
}

watch(
  () => routesStore.routes,
  () => {
    drawRoutes()
  },
  { deep: true },
)
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
  margin-top: 20px;
}
</style>
