<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import StatusBanner from '@/components/ui/StatusBanner.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { status, error, isAuthenticated } = storeToRefs(auth)

const router = useRouter()
const route = useRoute()

const form = reactive({
  username: '',
  password: '',
})

const fieldErrors = reactive({
  username: '',
  password: '',
})

const formError = ref<string | null>(null)

const redirectTarget = computed(() => {
  const value = route.query.redirect
  return typeof value === 'string' && value.startsWith('/') ? value : '/books'
})

const isSubmitting = computed(() => status.value === 'pending')
const showRedirectNotice = computed(() => typeof route.query.redirect === 'string')

const MAX_INPUT_LENGTH = 60

watchEffect(() => {
  if (isAuthenticated.value && router.currentRoute.value.path === '/login') {
    router.replace(redirectTarget.value)
  }
})

watch(
  () => error.value,
  (value) => {
    if (value) {
      formError.value = value
    }
  }
)

watch(
  () => [form.username, form.password],
  () => {
    if (formError.value) {
      formError.value = null
      auth.clearError()
    }
  }
)

function sanitize(value: string) {
  return value.trim().replace(/\s{2,}/g, ' ')
}

function validateField(field: keyof typeof form) {
  const value = sanitize(form[field])
  form[field] = value
  if (!value) {
    fieldErrors[field] = field === 'username' ? 'Username is required.' : 'Password is required.'
    return false
  }

  if (value.length > MAX_INPUT_LENGTH) {
    fieldErrors[field] = 'Keep it under 60 characters.'
    return false
  }

  fieldErrors[field] = ''
  return true
}

function validateForm() {
  const userOk = validateField('username')
  const passOk = validateField('password')
  return userOk && passOk
}

async function handleSubmit() {
  formError.value = null

  if (!validateForm()) {
    return
  }

  try {
    await auth.login({
      username: sanitize(form.username),
      password: sanitize(form.password),
    })
    form.password = ''
    await router.push(redirectTarget.value)
  } catch (err) {
    form.password = ''
    formError.value = 'Invalid username or password.'
  }
}

function handleBlur(field: keyof typeof form) {
  if (fieldErrors[field]) {
    return
  }
  validateField(field)
}
</script>

<template>
  <PublicLayout>
    <form class="login-form" @submit.prevent="handleSubmit" novalidate autocomplete="on">
      <header class="login-form__header">
        <h1 class="login-form__title">Welcome back</h1>
        <p class="login-form__subtitle">Sign in to manage your reading list.</p>
      </header>

      <StatusBanner v-if="showRedirectNotice" class="login-form__notice" type="info">
        Please sign in to view that page.
      </StatusBanner>
      <StatusBanner v-if="formError" type="error">
        {{ formError }}
      </StatusBanner>

      <div class="login-form__field">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="form.username"
          name="username"
          type="text"
          inputmode="text"
          autocomplete="username"
          :aria-invalid="Boolean(fieldErrors.username)"
          :aria-describedby="fieldErrors.username ? 'username-error' : undefined"
          @blur="handleBlur('username')"
          placeholder="reader"
        />
        <small v-if="fieldErrors.username" :id="'username-error'" class="login-form__field-error">
          {{ fieldErrors.username }}
        </small>
      </div>

      <div class="login-form__field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          autocomplete="current-password"
          :aria-invalid="Boolean(fieldErrors.password)"
          :aria-describedby="fieldErrors.password ? 'password-error' : undefined"
          @blur="handleBlur('password')"
          placeholder="••••••"
        />
        <small v-if="fieldErrors.password" :id="'password-error'" class="login-form__field-error">
          {{ fieldErrors.password }}
        </small>
      </div>

      <button type="submit" class="login-form__submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="login-form__spinner" aria-hidden="true"></span>
        {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
      </button>

      <footer class="login-form__footer">
        <p>Use <strong>reader</strong> / <strong>books</strong> to explore the demo.</p>
      </footer>
    </form>
  </PublicLayout>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-form__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.login-form__title {
  margin: 0;
  font-size: 1.75rem;
}

.login-form__subtitle {
  margin: 0;
  color: var(--color-muted);
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.login-form__field label {
  font-weight: 600;
}

.login-form__field input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  font: inherit;
  background: var(--color-surface-muted);
  color: inherit;
}

.login-form__field input:focus {
  outline: 3px solid rgba(68, 100, 219, 0.35);
  border-color: var(--color-primary);
}

.login-form__field-error {
  color: #dc2626;
}

.login-form__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.9rem 1.75rem;
  border-radius: 0.75rem;
  border: none;
  font-weight: 600;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-form__submit:disabled {
  opacity: 0.6;
  cursor: progress;
}

.login-form__submit:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px -16px rgba(68, 100, 219, 0.8);
}

.login-form__spinner {
  width: 1rem;
  height: 1rem;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-left-color: white;
  border-radius: 9999px;
  animation: spin 0.8s linear infinite;
}

.login-form__footer {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-muted);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
