import { defineStore } from 'pinia'

interface Product {
  id: number
  title: string
  category: string
  thumbnail: string
}

interface Category {
  slug: string
  name: string
  url: string
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ products: Product[] }>(
        'https://dummyjson.com/products?limit=100'
      )

      products.value = response.products
    } catch {
      error.value = 'Failed to fetch products.'
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    error.value = null

    try {
      categories.value = await $fetch<Category[]>(
        'https://dummyjson.com/products/categories'
      )
    } catch {
      error.value = 'Failed to fetch categories.'
    }
  }

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
  }
})