import { randomUUID, webcrypto } from 'node:crypto'
import { vi } from 'vitest'

if (typeof globalThis.matchMedia !== 'function') {
  globalThis.matchMedia = ((query: string) => ({
    matches: query.includes('prefers-color-scheme') ? false : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as typeof globalThis.matchMedia
}

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: webcrypto as Crypto,
  })
}

if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => randomUUID()
}
