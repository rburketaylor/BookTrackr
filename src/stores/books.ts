import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { BOOK_STATUSES, type Book, type BookStatus } from '@/types/domain'
import { sanitizeText, sanitizeUrl, isValidImageUrl } from '@/utils/sanitize'

type CreateBookPayload = Pick<Book, 'title' | 'author' | 'description' | 'coverUrl'> & {
  status?: BookStatus
}

type UpdateBookPayload = Partial<CreateBookPayload>

type FetchResult = {
  books: Book[]
}

const STATUS_SET = new Set<BookStatus>(BOOK_STATUSES)

function nowIso() {
  return new Date().toISOString()
}

function sanitizeStatus(status: BookStatus | undefined): BookStatus {
  if (!status || !STATUS_SET.has(status)) {
    return 'to-read'
  }
  return status
}

function sanitizeCoverUrl(value: string | undefined): string {
  const url = sanitizeUrl(value, 240)
  if (url && !isValidImageUrl(url)) {
    return ''
  }
  return url
}

function createBookId() {
  const globalCrypto = globalThis.crypto
  if (globalCrypto?.randomUUID) {
    return `book-${globalCrypto.randomUUID()}`
  }
  return `book-${Math.random().toString(36).slice(2, 10)}`
}

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const isLoading = ref(false)
  const isProcessing = ref(false)
  const error = ref<string | null>(null)
  const lastLoadedAt = ref<string | null>(null)

  const totalCount = computed(() => books.value.length)

  const statusCounts = computed(() => {
    return BOOK_STATUSES.reduce<Record<BookStatus, number>>((acc, status) => {
      acc[status] = books.value.filter((book) => book.status === status).length
      return acc
    }, {
      'to-read': 0,
      reading: 0,
      finished: 0,
    })
  })

  function setBooks(next: Book[]) {
    books.value = next.map((book) => ({ ...book }))
    lastLoadedAt.value = nowIso()
  }

  async function fetchBooks(fetcher: () => Promise<FetchResult>) {
    if (isLoading.value) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const { books: incoming } = await fetcher()
      setBooks(incoming)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load books.'
    } finally {
      isLoading.value = false
    }
  }

  async function addBook(payload: CreateBookPayload) {
    isProcessing.value = true
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const timestamp = nowIso()
      const cleanTitle = sanitizeText(payload.title, 120)
      const cleanAuthor = sanitizeText(payload.author, 120)
      if (!cleanTitle || !cleanAuthor) {
        throw new Error('Title and author are required.')
      }

      const newBook: Book = {
        id: createBookId(),
        title: cleanTitle,
        author: cleanAuthor,
        description: sanitizeText(payload.description, 560) || undefined,
        coverUrl: sanitizeCoverUrl(payload.coverUrl) || undefined,
        status: sanitizeStatus(payload.status),
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      books.value = [newBook, ...books.value]
    } finally {
      isProcessing.value = false
    }
  }

  async function updateBook(id: string, changes: UpdateBookPayload) {
    isProcessing.value = true
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const index = books.value.findIndex((book) => book.id === id)
      if (index === -1) {
        throw new Error('Book not found.')
      }

      const original = books.value[index]!
      const hasTitleChange = changes.title !== undefined
      const nextTitle = hasTitleChange
        ? sanitizeText(changes.title, 120) || original.title
        : original.title

      const hasAuthorChange = changes.author !== undefined
      const nextAuthor = hasAuthorChange
        ? sanitizeText(changes.author, 120) || original.author
        : original.author

      const hasDescriptionChange = changes.description !== undefined
      const nextDescription = hasDescriptionChange
        ? sanitizeText(changes.description, 560)
        : original.description ?? ''

      const hasCoverChange = changes.coverUrl !== undefined
      const nextCover = hasCoverChange
        ? sanitizeCoverUrl(changes.coverUrl)
        : original.coverUrl ?? ''

      const updated: Book = {
        ...original,
        title: nextTitle,
        author: nextAuthor,
        description: nextDescription ? nextDescription : undefined,
        coverUrl: nextCover ? nextCover : undefined,
        status: changes.status !== undefined ? sanitizeStatus(changes.status) : original.status,
        updatedAt: nowIso(),
      }

      books.value.splice(index, 1, updated)
    } finally {
      isProcessing.value = false
    }
  }

  async function setStatus(id: string, nextStatus: BookStatus) {
    isProcessing.value = true
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      const index = books.value.findIndex((book) => book.id === id)
      if (index === -1) {
        throw new Error('Book not found.')
      }

      const original = books.value[index]!
      const targetStatus = sanitizeStatus(nextStatus)
      if (original.status === targetStatus) {
        return
      }

      books.value.splice(index, 1, {
        ...original,
        status: targetStatus,
        updatedAt: nowIso(),
      })
    } finally {
      isProcessing.value = false
    }
  }

  async function removeBook(id: string) {
    isProcessing.value = true
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 200))

      books.value = books.value.filter((book) => book.id !== id)
    } finally {
      isProcessing.value = false
    }
  }

  function getById(id: string) {
    return books.value.find((book) => book.id === id) ?? null
  }

  function clear() {
    books.value = []
    error.value = null
    lastLoadedAt.value = null
  }

  return {
    books,
    isLoading,
    isProcessing,
    error,
    totalCount,
    statusCounts,
    lastLoadedAt,
    fetchBooks,
    addBook,
    updateBook,
    setStatus,
    removeBook,
    getById,
    clear,
  }
})
