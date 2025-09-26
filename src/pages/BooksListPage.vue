<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import PrivateLayout from '@/layouts/PrivateLayout.vue'
import BookCard from '@/components/books/BookCard.vue'
import BookForm from '@/components/books/BookForm.vue'
import StatusBanner from '@/components/ui/StatusBanner.vue'
import { useBooks } from '@/composables/useBooks'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import type { BookStatus } from '@/types/domain'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const {
  books,
  isLoading,
  error,
  loadBooks,
  filterByStatus,
  statusOptions,
  removeBook,
  setStatus,
  addBook,
  updateBook,
} = useBooks()

const activeFilter = ref<'all' | BookStatus>('all')
const isFormOpen = ref(false)
const editingId = ref<string | null>(null)
const { theme, toggleTheme } = useTheme()

const themeButtonLabel = computed(() => (theme.value === 'light' ? 'Dark Mode' : 'Light Mode'))

onMounted(async () => {
  await loadBooks()
})

const filteredBooks = computed(() => filterByStatus.value(activeFilter.value))

const editingBook = computed(() => {
  return books.value.find((book) => book.id === editingId.value) ?? null
})

const pageTitle = computed(() => {
  if (activeFilter.value === 'all') {
    return 'Your Library'
  }
  return {
    'to-read': 'To Read',
    reading: 'Currently Reading',
    finished: 'Finished Books',
  }[activeFilter.value]
})

function openCreate() {
  editingId.value = null
  isFormOpen.value = true
}

function openEdit(id: string) {
  editingId.value = id
  isFormOpen.value = true
}

function closeForm() {
  editingId.value = null
  isFormOpen.value = false
}

function handleStatusChange(payload: { id: string; status: BookStatus }) {
  setStatus(payload.id, payload.status)
}

function handleDelete(id: string) {
  removeBook(id)
}

function handleSubmit(payload: { title: string; author: string; description: string; coverUrl: string; status: BookStatus }) {
  if (editingId.value) {
    updateBook(editingId.value, payload)
  } else {
    addBook(payload)
  }
  closeForm()
}
</script>

<template>
  <PrivateLayout>
    <template #actions>
      <div class="library-toolbar">
        <span v-if="user" class="library-toolbar__greeting">Hi, {{ user.displayName }}</span>
        <button type="button" class="btn btn--ghost" @click="toggleTheme">{{ themeButtonLabel }}</button>
        <button type="button" class="btn btn--primary" @click="openCreate">Add Book</button>
      </div>
    </template>

    <section class="library">
      <header class="library__header">
        <div>
          <h1 class="library__title">{{ pageTitle }}</h1>
          <p class="library__subtitle">Track what you plan to read, what you are reading, and what you have finished.</p>
        </div>

        <div class="library__filters">
          <button
            v-for="option in statusOptions"
            :key="option.value"
            type="button"
            class="filter-chip"
            :class="{ 'filter-chip--active': activeFilter === option.value }"
            @click="activeFilter = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </header>

      <StatusBanner v-if="isLoading" type="info">Loading your books…</StatusBanner>
      <StatusBanner v-else-if="error" type="error">{{ error }}</StatusBanner>
      <StatusBanner v-else-if="filteredBooks.length === 0" type="info">
        No books found for this filter yet. Try adding one!
      </StatusBanner>

      <div v-else class="library__grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book.id"
          :book="book"
          @status-change="handleStatusChange"
          @delete="handleDelete"
          @edit="openEdit"
        />
      </div>
    </section>

    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="isFormOpen"
          class="library-modal-backdrop"
          role="presentation"
          @click.self="closeForm"
        >
          <section
            class="library-modal"
            role="dialog"
            :aria-label="editingBook ? 'Edit Book' : 'Add Book'"
            aria-modal="true"
          >
            <header class="library-modal__header">
              <h2 class="library-modal__title">{{ editingBook ? 'Edit Book' : 'Add Book' }}</h2>
              <button type="button" class="btn btn--ghost" @click="closeForm">Close</button>
            </header>
            <BookForm :initial-book="editingBook" @submit="handleSubmit" @cancel="closeForm" />
          </section>
        </div>
      </transition>
    </Teleport>
  </PrivateLayout>
</template>

<style scoped>
.library-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.library-toolbar__greeting {
  color: var(--color-muted);
}

.library {
  display: grid;
  gap: 2rem;
}

.library__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
}

.library__title {
  margin: 0;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.library__subtitle {
  margin: 0.5rem 0 0;
  color: var(--color-muted);
}

.library__filters {
  display: inline-flex;
  gap: 0.35rem;
  padding: 0.35rem;
  border-radius: 0.85rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 16px 40px -26px rgba(15, 23, 42, 0.45);
}

.filter-chip {
  padding: 0.4rem 1.05rem;
  border-radius: 0.7rem;
  border: none;
  background: transparent;
  color: var(--color-muted);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.filter-chip:hover {
  background: var(--color-surface);
}

.filter-chip:focus-visible {
  outline: 3px solid rgba(68, 100, 219, 0.35);
  outline-offset: 2px;
}

.filter-chip--active {
  background: var(--color-primary);
  color: var(--color-app-bg);
  box-shadow: 0 8px 20px -10px rgba(68, 100, 219, 0.45);
}

[data-theme='dark'] .library__filters {
  background: rgba(30, 41, 59, 0.92);
  border-color: rgba(148, 163, 184, 0.45);
  box-shadow: 0 28px 58px -32px rgba(2, 6, 23, 0.85);
}

[data-theme='dark'] .filter-chip:hover {
  background: rgba(148, 163, 184, 0.16);
}

[data-theme='dark'] .filter-chip--active {
  color: var(--color-app-bg);
  box-shadow: 0 16px 32px -18px rgba(2, 6, 23, 0.7);
}

.library__grid {
  display: grid;
  gap: 1.25rem;
}

.library-modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(1.5rem, 4vw, 4rem) 1.5rem;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(16px);
  z-index: 1000;
  overflow-y: auto;
}

.library-modal {
  width: min(720px, 100%);
  margin-top: clamp(2rem, 10vh, 4rem);
  padding: clamp(1.5rem, 2.5vw, 2.25rem);
  border-radius: 1.5rem;
  background: var(--color-surface);
  border: 1px solid rgba(15, 23, 42, 0.12);
  box-shadow: 0 30px 80px -40px rgba(15, 23, 42, 0.45);
}

.library-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.library-modal__title {
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
