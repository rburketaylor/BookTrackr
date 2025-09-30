import type { Pinia } from 'pinia'
import type { NavigationGuard, Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function registerRouterGuards(router: Router, pinia: Pinia) {
  const redirectUnauthenticated: NavigationGuard = (to) => {
    const auth = useAuthStore(pinia)
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !auth.isAuthenticated) {
      return {
        path: '/login',
        query: to.fullPath ? { redirect: to.fullPath } : undefined,
      }
    }

    if (to.path === '/login' && auth.isAuthenticated) {
      return { path: '/books' }
    }

    return true
  }

  router.beforeEach(redirectUnauthenticated)
}
