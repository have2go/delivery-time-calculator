import * as turf from '@turf/turf'
import { defineStore } from 'pinia'

interface Route {
  id: number
  speed: number
  coordinates: [number, number][]
  departureTime: Date
  arrivalTime: Date
}

export const useRoutesStore = defineStore('routes', {
  state: () => ({
    routes: [] as Route[],
    nextRouteId: 1,
  }),

  actions: {
    addRoute(speed: number, coordinates: string) {
      let coords: [number, number][]
      try {
        coords = JSON.parse(coordinates)
      } catch {
        throw new Error('Некорректный формат координат.')
      }

      if (!Array.isArray(coords) || coords.length < 2) {
        throw new Error('Введите как минимум две точки (четыре координаты через запятую).')
      }

      const line = turf.lineString(coords)
      const distanceInKm = turf.length(line, { units: 'kilometers' })

      const departureTime = new Date()
      const timeInSeconds = (distanceInKm / speed) * 3600
      const arrivalTime = new Date(departureTime.getTime() + timeInSeconds * 1000)

      this.routes.push({
        id: this.nextRouteId++,
        speed,
        coordinates: coords,
        departureTime,
        arrivalTime,
      })

      this.saveRoutesToLocalStorage()
    },

    deleteRoute(id: number) {
      const index = this.routes.findIndex((route) => route.id === id)
      if (index !== -1) {
        this.routes.splice(index, 1)
        this.saveRoutesToLocalStorage()
      }
    },

    updateDepartureTime(id: number, newDepartureTime: Date) {
      const route = this.routes.find((route) => route.id === id)
      if (!route) return

      route.departureTime = newDepartureTime

      const line = turf.lineString(route.coordinates)
      const distanceInKm = turf.length(line, { units: 'kilometers' })
      const timeInSeconds = (distanceInKm / route.speed) * 3600
      route.arrivalTime = new Date(newDepartureTime.getTime() + timeInSeconds * 1000)

      this.saveRoutesToLocalStorage()
    },

    updateSpeed(id: number, newSpeed: number) {
      const route = this.routes.find((route) => route.id === id)
      if (!route) return

      route.speed = newSpeed

      const line = turf.lineString(route.coordinates)
      const distanceInKm = turf.length(line, { units: 'kilometers' })
      const timeInSeconds = (distanceInKm / newSpeed) * 3600
      route.arrivalTime = new Date(route.departureTime.getTime() + timeInSeconds * 1000)

      this.saveRoutesToLocalStorage()
    },

    saveRoutesToLocalStorage() {
      const serializedRoutes = JSON.stringify(
        this.routes.map((route) => ({
          ...route,
          departureTime: route.departureTime.toISOString(),
          arrivalTime: route.arrivalTime.toISOString(),
        })),
      )
      localStorage.setItem('routes', serializedRoutes)
    },

    loadRoutesFromLocalStorage() {
      const savedRoutes = localStorage.getItem('routes')
      if (savedRoutes) {
        try {
          interface SavedRoute {
            id: number
            speed: number
            coordinates: [number, number][]
            departureTime: string
            arrivalTime: string
          }

          const parsedRoutes = JSON.parse(savedRoutes).map((route: SavedRoute) => ({
            ...route,
            departureTime: new Date(route.departureTime),
            arrivalTime: new Date(route.arrivalTime),
          }))

          this.routes = parsedRoutes

          this.nextRouteId = Math.max(...parsedRoutes.map((r: Route) => r.id), 0) + 1
        } catch (error) {
          console.error('Ошибка при загрузке маршрутов из localStorage:', error)
        }
      }
    },
  },
})
