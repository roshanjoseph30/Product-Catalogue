import { defineStore } from 'pinia'

interface Product {
  id: number
  title: string
  price: number
  thumbnail: string
}

interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

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
    },

    removeFromCart(productId: number) {
      this.items = this.items.filter(
        item => item.product.id !== productId
      )
    }
  }
})