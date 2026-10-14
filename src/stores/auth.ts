import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
 
  const isLoggedIn = useCookie<boolean>('demo-auth-logged-in', {
    default: () => false,
  })

  function login(email: string, password: string): boolean {
    if (
      email === 'rj@gmail.com' &&
      password === '123'
    ) {
      isLoggedIn.value = true
      return true
    }

    return false
  }

  function logout() {
    isLoggedIn.value = false
  }

  return {
    isLoggedIn,
    login,
    logout,
  }
})