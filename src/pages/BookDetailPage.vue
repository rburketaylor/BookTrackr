<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PrivateLayout from '@/layouts/PrivateLayout.vue'
import StatusBanner from '@/components/ui/StatusBanner.vue'
import { useBooks } from '@/composables/useBooks'
import type { Book } from '@/types/domain'

const route = useRoute()
const router = useRouter()
const { loadBooks, getBookById, isLoading, error } = useBooks()

const book = ref<Book | null>(null)

const bookId = computed(() => String(route.params.id))

async function hydrateBook(id: string) {
  await loadBooks()
  const record = getBookById(id)
  if (!record) {
    router.replace('/books')
    return
  }
  book.value = record
}

onMounted(() => {
  hydrateBook(bookId.value)
})

watch(
  () => bookId.value,
  (nextId) => {
    if (nextId) {
      hydrateBook(nextId)
    }
  }
)
</script>

<template>
  <PrivateLayout>
    <template #actions>
      <button type="button" class="btn btn--ghost" @click="router.back()">Back</button>
    </template>

    <section class="detail">
      <StatusBanner v-if="isLoading && !book" type="info">Loading book…</StatusBanner>
      <StatusBanner v-else-if="error" type="error">{{ error }}</StatusBanner>
      <article v-else-if="book" class="detail__card">
        <header class="detail__header">
          <div>
            <h1 class="detail__title">{{ book.title }}</h1>
            <p class="detail__author">{{ book.author }}</p>
          </div>
          <span class="detail__badge detail__badge--status">{{ book.status }}</span>
        </header>

        <img
          v-if="book.coverUrl"
          :src="book.coverUrl"
          :alt="`${book.title} cover art`"
          class="detail__cover"
          loading="lazy"
        />

        <p v-if="book.description" class="detail__description">{{ book.description }}</p>

        <dl class="detail__meta">
          <div>
            <dt>Created</dt>
            <dd>{{ new Date(book.createdAt).toLocaleDateString() }}</dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>{{ new Date(book.updatedAt).toLocaleDateString() }}</dd>
          </div>
        </dl>
      </article>
      <StatusBanner v-else type="warning">Book not found.</StatusBanner>
    </section>
  </PrivateLayout>
</template>

<style scoped>

.detail {
  display: grid;
  gap: 2rem;
}

.detail__card {
  display: grid;
  gap: 1.5rem;
  padding: 2.5rem;
  border-radius: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 30px 70px -60px rgba(15, 23, 42, 0.45);
}

.detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.detail__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 2.75rem);
}

.detail__author {
  margin: 0.5rem 0 0;
  color: var(--color-muted);
}

.detail__badge {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.detail__badge--status {
  background: var(--color-primary);
  color: white;
}

.detail__cover {
  width: min(220px, 100%);
  justify-self: center;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  object-fit: cover;
}

.detail__description {
  margin: 0;
  line-height: 1.6;
  color: var(--color-muted);
}

.detail__meta {
  display: flex;
  gap: 2rem;
}

dl {
  margin: 0;
}

dt {
  font-weight: 600;
  color: var(--color-muted);
}

dd {
  margin: 0.25rem 0 0;
}

</style>
