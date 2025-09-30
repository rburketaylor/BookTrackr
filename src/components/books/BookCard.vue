<script setup lang="ts">
import { computed } from 'vue'
import type { Book, BookStatus } from '@/types/domain'

const STATUS_LABELS: Record<BookStatus, string> = {
  'to-read': 'To Read',
  reading: 'Reading',
  finished: 'Finished',
}

const props = defineProps<{
  book: Book
}>()

const emit = defineEmits<{
  (event: 'status-change', payload: { id: string; status: BookStatus }): void
  (event: 'delete', id: string): void
  (event: 'edit', id: string): void
}>()

const statusClass = computed(() => {
  return {
    'badge--to-read': props.book.status === 'to-read',
    'badge--reading': props.book.status === 'reading',
    'badge--finished': props.book.status === 'finished',
  }
})

function onStatusSelect(event: Event) {
  const target = event.target as HTMLSelectElement | null
  if (!target) {
    return
  }
  const value = target.value as BookStatus
  emit('status-change', { id: props.book.id, status: value })
}

function emitDelete() {
  emit('delete', props.book.id)
}

function emitEdit() {
  emit('edit', props.book.id)
}
</script>

<template>
  <article class="book-card">
    <img
      v-if="book.coverUrl"
      :src="book.coverUrl"
      :alt="`${book.title} cover art`"
      class="book-card__cover"
      loading="lazy"
      width="96"
      height="144"
    />
    <div class="book-card__content">
      <header class="book-card__header">
        <h3 class="book-card__title" v-text="book.title" />
        <p class="book-card__author" v-text="book.author" />
      </header>
      <p v-if="book.description" class="book-card__description">
        {{ book.description }}
      </p>
      <footer class="book-card__footer">
        <span class="badge" :class="statusClass" v-text="STATUS_LABELS[book.status]" />
        <label class="book-card__status">
          <span class="visually-hidden">Update status</span>
          <select :value="book.status" @change="onStatusSelect">
            <option value="to-read">To Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </label>
        <div class="book-card__actions">
          <button type="button" class="btn btn--ghost" @click="emitEdit">Edit</button>
          <button type="button" class="btn btn--danger" @click="emitDelete">Delete</button>
        </div>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: var(--color-surface);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 30px 70px -60px rgba(15, 23, 42, 0.45);
}

.book-card__cover {
  width: 96px;
  height: 144px;
  object-fit: cover;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.book-card__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-card__title {
  margin: 0;
  font-size: 1.25rem;
}

.book-card__author {
  margin: 0.25rem 0 0;
  color: var(--color-muted);
}

.book-card__description {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.5;
}

.book-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.book-card__status select {
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface-muted);
  font: inherit;
}

.book-card__actions {
  margin-left: auto;
  display: inline-flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge--to-read {
  background: rgba(68, 100, 219, 0.12);
  color: var(--color-primary-accent);
}

.badge--reading {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-warning);
}

.badge--finished {
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-success);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
