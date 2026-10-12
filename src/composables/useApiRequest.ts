export const useApiRequest = <T>() => {
    const data = ref<T | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    const execute = async (request: () => Promise<T>) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await request()
  
        data.value = response
  
        return response
      } catch (err) {
        error.value =
          err instanceof Error
            ? err.message
            : 'Something went wrong'
  
        return null
      } finally {
        loading.value = false
      }
    }
  
    const reset = () => {
      data.value = null
      loading.value = false
      error.value = null
    }
  
    return {
      data,
      loading,
      error,
      execute,
      reset,
    }
  }