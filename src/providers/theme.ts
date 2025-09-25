import { inject, provide, readonly, ref, watchEffect } from 'vue'
import type { Ref } from 'vue'

export type ThemeVariant = 'light' | 'dark'

export interface ThemeContext {
  theme: Readonly<Ref<ThemeVariant>>
  toggleTheme: () => void
  setTheme: (theme: ThemeVariant) => void
}

const THEME_STORAGE_KEY = 'booktrackr-theme'
const VALID_THEMES: ThemeVariant[] = ['light', 'dark']
const themeSymbol = Symbol.for('booktrackr:theme')

function inferInitialTheme(): ThemeVariant {
  try {
    const stored = globalThis.localStorage?.getItem(THEME_STORAGE_KEY)
    if (stored && VALID_THEMES.includes(stored as ThemeVariant)) {
      return stored as ThemeVariant
    }
  } catch (error) {
    // no-op if storage is unavailable
  }

  if (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function applyDocumentTheme(theme: ThemeVariant) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme
  }
}

export function provideTheme(): ThemeContext {
  const theme = ref<ThemeVariant>(inferInitialTheme())

  function setTheme(next: ThemeVariant) {
    if (!VALID_THEMES.includes(next)) {
      return
    }
    theme.value = next
    applyDocumentTheme(next)
    try {
      globalThis.localStorage?.setItem(THEME_STORAGE_KEY, next)
    } catch (error) {
      // ignore storage errors (private mode, etc.)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  watchEffect(() => {
    applyDocumentTheme(theme.value)
  })

  provide(themeSymbol, {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
  })

  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
  }
}

export function injectTheme(): ThemeContext {
  const context = inject<ThemeContext>(themeSymbol)
  if (!context) {
    throw new Error('Theme context is missing. Call provideTheme() in a parent component.')
  }
  return context
}
