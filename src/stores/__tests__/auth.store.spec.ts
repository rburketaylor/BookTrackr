import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('authenticates with valid credentials', async () => {
    const store = useAuthStore()
    const loginPromise = store.login({ username: 'reader', password: 'books' })

    await vi.advanceTimersByTimeAsync(600)
    const user = await loginPromise

    expect(user.username).toBe('reader')
    expect(store.isAuthenticated).toBe(true)
    expect(store.error).toBeNull()
  })

  it('rejects invalid credentials', async () => {
    const store = useAuthStore()

    const loginPromise = store.login({ username: 'reader', password: 'wrong' })
    const handledPromise = loginPromise.catch((error) => error)

    await vi.advanceTimersByTimeAsync(600)

    const error = await handledPromise
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toBe('Invalid username or password.')
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toBe('Invalid username or password.')
  })
})
