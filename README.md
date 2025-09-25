# BookTrackr

BookTrackr is a Vue 3 demo application for keeping tabs on the books you want to read, are currently reading, or have already finished. It showcases modern Vue patterns including Pinia stores, composables, lazy routed pages, and a responsive UI with light/dark theming.

## Features

- Fake authentication flow with guarded routes (demo credentials `reader` / `books`).
- Personalized, filterable library with add/edit/delete actions and status badges for *To Read*, *Reading*, and *Finished* books.
- Detail pages with cover art, metadata, and graceful fallbacks when data is loading or missing.
- Theme provider with persistent light/dark mode toggle and layout-aware components.
- Pinia stores powered by composables, mock async data fetching, and Vitest-powered unit tests.

## Tech Stack

- Vue 3 + `<script setup>` SFCs
- Vite 7 for dev server and build tooling
- TypeScript for type-safe components and stores
- Pinia for state management and session handling
- Vue Router with navigation guards for protected routes
- VueUse utilities and provide/inject theme context
- Vitest + Vue Test Utils + happy-dom for unit testing

## Getting Started

### Prerequisites

- Node.js ≥ 18.17 (recommended: latest LTS)
- npm ≥ 9 (ships with Node LTS)

### Installation

```bash
npm install
```

### Local Development

```bash
npm run dev
```

The dev server prints a local URL (default `http://localhost:5173`). Sign in with `reader` / `books` to explore the protected library views. Mock data loads after a short simulated network delay.

### Testing

```bash
npm run test
```

Use `npm run watch` for an interactive Vitest watcher during development.

### Production Build

```bash
npm run build
npm run preview
```

`npm run preview` serves the pre-built bundle locally for smoke testing.

## Project Structure

```
src/
├─ components/       # Reusable UI widgets (BookCard, StatusBanner, etc.)
├─ composables/      # Shared logic (books, theme)
├─ layouts/          # Public and private layout shells
├─ pages/            # Route-level views (Login, Books list, Book detail)
├─ providers/        # App-wide providers (theme)
├─ router/           # Routes + navigation guards
├─ stores/           # Pinia stores and unit tests
└─ types/            # Domain models and enums
```

## Demo Credentials

- Username: `reader`
- Password: `books`

You can change the seeded mock data in `src/composables/useBooks.ts`.

## Contributing

1. Fork and clone the repo.
2. Create a feature branch.
3. Add or update tests as needed (`npm run test`).
4. Submit a pull request describing your changes.

---

Built as a learning project to explore modern Vue patterns and ergonomics.
