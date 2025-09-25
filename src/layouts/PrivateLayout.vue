<template>
  <div class="private-layout">
    <header class="private-layout__header">
      <div class="private-layout__brand">
        <span class="private-layout__logo" aria-hidden="true">📚</span>
        <span class="private-layout__title">BookTrackr</span>
      </div>
      <div class="private-layout__meta">
        <div v-if="user" class="private-layout__user">
          <span class="private-layout__user-name">{{ user.displayName }}</span>
        </div>
        <slot name="actions" />
        <button type="button" class="btn btn--ghost" @click="handleLogout">Logout</button>
      </div>
    </header>
    <main class="private-layout__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

async function handleLogout() {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<style scoped>
.private-layout {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--color-app-bg);
}

.private-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 1.5rem;
}

.private-layout__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.private-layout__logo {
  font-size: 1.75rem;
}

.private-layout__meta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.private-layout__user {
  display: inline-flex;
  flex-direction: column;
  text-align: right;
  color: var(--color-muted);
}

.private-layout__user-name {
  font-weight: 600;
  color: var(--color-app-fg);
}

.private-layout__main {
  padding: 2.5rem min(4vw, 3rem);
}
</style>
