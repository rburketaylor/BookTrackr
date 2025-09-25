<script setup lang="ts">
import { RouterView } from 'vue-router'
import { provideTheme } from '@/providers/theme'

provideTheme()
</script>

<template>
  <div class="app-shell">
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-app-bg);
  color: var(--color-app-fg);
}
</style>
