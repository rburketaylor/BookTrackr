import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BookCard from '../BookCard.vue'
import type { Book } from '@/types/domain'

const book: Book = {
  id: 'book-1',
  title: 'Testing Vue Components',
  author: 'QA Expert',
  status: 'to-read',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  description: 'A handbook for writing tests.',
  coverUrl: 'https://example.com/cover.jpg',
}

describe('BookCard', () => {
  it('renders book details', () => {
    const wrapper = mount(BookCard, {
      props: { book },
    })

    expect(wrapper.text()).toContain('Testing Vue Components')
    expect(wrapper.text()).toContain('QA Expert')
    expect(wrapper.find('img').attributes('src')).toBe(book.coverUrl)
  })

  it('emits status-change on select update', async () => {
    const wrapper = mount(BookCard, {
      props: { book },
    })

    const select = wrapper.get('select')
    await select.setValue('reading')

    const events = wrapper.emitted('status-change')
    expect(events).toBeTruthy()
    expect(events?.[0]?.[0]).toEqual({ id: 'book-1', status: 'reading' })
  })

  it('emits delete and edit events', async () => {
    const wrapper = mount(BookCard, {
      props: { book },
    })

    await wrapper.get('button.btn--danger').trigger('click')
    await wrapper.get('button.btn--ghost').trigger('click')

    expect(wrapper.emitted('delete')?.[0]).toEqual(['book-1'])
    expect(wrapper.emitted('edit')?.[0]).toEqual(['book-1'])
  })
})
