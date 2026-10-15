<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const { t } = useI18n()
async function handleLogout() {
  authStore.logout()
  await navigateTo('/')
}
</script>

<template>
  <main class="account-page">
    <h1>{{ t('myAccount') }}</h1>
    <p>{{ t('welcomeToYourAccount') }}</p>

    <div class="account-actions">
      <button class="logout-button" @click="handleLogout">
        {{ t('logout') }}
      </button>

      <NuxtLink to="/" class="home-link">
        {{ t('goToHome') }}
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.account-page {
  padding: 40px 24px;
  text-align: center;
}

.account-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.logout-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background: #222;
  color: white;
  font: inherit;
  cursor: pointer;
}

.home-link {
  padding: 11px 24px;
  border: 1px solid #222;
  border-radius: 6px;
  color: #222;
  text-decoration: none;
}

.logout-button:hover {
  background: #444;
}

.home-link:hover {
  background: #f2f2f2;
}

@media (max-width: 480px) {
  .account-actions {
    flex-direction: column;
  }
}
</style>