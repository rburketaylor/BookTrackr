import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBooksStore } from '@/stores/books'
import type { Book, BookStatus } from '@/types/domain'

const MOCK_BOOKS: Book[] = [
  {
    id: 'book-atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'reading',
    description: 'A practical guide on building good habits and breaking bad ones.',
    coverUrl: 'https://covers.openlibrary.org/b/id/15113993-M.jpg',
    createdAt: '2024-12-18T17:21:00.000Z',
    updatedAt: '2025-01-07T08:12:00.000Z',
  },
  {
    id: 'book-deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    status: 'to-read',
    description: 'Focused success in a distracted world with practical strategies.',
    coverUrl: 'https://covers.openlibrary.org/b/id/14859612-M.jpg',
    createdAt: '2025-01-01T09:35:00.000Z',
    updatedAt: '2025-01-01T09:35:00.000Z',
  },
  {
    id: 'book-project-hail-mary',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    status: 'finished',
    description: 'A lone astronaut must save Earth in this sci-fi adventure.',
    coverUrl: 'https://covers.openlibrary.org/b/id/14548865-M.jpg',
    createdAt: '2024-11-11T13:14:00.000Z',
    updatedAt: '2024-12-01T22:45:00.000Z',
  },
]

function withNetworkDelay<T>(callback: () => T | Promise<T>, delayMs = 500) {
  return new Promise<T>((resolve, reject) => {
    globalThis.setTimeout(async () => {
      try {
        resolve(await callback())
      } catch (error) {
        reject(error)
      }
    }, delayMs)
  })
}

function cloneBooks(books: Book[]): Book[] {
  return books.map((book) => ({ ...book }))
}

export function useBooks() {
  const booksStore = useBooksStore()
  const { books, isLoading, error, totalCount, statusCounts } = storeToRefs(booksStore)

  async function loadBooks(force = false) {
    if (!force && books.value.length) {
      return
    }

    await booksStore.fetchBooks(async () => {
      const snapshot = await withNetworkDelay(() => cloneBooks(MOCK_BOOKS))
      return { books: snapshot }
    })
  }

  function getBookById(id: string) {
    return booksStore.getById(id)
  }

  const filterByStatus = computed(() => {
    return (status: BookStatus | 'all') => {
      if (status === 'all') {
        return books.value
      }
      return books.value.filter((book) => book.status === status)
    }
  })

  const statusOptions = computed(() => {
    return [
      { label: 'All', value: 'all' as const },
      { label: 'To Read', value: 'to-read' as const },
      { label: 'Reading', value: 'reading' as const },
      { label: 'Finished', value: 'finished' as const },
    ]
  })

  function removeBook(id: string) {
    booksStore.removeBook(id)
  }

  function setStatus(id: string, status: BookStatus) {
    booksStore.setStatus(id, status)
  }

  function addBook(payload: Parameters<typeof booksStore.addBook>[0]) {
    booksStore.addBook(payload)
  }

  function updateBook(id: string, payload: Parameters<typeof booksStore.updateBook>[1]) {
    booksStore.updateBook(id, payload)
  }

  return {
    books,
    isLoading,
    error,
    totalCount,
    statusCounts,
    loadBooks,
    getBookById,
    filterByStatus,
    statusOptions,
    removeBook,
    setStatus,
    addBook,
    updateBook,
  }
}
