<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import cart from '~/assets/images/cart.png'

let notificationTimeout: ReturnType<typeof setTimeout> | undefined

const showCartNotification = ref(false)
const cartStore = useCartStore()
const isCartOpen = ref(false)
const productStore = useProductStore()
const stockHydrated = ref(false)

const { t } = useI18n()

interface Product {
    id: number
    title: string
    description: string
    category: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand?: string
    thumbnail: string
    images: string[]
}

const route = useRoute()
const productId = computed(() => String(route.params.id))

const {
  data: product,
  status,
  error
} = await useAsyncData(
  () => `product-${productId.value}`,
  async () => {
    return await $fetch<Product>(
      `https://dummyjson.com/products/${productId.value}`
    )
  },
  {
    watch: [productId]
  }
)
const { data: relatedProducts } = await useAsyncData(
    () => `related-products-${productId.value}`,
    async () => {
        if (!product.value) return []

        const response = await $fetch<{ products: Product[] }>(
            `https://dummyjson.com/products/category/${product.value.category}`
        )
        return response.products
            .filter(item => item.id !== product.value!.id)
            .slice(0, 4)
    },
    {
        watch: [product]
    }
)

onMounted(() => {
  if (
    product.value &&
    productStore.stockById[product.value.id] === undefined
  ) {
    productStore.stockById[product.value.id] = product.value.stock
  }
    stockHydrated.value = true
})

const availableStock = computed(() => {
  if (!product.value) return 0
  if (!stockHydrated.value) return product.value.stock
  return productStore.stockById[product.value.id] ?? product.value.stock
})

const addToCart = () => {
  if (!product.value || availableStock.value <= 0) return
  cartStore.addToCart(product.value)
  showCartNotification.value = true
  clearTimeout(notificationTimeout)

  notificationTimeout = setTimeout(() => {
    showCartNotification.value = false
  }, 2000)
}

</script>

<template>
    <main class="product-detail-page">      
        <NuxtLink to="/" class="back-link">
            &larr; {{ t('backToStore') }}
        </NuxtLink>

        <div class="cart">
        <Languageselector />
            <button
                type="button"
                class="cart-button"
                aria-label="Open shopping cart"
                :aria-expanded="isCartOpen"
                aria-controls="product-cart-sidebar"
                @click="isCartOpen = true"
            >
                <img :src="cart" alt="">
                <span
                v-if="cartStore.totalItems > 0"
                class="cart-count"
                >
                {{ cartStore.totalItems }}
                </span>
            </button>
        </div>

        <UiCartsidebar
        :is-open="isCartOpen"
        @close="isCartOpen = false"
        />
      
        <p v-if="status === 'pending'" role="status">
            {{ t('loadingProduct') }}
        </p>

   
        <p v-else-if="error" role="alert">
            Unable to load the product. Please try again.
        </p>

        <section v-else-if="product" class="product-detail">

            <div class="product-image">
                <img
                    :src="product.thumbnail"
                    :alt="product.title"
                />
            </div>

            <div class="product-info">

                <p class="category">
                    {{ product.category }}
                </p>

                <h1>{{ product.title }}</h1>

                <p class="brand" v-if="product.brand">
                    {{ t('brand') }}: {{ product.brand }}
                </p>

                <p class="rating">
                    ⭐ {{ product.rating }} / 5
                </p>

                <p class="price">
                    ${{ product.price.toFixed(2) }}
                </p>

                <p class="discount">
                    {{ product.discountPercentage }}% off
                </p>

                <p class="description">
                    {{ product.description }}
                </p>

                <p>
                    {{ t('stockAvailable') }}: {{ availableStock }}
                </p>

                <button
                    type="button" @click="addToCart"
                    class="add-to-cart"
                    :disabled="availableStock <= 0"
                >
                    {{ t('addToCart') }}
                </button>
                <div
                    v-if="showCartNotification"
                    class="cart-notification"
                    role="status"
                    >
                    <span class="notification-icon">✓</span>

                    <div class="notification-message">
                        <strong>{{ t('addedToCart') }}</strong>
                        <p>{{ product?.title }}</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="related-products">
            <h2>{{ t('relatedProducts') }}</h2>

            <div v-if="relatedProducts?.length" class="related-grid">
                <NuxtLink
                    v-for="item in relatedProducts"
                    :key="item.id"
                    :to="`/products/${item.id}`"
                    class="related-card"
                >
                    <div class="related-image">
                        <img :src="item.thumbnail" :alt="item.title">
                    </div>

                    <div class="related-info">
                        <h3>{{ item.title }}</h3>
                        <p>${{ item.price.toFixed(2) }}</p>
                    </div>
                </NuxtLink>
            </div>
            <p v-else>{{ t('noRelatedProductsFound') }}</p>
        </section>

    </main>
</template>

<style scoped>
.product-detail-page {
    padding: 30px;
}

.back-link {
    display: inline-block;
    margin-bottom: 30px;
    color: #333;
    text-decoration: none;
}

.back-link:hover {
    text-decoration: underline;
}

.cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    position: absolute;
    top: 60px;
    right: 80px;
    z-index: 100;
}

.cart-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
}

.cart img {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 101;
    background-color: black;
    color: white;
    border-radius: 50%;
    padding: 5px 10px;
}

.product-detail {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.product-image {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 450px;
    padding: 30px;
    background-color: #f5f0e5;
    border-radius: 20px;
}

.product-image img {
    width: 100%;
    height: 400px;
    object-fit: contain;
}

.product-info {
    padding: 20px 0;
}

.category {
    margin-bottom: 12px;
    color: #777;
    text-transform: capitalize;
}

.product-info h1 {
    margin-bottom: 16px;
    font-size: 32px;
}

.brand {
    margin-bottom: 12px;
    color: #575757;
}

.rating {
    margin-bottom: 20px;
}

.price {
    margin-bottom: 8px;
    font-size: 28px;
    font-weight: 700;
}

.discount {
    margin-bottom: 20px;
    color: #27834a;
}

.description {
    margin-bottom: 20px;
    color: #575757;
    line-height: 1.7;
}

.stock {
    margin-bottom: 24px;
}

.add-to-cart {
    padding: 14px 28px;
    background-color: #222;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.add-to-cart:hover:not(:disabled) {
    background-color: #444;
}

.add-to-cart:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.related-products {
    margin-top: 60px;
    margin-bottom: 40px;
}

.related-products h2 {
    margin-bottom: 20px;
    font-size: 28px;
}

.related-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 25px;
}

.related-card {
    overflow: hidden;
    border-radius: 20px;
    background-color: #f5f0e5;
    color: #333;
    text-decoration: none;
    transition: transform 0.3s ease;
}

.related-card:hover {
    transform: translateY(-5px);
}

.related-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 220px;
    padding: 15px;
    box-sizing: border-box;
}

.related-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.related-info {
    display: flex;
    flex-direction: column;
    padding: 15px;
    gap: 12px;
}

.related-info h3 {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
    height: 48px;
    overflow: hidden;
}

.related-info p {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
}

.cart-notification {
  position: fixed;
  top: 90px;
  right: 30px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 300px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;
  flex-shrink: 0;

  color: #ffffff;
  background-color: #27864a;
  border-radius: 50%;
  font-weight: bold;
}

.notification-message strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

.notification-message p {
  margin: 0;
  color: #575757;
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 768px) {
    .cart img {
        width: 30px;
        height: 30px;
        object-fit: contain;
    }
    .related-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 15px;
    }
    .related-image {
        height: 180px;
    }
}
</style>