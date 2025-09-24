Vue.js Practice Project – “BookTrackr”

A small web app to track books you want to read, are reading, or have finished.

1. Core Setup

Stack: Vue 3 + Vite + Pinia + Vue Router + Vitest/Jest

Requirements:

Use <script setup> syntax.

Organize components into components/, pages/, stores/, composables/.

2. Features to Implement
🔑 Authentication (Fake)

A login page (/login) with username/password.

Store session info in Pinia (no real backend, mock a delay).

Redirect unauthorized users to login.

📚 Book Management

Pages:

/books → list all books.

/books/:id → detail view of a single book.

Components:

BookCard.vue (displays book info with props + emits for actions).

BookForm.vue (create/edit book).

Functionality:

Add, edit, delete books.

Change book status (to read, reading, finished).

Filter by status (computed properties).

🧩 State & API

Use Pinia store for global state:

books array.

user object.

Create a composable (useBooks.ts) that handles fetching mock data (setTimeout or fetch from a fake API like JSONPlaceholder).

🚦 Routing & Guards

Use Vue Router with:

Public routes (/login).

Protected routes (/books, /books/:id).

Add a navigation guard that checks if the user is logged in.

🎨 UI Enhancements

Show book cover images (static assets).

Dynamic classes for status badges (reading = yellow, finished = green, etc.).

Use v-if vs v-show strategically for performance.

3. Advanced Tasks

Provide/Inject: Pass theme (light/dark mode) to deeply nested components.

Async Suspense: Lazy-load the book detail component and show a skeleton loader.

Error Handling: Show error message if fetching fails.

4. Testing

Write tests with Vue Test Utils + Vitest:

BookCard renders props correctly.

Clicking “delete” emits an event.

Store actions update state correctly.

Route guard redirects unauthorized users.

5. Performance / Optimization

Split code into chunks with defineAsyncComponent for /books/:id.

Add a computed property to memoize filtered book lists.

Optional: implement a virtualized list if you mock 1,000+ books.

6. Stretch Goals (for extra proficiency)

Add drag-and-drop reordering (using vueuse/gesture).

Add i18n (English/German toggle).

Add unit + snapshot test for the router navigation.
