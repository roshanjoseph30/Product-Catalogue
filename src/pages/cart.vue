<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>

<template>
  <main class="cart-page">
    <h1>Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>

      <NuxtLink to="/">
        Continue Shopping
      </NuxtLink>
    </div>

    <div v-else class="cart-content">
      <section class="cart-items">
        <article
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="cart-item"
        >
          <img
            :src="item.product.thumbnail"
            :alt="item.product.title"
            class="product-image"
          >

          <div class="product-details">
            <h2>{{ item.product.title }}</h2>

            <p>Price: ${{ item.product.price.toFixed(2) }}</p>

            <p>Quantity: {{ item.quantity }}</p>

            <p>
              Subtotal:
              ${{ (item.product.price * item.quantity).toFixed(2) }}
            </p>

            <button
              type="button"
              @click="cartStore.removeFromCart(item.product.id)"
            >
              Remove
            </button>
          </div>
        </article>
      </section>

      <aside class="cart-summary">
        <h2>Order Summary</h2>

        <p>
          Total items: {{ cartStore.totalItems }}
        </p>

        <p>
          Total price: ${{ cartStore.totalPrice.toFixed(2) }}
        </p>

        <NuxtLink to="/">
          Continue Shopping
        </NuxtLink>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

.cart-page > h1 {
  font-size: 40px;
  margin-bottom: 30px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.product-details {
  flex: 1;
}

.product-details h2 {
  font-size: 20px;
  margin-bottom: 12px;
}

.product-details p {
  margin: 8px 0;
}

.product-details button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #333;
  color: white;
  cursor: pointer;
}

.cart-summary {
  padding: 25px;
  border-radius: 16px;
  background: #f5f0e5;
}

.cart-summary h2 {
  margin-bottom: 20px;
}

.cart-summary p {
  margin-bottom: 15px;
}

</style>