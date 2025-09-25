import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { h } from 'vue'
import { registerRouterGuards } from '../guards'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: { render: () => h('div') }, meta: { requiresAuth: false } },
  { path: '/books', name: 'books.list', component: { render: () => h('div') }, meta: { requiresAuth: true } },
]

let router: ReturnType<typeof createRouter> | null = null

describe('registerRouterGuards', () => {
  beforeEach(async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    vi.useFakeTimers()

    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    registerRouterGuards(router, pinia)

    router.push('/login')
    await router.isReady()
  })

  afterEach(() => {
    vi.useRealTimers()
    router = null
  })

  it('redirects unauthenticated users to login', async () => {
    const auth = useAuthStore()

    await router!.push('/books').catch(() => {})

    expect(router!.currentRoute.value.path).toBe('/login')
    expect(router!.currentRoute.value.query.redirect).toBe('/books')
    expect(auth.isAuthenticated).toBe(false)
  })

  it('allows navigation after authentication', async () => {
    const auth = useAuthStore()

    const loginPromise = auth.login({ username: 'reader', password: 'books' })
    await vi.advanceTimersByTimeAsync(600)
    await loginPromise

    await router!.push('/books')

    expect(router!.currentRoute.value.path).toBe('/books')
  })

  it('redirects authenticated users away from login', async () => {
    const auth = useAuthStore()

    const loginPromise = auth.login({ username: 'reader', password: 'books' })
    await vi.advanceTimersByTimeAsync(600)
    await loginPromise

    await router!.push('/books')
    expect(router!.currentRoute.value.path).toBe('/books')

    await router!.push('/login')

    expect(router!.currentRoute.value.path).toBe('/books')
  })
})
