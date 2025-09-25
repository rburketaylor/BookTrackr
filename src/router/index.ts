import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/books',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/books',
    name: 'books.list',
    component: () => import('@/pages/BooksListPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/books/:id',
    name: 'books.detail',
    component: () => import('@/pages/BookDetailPage.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
