<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/books')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="not-found">
    <div class="not-found__content">
      <h1 class="not-found__title">404</h1>
      <p class="not-found__message">Page not found</p>
      <p class="not-found__hint">The page you're looking for doesn't exist or has been moved.</p>
      <div class="not-found__actions">
        <button type="button" class="btn btn--primary" @click="goHome">
          Go to Library
        </button>
        <button type="button" class="btn btn--ghost" @click="goBack">
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--color-app-bg);
}

.not-found__content {
  max-width: 500px;
  text-align: center;
}

.not-found__title {
  margin: 0 0 1rem;
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 800;
  color: var(--color-primary);
}

.not-found__message {
  margin: 0 0 1rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
}

.not-found__hint {
  margin: 0 0 2rem;
  color: var(--color-muted);
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
</style>