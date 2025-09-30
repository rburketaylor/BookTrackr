import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Credentials, User } from '@/types/domain'

type AuthStatus = 'idle' | 'pending' | 'authenticated' | 'error'

const MOCK_USER: Readonly<User> = Object.freeze({
  id: 'user-reader-1',
  username: 'reader',
  displayName: 'Avid Reader',
})

const NETWORK_DELAY_MS = 600
const STORAGE_KEY = 'booktrackr-auth'

function loadPersistedUser(): User | null {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate the structure
      if (parsed && typeof parsed.id === 'string' && typeof parsed.username === 'string') {
        return parsed as User
      }
    }
  } catch {
    // Ignore errors and return null
  }
  return null
}

function persistUser(user: User | null) {
  try {
    if (user) {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      globalThis.localStorage?.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors (private mode, etc.)
  }
}

export const useAuthStore = defineStore('auth', () => {
  const persistedUser = loadPersistedUser()
  const user = ref<User | null>(persistedUser)
  const status = ref<AuthStatus>(persistedUser ? 'authenticated' : 'idle')
  const error = ref<string | null>(null)
  const lastAttemptAt = ref<number | null>(null)

  const isAuthenticated = computed(() => Boolean(user.value))

  async function login(credentials: Credentials) {
    const username = credentials.username.trim()
    const password = credentials.password.trim()

    if (!username || !password) {
      status.value = 'error'
      error.value = 'Please enter both a username and password.'
      throw new Error(error.value)
    }

    status.value = 'pending'
    error.value = null
    lastAttemptAt.value = Date.now()

    await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))

    const isValid = username === MOCK_USER.username && password === 'books'

    if (!isValid) {
      status.value = 'error'
      error.value = 'Invalid username or password.'
      throw new Error(error.value)
    }

    user.value = {
      ...MOCK_USER,
      username,
    }
    status.value = 'authenticated'
    error.value = null

    persistUser(user.value)

    return user.value
  }

  function logout() {
    user.value = null
    status.value = 'idle'
    error.value = null
    lastAttemptAt.value = null
    persistUser(null)
  }

  function clearError() {
    if (status.value === 'error') {
      status.value = user.value ? 'authenticated' : 'idle'
    }
    error.value = null
  }

  return {
    user,
    status,
    error,
    lastAttemptAt,
    isAuthenticated,
    login,
    logout,
    clearError,
  }
})
