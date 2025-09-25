export const BOOK_STATUSES = ['to-read', 'reading', 'finished'] as const

export type BookStatus = (typeof BOOK_STATUSES)[number]

export interface Book {
  id: string
  title: string
  author: string
  status: BookStatus
  description?: string
  coverUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Credentials {
  username: string
  password: string
}

export interface User {
  id: string
  username: string
  displayName: string
}
