<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'
import cart from '~/assets/images/cart.png'


const cartStore = useCartStore()

const isCartOpen = ref(false)



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
    () => $fetch<Product>(
        `https://dummyjson.com/products/${productId.value}`
    ),
    {
        watch: [productId]
    }
)

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value)
  }
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

                <p class="stock">
                    {{ product.stock > 0
                        ? `Stock: ${product.stock} `
                        : 'Out of stock'
                    }}
                </p>

                <button
                    type="button" @click="addToCart(product)"
                    class="add-to-cart"
                    :disabled="product.stock <= 0"
                >
                    Add to Cart
                </button>

            </div>

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
    position: fixed;
    right: 80px;
    top: 60px;
}
.cart-button {
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
    position: fixed;
    top: 50px;
    right:70px;
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


</style>