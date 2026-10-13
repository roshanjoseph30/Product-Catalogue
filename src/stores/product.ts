import { defineStore } from 'pinia'

interface Product {
  id: number
  title: string
  category: string
  thumbnail: string
  stock: number
}

interface Category {
  slug: string
  name: string
  url: string
}

export const useProductStore = defineStore(
  'product',
  () => {
    const products = ref<Product[]>([])
    const categories = ref<Category[]>([])
    const stockById = ref<Record<number, number>>({})
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchProducts = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await $fetch<{ products: Product[] }>(
          'https://dummyjson.com/products?limit=100'
        )

        products.value = response.products.map(product => {
          if (stockById.value[product.id] === undefined) {
            stockById.value[product.id] = product.stock
          }
        
          return {
            ...product,
            stock: stockById.value[product.id]
          }
        })
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

    const getStock = (product: Product) => {
      if (stockById.value[product.id] === undefined) {
        stockById.value[product.id] = product.stock
      }
    
      return stockById.value[product.id]
    }
    
    const updateStock = (productId: number, change: number) => {
      const product = products.value.find(
        item => item.id === productId
      )
    
      const currentStock =
        stockById.value[productId] ?? product?.stock
    
      if (currentStock === undefined) return
    
      const newStock = currentStock + change
    
      if (newStock < 0) return
    
      stockById.value[productId] = newStock
    
      if (product) {
        product.stock = newStock
      }
    }

    return {
      products,
      categories,
      stockById,
      loading,
      error,
      fetchProducts,
      fetchCategories,
      getStock,
      updateStock,
    }
  },
  {
    persist: true,
  }
)