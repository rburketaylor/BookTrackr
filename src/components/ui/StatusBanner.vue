<script setup lang="ts">
import { computed } from 'vue'

type BannerType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{ type?: BannerType; title?: string }>(),
  {
    type: 'info',
    title: '',
  }
)

const bannerClass = computed(() => `status-banner--${props.type}`)

const ariaRole = computed(() => (props.type === 'error' ? 'alert' : 'status'))
</script>

<template>
  <div class="status-banner" :class="bannerClass" :role="ariaRole">
    <strong v-if="props.title" class="status-banner__title">{{ props.title }}</strong>
    <slot />
  </div>
</template>

<style scoped>
.status-banner {
  padding: 0.85rem 1.1rem;
  border-radius: 0.85rem;
  border: 1px solid transparent;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.status-banner__title {
  font-weight: 700;
}

.status-banner--info {
  background: var(--color-surface-muted);
  border-color: var(--color-border);
}

.status-banner--success {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--color-success);
}

.status-banner--warning {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--color-warning);
}

.status-banner--error {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
  color: #b91c1c;
}
</style>
