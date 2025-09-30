<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)
const errorInfo = ref<string | null>(null)

onErrorCaptured((err, _instance, info) => {
  error.value = err
  errorInfo.value = info
  console.error('ErrorBoundary caught error:', err, info)
  return false
})

function resetError() {
  error.value = null
  errorInfo.value = null
}
</script>

<template>
  <div v-if="error" class="error-boundary">
    <div class="error-boundary__content">
      <h2 class="error-boundary__title">Something went wrong</h2>
      <p class="error-boundary__message">{{ error.message }}</p>
      <details v-if="errorInfo" class="error-boundary__details">
        <summary>Technical details</summary>
        <pre>{{ errorInfo }}</pre>
      </details>
      <button type="button" class="btn btn--primary" @click="resetError">
        Try again
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--color-app-bg);
}

.error-boundary__content {
  max-width: 600px;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  text-align: center;
}

.error-boundary__title {
  margin: 0 0 1rem;
  color: #dc2626;
}

.error-boundary__message {
  margin: 0 0 1.5rem;
  color: var(--color-muted);
}

.error-boundary__details {
  margin-bottom: 1.5rem;
  text-align: left;
}

.error-boundary__details pre {
  margin-top: 0.5rem;
  padding: 1rem;
  background: var(--color-surface-muted);
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.85rem;
}
</style>