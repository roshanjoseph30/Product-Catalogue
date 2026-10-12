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
          <p>Quantity: {{ item.quantity }}</p>

          <button class="removebutton" @click="cartStore.removeFromCart(item.product.id)">
            Remove
          </button>
        </article>
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
  background: black;
  color: white;
  padding: 10px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
}

</style>