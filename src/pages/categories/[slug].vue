<script setup lang="ts">
import { computed } from 'vue'

interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  thumbnail: string
}

interface Category {
  slug: string
  name: string
  url: string
}

const route = useRoute()
const categorySlug = computed(() => String(route.params.slug))

const { data: productResponse, status, error } = await useAsyncData(
  () => `category-products-${categorySlug.value}`,
  () => $fetch<{ products: Product[] }>(
    `https://dummyjson.com/products/category/${encodeURIComponent(categorySlug.value)}`
  ),
  {
    watch: [categorySlug]
  }
)

const { data: categories } = await useAsyncData(
  'product-categories',
  () => $fetch<Category[]>('https://dummyjson.com/products/categories')
)


const categoryName = computed(() => {
  return (
    categories.value?.find(
      category => category.slug === categorySlug.value
    )?.name ?? categorySlug.value
  )
})
</script>

<template>
  <main class="category-page">
    <NuxtLink to="/" class="back-link">
      &larr; Back to Store
    </NuxtLink>

    <header class="page-header">
      <h1>{{ categoryName }}</h1>
    </header>

    <p v-if="status === 'pending'" role="status">
      Loading products...
    </p>

    <p v-else-if="error" role="alert">
      Failed to load products. Please try again.
    </p>

    <p
      v-else-if="!productResponse?.products.length"
      class="empty-message"
    >
      No products found in this category.
    </p>

    <section v-else class="product-grid">
        <NuxtLink
            v-for="product in productResponse.products"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="product-card"
        >
            <div class="product-image-container">
                <img
                    :src="product.thumbnail"
                    :alt="product.title"
                    loading="lazy"
                >
            </div>

            <div class="product-details">
                <h2>{{ product.title }}</h2>

                <p class="price">
                    ${{ product.price.toFixed(2) }}
                </p>
            </div>
        </NuxtLink>
    </section>
  </main>
</template>

<style scoped>
.category-page {
    padding: 20px;
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

.page-header {
    margin-bottom: 40px;
    text-align: center;
}

.page-header h1 {
    margin-bottom: 12px;
    font-size: 48px;
    text-transform: capitalize;
}

.page-header p {
    color: #575757;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
}

.product-card {
    display: block;
    color: inherit;
    text-decoration: none;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
}

.product-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 240px;
    padding: 16px;
    background-color: #f5f0e5;
}

.product-image-container img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.product-details {
    display: flex;
    flex-direction: column;
    margin-top: 0px;
    justify-content: space-between;
    padding: 16px;
}

.product-details h2 {
    margin-bottom: 12px;
    font-size: 18px;
}

.description {
    margin-bottom: 16px;
    color: #575757;
    font-size: 14px;
    line-height: 1.5;
}

.price {
    font-size: 20px;
    font-weight: bold;
}

.empty-message {
    text-align: center;
    padding: 40px;
}
@media (max-width: 425px) {
    .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

</style>