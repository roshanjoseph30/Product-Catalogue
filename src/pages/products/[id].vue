<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'
import cart from '~/assets/images/cart.png'

const showCartNotification = ref(false)
let notificationTimeout: ReturnType<typeof setTimeout> | undefined

const cartStore = useCartStore()

const isCartOpen = ref(false)
const productStore = useProductStore()


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

// Get the product ID from the URL
const productId = computed(() => String(route.params.id))

// Fetch the selected product


const {
  data: product,
  status,
  error
} = await useAsyncData(
  () => `product-${productId.value}`,
  async () => {
    const fetchedProduct = await $fetch<Product>(
      `https://dummyjson.com/products/${productId.value}`
    )

    fetchedProduct.stock = productStore.getStock(fetchedProduct)

    return fetchedProduct
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

const addToCart = () => {
  if (!product.value || product.value.stock <= 0) return

  productStore.updateStock(product.value.id, -1)
  product.value.stock--

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

        <!-- Back to store -->
        <NuxtLink to="/" class="back-link">
            &larr; Back to Store
        </NuxtLink>

        <div class="cart">
            <button
                type="button"
                class="cart-button"
                aria-label="Open shopping cart"
                :aria-expanded="isCartOpen"
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
      

        <!-- Loading -->
        <p v-if="status === 'pending'" role="status">
            Loading product...
        </p>

        <!-- Error -->
        <p v-else-if="error" role="alert">
            Unable to load the product. Please try again.
        </p>

        <!-- Product details -->
        <section v-else-if="product" class="product-detail">

            <!-- Product image -->
            <div class="product-image">
                <img
                    :src="product.thumbnail"
                    :alt="product.title"
                />
            </div>

            <!-- Product information -->
            <div class="product-info">

                <p class="category">
                    {{ product.category }}
                </p>

                <h1>{{ product.title }}</h1>

                <p class="brand" v-if="product.brand">
                    Brand: {{ product.brand }}
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
                    Stock available: {{ product?.stock ?? 0 }}
                </p>

                <button
                    type="button" @click="addToCart(product)"
                    class="add-to-cart"
                    :disabled="product.stock <= 0"
                >
                    Add to Cart
                </button>
                <div
                    v-if="showCartNotification"
                    class="cart-notification"
                    role="status"
                    aria-live="polite"
                    >
                    <span class="notification-icon">✓</span>

                    <div class="notification-message">
                        <strong>Added to cart!</strong>
                        <p>{{ product?.title }}</p>
                    </div>
                </div>

            </div>

        </section>

        <!-- Related Products -->
        <section class="related-products">
            <h2>Related Products</h2>

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

            <p v-else>No related products found.</p>
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