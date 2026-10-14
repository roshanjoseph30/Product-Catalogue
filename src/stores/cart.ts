import { defineStore } from 'pinia'
import { useProductStore } from '~/stores/product'

interface Product {
  id: number
  title: string
  price: number
  thumbnail: string
  stock?: number
}

interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  persist: true,

  getters: {
    totalItems: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      )
  },

  actions: {
    addToCart(product: Product) {
      const productStore = useProductStore()

      if (
        productStore.stockById[product.id] === undefined &&
        product.stock != null
      ) {
        productStore.stockById[product.id] = product.stock
      }

      const stock = productStore.stockById[product.id] ?? product.stock ?? 0

      if (stock <= 0) return

      const existingItem = this.items.find(
        item => item.product.id === product.id
      )

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          product,
          quantity: 1
        })
      }

      productStore.updateStock(product.id, -1)
    },

    increaseQuantity(productId: number) {
      const productStore = useProductStore()

      const item = this.items.find(
        item => item.product.id === productId
      )

      if (!item) return

      if (
        productStore.stockById[productId] === undefined &&
        item.product.stock != null
      ) {
        productStore.stockById[productId] = item.product.stock
      }

      const stock = productStore.stockById[productId] ?? item.product.stock

      if (stock === undefined || stock <= 0) return

      item.quantity++
      productStore.updateStock(productId, -1)
    },

    decreaseQuantity(productId: number) {
      const productStore = useProductStore()

      const item = this.items.find(
        item => item.product.id === productId
      )

      if (!item || item.quantity <= 1) return

      item.quantity--
      productStore.updateStock(productId, 1)
    },

    removeFromCart(productId: number) {
      const productStore = useProductStore()

      const item = this.items.find(
        item => item.product.id === productId
      )

      if (!item) return

      productStore.updateStock(productId, item.quantity)

      this.items = this.items.filter(
        item => item.product.id !== productId
      )
    },

    clearCart() {
      this.items = []
    }
  }
})