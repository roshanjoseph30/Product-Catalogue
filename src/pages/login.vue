<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'guest',
})

const { t } = useI18n()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  const success = await authStore.login(email.value, password.value)

  if (success) {
    await navigateTo('/account')
  } else {
    errorMessage.value = 'Invalid email or password'
  }
}
</script>

<template>
  <main class="login-page">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>{{ t('login') }}</h1>
      <p>{{ t('welcomeBack') }}</p>

      <div class="form-group">
        <label for="email">{{ t('email') }}</label>
        <input
          id="email"
          v-model="email"
          type="email"
          :placeholder="t('enterYourEmail')"
          autocomplete="email"
          required
        >
      </div>

      <div class="form-group">
        <label for="password">{{ t('password') }}</label>
        <input
          id="password"
          v-model="password"
          type="password"
          :placeholder="t('enterYourPassword')"
          autocomplete="current-password"
          required
        >
      </div>

      <p v-if="errorMessage" class="error-message" role="alert">
        {{ errorMessage }}
      </p>

      <button type="submit">{{ t('login') }}</button>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 24px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

h1 {
  margin-bottom: 8px;
}

.login-form > p {
  margin-bottom: 24px;
  color: #666;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font: inherit;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: #222;
  color: white;
  font: inherit;
  cursor: pointer;
}

.error-message {
  color: #c62828;
}
</style>