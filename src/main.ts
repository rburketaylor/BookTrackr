import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerRouterGuards } from './router/guards'
import './style.css'

const app = createApp(App)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
  console.error('Component instance:', instance)
}

const pinia = createPinia()

app.use(pinia)
app.use(router)

registerRouterGuards(router, pinia)

app.mount('#app')
