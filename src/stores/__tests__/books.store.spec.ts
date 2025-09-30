import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBooksStore } from '../books'
import type { Book } from '@/types/domain'

const baseBook: Book = {
  id: 'book-1',
  title: 'Test Book',
  author: 'Tester',
  status: 'to-read',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

describe('useBooksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads books via fetcher', async () => {
    const store = useBooksStore()

    await store.fetchBooks(async () => ({ books: [baseBook] }))

    expect(store.books).toHaveLength(1)
    const first = store.books[0]!
    expect(first.title).toBe('Test Book')
    expect(store.error).toBeNull()
  })

  it('adds a new book after validation', async () => {
    const store = useBooksStore()

    await store.addBook({ title: 'New Book', author: 'Author', description: '', coverUrl: '' })

    const created = store.books[0]!
    expect(created.title).toBe('New Book')
    expect(created.status).toBe('to-read')
  })

  it('updates an existing book and sanitizes fields', async () => {
    const store = useBooksStore()
    await store.fetchBooks(async () => ({ books: [baseBook] }))

    await store.updateBook('book-1', { title: '  Updated  ', status: 'finished', coverUrl: '  https://example.com/image.jpg  ' })

    const updated = store.getById('book-1')
    expect(updated?.title).toBe('Updated')
    expect(updated?.status).toBe('finished')
    expect(updated?.coverUrl).toBe('https://example.com/image.jpg')
  })

  it('changes book status immutably', async () => {
    const store = useBooksStore()
    await store.fetchBooks(async () => ({ books: [baseBook] }))

    const original = store.getById('book-1')
    await store.setStatus('book-1', 'reading')
    const updated = store.getById('book-1')

    expect(updated?.status).toBe('reading')
    expect(updated).not.toBe(original)
  })

  it('removes book by id', async () => {
    const store = useBooksStore()
    await store.fetchBooks(async () => ({ books: [baseBook] }))

    await store.removeBook('book-1')

    expect(store.books).toHaveLength(0)
  })
})
