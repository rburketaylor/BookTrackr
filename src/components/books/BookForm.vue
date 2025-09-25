<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { BOOK_STATUSES, type Book, type BookStatus } from '@/types/domain'

const props = defineProps<{
  initialBook?: Book | null
}>()

const emit = defineEmits<{
  (event: 'submit', payload: { title: string; author: string; description: string; coverUrl: string; status: BookStatus }): void
  (event: 'cancel'): void
}>()

const form = reactive({
  title: props.initialBook?.title ?? '',
  author: props.initialBook?.author ?? '',
  description: props.initialBook?.description ?? '',
  coverUrl: props.initialBook?.coverUrl ?? '',
  status: props.initialBook?.status ?? 'to-read',
})

const errors = reactive({
  title: '',
  author: '',
  status: '',
})

const statusOptions = computed(() => {
  return BOOK_STATUSES.map((status) => ({
    value: status,
    label:
      status === 'reading'
        ? 'Reading'
        : status === 'finished'
          ? 'Finished'
          : 'To Read',
  }))
})

function validate() {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  errors.author = form.author.trim() ? '' : 'Author is required.'
  errors.status = BOOK_STATUSES.includes(form.status) ? '' : 'Choose a valid status.'
  return !errors.title && !errors.author && !errors.status
}

function handleSubmit() {
  if (!validate()) {
    return
  }

  emit('submit', {
    title: form.title.trim(),
    author: form.author.trim(),
    description: form.description.trim(),
    coverUrl: form.coverUrl.trim(),
    status: form.status,
  })
}

watch(
  () => props.initialBook,
  (next) => {
    form.title = next?.title ?? ''
    form.author = next?.author ?? ''
    form.description = next?.description ?? ''
    form.coverUrl = next?.coverUrl ?? ''
    form.status = next?.status ?? 'to-read'
    errors.title = ''
    errors.author = ''
    errors.status = ''
  }
)

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form class="book-form" @submit.prevent="handleSubmit">
    <div class="book-form__field">
      <label for="book-title">Title</label>
      <input id="book-title" v-model="form.title" type="text" required />
      <small v-if="errors.title" class="book-form__error">{{ errors.title }}</small>
    </div>

    <div class="book-form__field">
      <label for="book-author">Author</label>
      <input id="book-author" v-model="form.author" type="text" required />
      <small v-if="errors.author" class="book-form__error">{{ errors.author }}</small>
    </div>

    <div class="book-form__field">
      <label for="book-status">Status</label>
      <select id="book-status" v-model="form.status">
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <small v-if="errors.status" class="book-form__error">{{ errors.status }}</small>
    </div>

    <div class="book-form__field">
      <label for="book-description">Description</label>
      <textarea id="book-description" v-model="form.description" rows="4" />
      <small class="book-form__hint">Optional. Max 560 characters.</small>
    </div>

    <div class="book-form__field">
      <label for="book-cover">Cover URL</label>
      <input id="book-cover" v-model="form.coverUrl" type="url" placeholder="https://" />
      <small class="book-form__hint">Optional. Provide a secure https image URL.</small>
    </div>

    <footer class="book-form__actions">
      <button type="button" class="btn btn--ghost" @click="handleCancel">Cancel</button>
      <button type="submit" class="btn btn--primary">{{ props.initialBook ? 'Update Book' : 'Add Book' }}</button>
    </footer>
  </form>
</template>

<style scoped>
.book-form {
  display: grid;
  gap: 1.25rem;
}

.book-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-form__field label {
  font-weight: 600;
}

.book-form__field input,
.book-form__field select,
.book-form__field textarea {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface-muted);
  font: inherit;
}

.book-form__field textarea {
  resize: vertical;
}

.book-form__error {
  color: #dc2626;
  font-size: 0.85rem;
}

.book-form__hint {
  color: var(--color-muted);
  font-size: 0.75rem;
}

.book-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

</style>
