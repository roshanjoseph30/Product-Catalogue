import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = useCookie<boolean>('demo-auth-logged-in', {
    default: () => false
  })

  async function login(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      await $fetch('/api/login', {
        method: 'POST',
        body: {
          email,
          password
        }
      })

      isLoggedIn.value = true

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  function logout() {
    isLoggedIn.value = false
  }

  return {
    isLoggedIn,
    login,
    logout
  }
})