<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoutesStore } from './stores/routes'

const routesStore = useRoutesStore()

onMounted(() => {
  routesStore.loadRoutesFromLocalStorage()
})
</script>

<template>
  <router-view />
</template>
