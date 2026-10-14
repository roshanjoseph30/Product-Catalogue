import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '../src/stores/cart'

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('calculates the total number of items', () => {
    const cartStore = useCartStore()

    cartStore.items = [
      {
        product: {
          id: 1,
          title: 'Keyboard',
          price: 50,
          thumbnail: '/keyboard.png',
          stock: 10,
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          title: 'Mouse',
          price: 25,
          thumbnail: '/mouse.png',
          stock: 10,
        },
        quantity: 3,
      },
    ]

    expect(cartStore.totalItems).toBe(5)
  })
  it('calculates the total price', () => {
    const cartStore = useCartStore()
  
    cartStore.items = [
      {
        product: {
          id: 1,
          title: 'Keyboard',
          price: 50,
          thumbnail: '/keyboard.png',
          stock: 10,
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          title: 'Mouse',
          price: 25,
          thumbnail: '/mouse.png',
          stock: 10,
        },
        quantity: 3,
      },
    ]
  
    expect(cartStore.totalPrice).toBe(175)
  })
})