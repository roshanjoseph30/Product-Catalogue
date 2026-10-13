<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const cartStore = useCartStore()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="cart-overlay"
      @click="emit('close')"
    ></div>

    <aside
      class="cart-sidebar"
      :class="{ 'cart-sidebar-open': isOpen }"
    >
      <div class="cart-header">
        <h2>Your Cart ({{ cartStore.totalItems }})</h2>

        <button type="button" class="x-button" @click="emit('close')">
          &times;
        </button>
      </div>

      <p v-if="cartStore.items.length === 0">
        Your cart is empty.
      </p>

      <div v-else class="cart-body">
        <article
          v-for="item in cartStore.items"
          :key="item.product.id"
        >
          <img :src="item.product.thumbnail" :alt="item.product.title">

          <h3>{{ item.product.title }}</h3>

          <p class="product-price">
            Price: ${{ item.product.price.toFixed(2) }}
          </p>

          <div class="quantity-control">
            <button
              type="button"
              @click="cartStore.decreaseQuantity(item.product.id)"
              :disabled="item.quantity <= 1"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span>{{ item.quantity }}</span>

            <button
              type="button"
              @click="cartStore.increaseQuantity(item.product.id)"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button class="removebutton" @click="cartStore.removeFromCart(item.product.id)">
            Remove
          </button>
        </article>
      </div>
      <div v-if="cartStore.items.length > 0" class="cart-total">
        <h3>Total Price:</h3>
        <h3>${{ cartStore.totalPrice.toFixed(2) }}</h3>
      </div>
      <div class="checkout">
        <NuxtLink
          v-if="cartStore.items.length > 0"
          to="/checkout"
          class="checkout-button"
          @click="emit('close')"
        >
          Checkout
        </NuxtLink>
      </div>
    </aside>
  </Teleport>
</template>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.45);
}

.cart-sidebar {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 201;
    width: 420px;
    max-width: 100%;
    height: 100vh;
    padding: 24px;
    box-sizing: border-box;
    background: white;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    visibility: hidden;
    transition: transform 0.3s ease, visibility 0.3s ease;
    }

.cart-sidebar-open {
  transform: translateX(0);
  visibility: visible;
}

.cart-header {
    flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.x-button {
    font-size: 30px;
    background: none;
    border: none;
    cursor: pointer;
}
.removebutton {
  background: rgb(21, 21, 21);
  color: white;
  font-weight: 600;
  width: 100%;
  padding: 5px 5px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  text-align: center;
}
.checkout {
  margin-top: 20px;
  flex-shrink: 0;
}

.checkout-button {
  display: block;
  width: 100%;
  padding: 12px 10px;
  box-sizing: border-box;
  background: black;
  border-radius: 20px;
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.checkout-button:hover {
  background: #333;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  margin-top: 15px;
  padding: 15px 0;
  border-top: 1px solid #ddd;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.quantity-control button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: black;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.quantity-control button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

</style>