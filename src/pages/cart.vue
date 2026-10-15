<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useProductStore } from '~/stores/product'

const cartStore = useCartStore()
const productStore = useProductStore()

const isMounted = ref(false)
const { t } = useI18n()
onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <main class="cart-page">
    <h1>{{ t('shoppingCart') }}</h1>

    <div v-if="!isMounted" class="cart-loading">
      {{ t('loadingCart') }}
    </div>

    <div v-else-if="cartStore.items.length === 0" class="empty-cart">
      <h3 >{{ t('yourCartIsEmpty') }}</h3>

      <button class="continue-shopping-button">
                <NuxtLink to="/">
                {{ t('continueShopping') }}
                </NuxtLink>
      </button>
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

            <p>{{ t('price') }}: ${{ item.product.price.toFixed(2) }}</p>

            <div class="quantity-control">
              <span>{{ t('quantity') }}:</span>

              <button
                type="button"
                @click="cartStore.decreaseQuantity(item.product.id)"
                :disabled="item.quantity <= 1"
                aria-label="Decrease quantity"
              >
                -
              </button>

              <span class="quantity">{{ item.quantity }}</span>

              <button
                type="button"
                @click="cartStore.increaseQuantity(item.product.id)"
                :disabled="(productStore.stockById[item.product.id] ?? item.product.stock ?? 0) <= 0"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <p>
              {{ t('subtotal') }}:
              ${{ (item.product.price * item.quantity).toFixed(2) }}
            </p>

            <button class="remove-button"
              type="button"
              @click="cartStore.removeFromCart(item.product.id)"
            >
              {{ t('remove') }}
            </button>
          </div>
        </article>
      </section>

      <aside class="cart-summary">
        <h2>{{ t('orderSummary') }}</h2>

        <p>
          {{ t('totalItems') }}: {{ cartStore.totalItems }}
        </p>

        <p>
          {{ t('totalPrice') }}: ${{ cartStore.totalPrice.toFixed(2) }}
        </p>
        <div class="checkout">
            <button class="continue-shopping-button">
                <NuxtLink to="/">
                {{ t('continueShopping') }}
                </NuxtLink>
            </button>
        <button class="checkout-button">
          <NuxtLink to="/checkout">
            {{ t('checkout') }}
          </NuxtLink>
        </button>
        </div>
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

.cart-page h1 {
  font-size: 40px;
  margin-bottom: 30px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.checkout {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 50px;
}
.continue-shopping-button a {
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
}
.continue-shopping-button {
    background: black;
  color: white;
  padding: 10px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;

}
.checkout-button  a {
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
} 
.checkout-button {
  background: black;
  color: white;
  padding: 10px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}
.cart-summary h2 {
  margin-bottom: 20px;
}

.cart-summary p {
  margin-bottom: 15px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}

.quantity-control button {
  border: none;
  border-radius: 20px;
  background: #333;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.quantity-control button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.quantity {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
}
@media (max-width: 425px) {
  .cart-page h1{
    text-align: center;
  }
  .cart-item {
    flex-direction: column;
  }
  .remove-button {
    margin-top: 10px;
    width: 100%;
  } 

  .cart-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .checkout{
    margin-top: 20px;
    flex-direction: column;
  }
  .checkout-button {
    width: 100%;
  }
  .checkout a {
    font-size: 12px;
  }

  .continue-shopping-button {
    width: 100%;
  }
  .continue-shopping-button a {
    font-size: 12px;
  }

  

}
</style>