<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useDebounce } from '~/composables/useDebounce'

const cartStore = useCartStore()
import userLogo from '~/assets/images/user.png'
import cart from '~/assets/images/cart.png'

interface Product {
  id: number
  title: string
  category: string
  thumbnail: string
}

interface Category {
  slug: string
  name: string
  url: string
}

const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 500)
const selectedCategory = ref('')
const productStore = useProductStore()

const categories = computed(() => productStore.categories)
const products = computed(() => productStore.products)

const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)

const currentIndex = ref(0)

let carouselInterval: ReturnType<typeof setInterval> | undefined

const featuredProducts = computed(() => {
  return products.value.slice(95, 100)
})

const nextSlide = () => {
  if (!featuredProducts.value.length) return

  currentIndex.value =
    (currentIndex.value + 1) % featuredProducts.value.length
}

const previousSlide = () => {
  if (!featuredProducts.value.length) return

  currentIndex.value =
    (currentIndex.value - 1 + featuredProducts.value.length) %
    featuredProducts.value.length
}


const startCarousel = () => {
  carouselInterval = setInterval(nextSlide, 3000)
}
const filteredProducts = computed(() => {
  let result = products.value

  // Filter products by search text
  if (debouncedSearchQuery.value.trim()) {
    result = result.filter(product =>
      product.title
        .toLowerCase()
        .includes(debouncedSearchQuery.value.trim().toLowerCase())
    )
  }

  return result
})
watch(selectedCategory, (newCategory) => {
  if (newCategory) {
    navigateTo(`/categories/${newCategory}`)
  }
})

onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    productStore.fetchCategories()
  ])

  startCarousel()
})

onUnmounted(() => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
  }
})
</script>

<template>
  <main>
    
    <header class="header">
      <a href="/">
        <h1>Store</h1>
      </a>

      <div class="user-cart">
        <img :src="userLogo" alt="User" class="logo">

        <NuxtLink
          to="/cart"
          class="cart-button"
          aria-label="View shopping cart"
        >
          <img :src="cart" alt="cartlogo" class="cart-logo">
          
          <span
                v-if="cartStore.totalItems > 0"
                class="cart-count"
                >
                {{ cartStore.totalItems }}
          </span>
        </NuxtLink>
      </div>
    </header>

    
    <section class="carousel" aria-label="Featured products">
      <button
        class="carousel-button previous"
        type="button"
        aria-label="Previous product"
        @click="previousSlide"
      >
        &#10094;
      </button>

      <div class="carousel-content">
        <span class="featured-badge">Featured</span>
        <template v-if="featuredProducts.length">
          <div class="carousel-image-wrapper">
            <img
              :src="featuredProducts[currentIndex].thumbnail"
              :alt="featuredProducts[currentIndex].title"
              class="carousel-image"
            >
          </div>

          <div class="carousel-details">
            <h2>{{ featuredProducts[currentIndex].title }}</h2>
            <p>{{ featuredProducts[currentIndex].category }}</p>
            
            <NuxtLink
            :to="`/products/${featuredProducts[currentIndex].id}`"
            class="view-details-button"
            >
            <button class="view-details-button">
              View Details
            </button>
          </NuxtLink>
          </div>
        </template>

        <p v-else>Loading products...</p>
      </div>

      <button
        class="carousel-button next"
        type="button"
        aria-label="Next product"
        @click="nextSlide"
      >
        &#10095;
      </button>
    </section>

    <section class="filters" aria-label="Product search and filters">
      <label class="search-box">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search products"
          aria-label="Search products"
        >
      </label>

      <label class="category-filter">
        <select
          v-model="selectedCategory"
          class="category-select"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>

          <option
            v-for="category in categories"
            :key="category.slug"
            :value="category.slug"
          >
            {{ category.name }}
          </option>
        </select>
      </label>
    </section>
    <section v-if="searchQuery.trim()" class="search-results">
      <h2>Search Results</h2>

      <div v-if="filteredProducts.length" class="products">
        <NuxtLink
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/products/${product.id}`"
          class="product-card"
        >
          <img :src="product.thumbnail" :alt="product.title">
          <h3>{{ product.title }}</h3>
          <p>{{ product.category }}</p>
        </NuxtLink>
      </div>

      <p v-else>No products found.</p>
    </section>

    
    <section class="category-section">
      <div class="header">
        <h2>Categories</h2>
      </div>

      <div class="categories">
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="`/categories/${category.slug}`"
          class="category-card"
        >
          {{ category.name }}
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  margin: 0;
  color: black;
  font-size: 80px;
  text-decoration: none;
}

.header a {
  text-decoration: none;
  color: inherit;
}

.header h2 {
  font-size: 30px;
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.user-cart {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-right: 20px;
  padding: 20px;
}

.cart-button {
  display: block;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
}

.cart-button:hover {
  cursor: pointer;
}

.cart-button img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}
.cart-count {
  position: absolute;
  top: 60px;
  right:70px;
  background-color: black;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 350px;
  margin-bottom: 50px;
  padding: 30px;
  border-radius: 20px;
  background-color: #f5f0e5;
}
.carousel-content {
  display: grid;
  grid-template-columns: 250px minmax(0, 350px);
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  min-height: 300px;
}

.carousel-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 250px;
}

.carousel-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: fade-in 0.4s ease;
}

.carousel-details {
  width: 100%;
  max-width: 350px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.carousel-details h2 {
  font-size: 24px;
  margin: 0 0 12px;
  min-height: 58px;
}

.carousel-details p {
  color: #575757;
  text-transform: capitalize;
  margin: 0 0 16px;
}

.featured-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #333;
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.carousel-button {
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background-color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;
}
.view-details-button {
  background: black;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.carousel-button:hover {
  background-color: #e0e0e0;
}

.filters {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 50px;
}

.search-box,
.category-filter {
  flex: 1;
  min-width: 0;
}

.search-box input,
.category-select {
  box-sizing: border-box;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.search-box input:focus,
.category-select:focus {
  outline: 2px solid #777;
  outline-offset: 2px;
}

.category-section {
  margin-bottom: 50px;
}

.categories {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 20px;
}

.category-card {
  display: block;
  padding: 18px 12px;
  background-color: #f5f0e5;
  border-radius: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  color: #333;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  text-transform: capitalize;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.category-card:hover {
  background-color: rgba(181, 175, 175, 0.5);
  transform: translateY(-3px);
  color: #000;
}

.category-card:visited {
  color: #333;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.product-card {
  color: black;
  text-decoration: none;
}


@media (max-width: 425px) {
  .header {
    flex-direction: column;
    align-items: center;
  }

  .header h1 {
    font-size: 40px;
  }

  .header h2 {
    font-size: 20px;
  }

  .logo {
    width: 30px;
    height: 30px;
  }
  .cart-count {
    top: 95px;
    right:160px;
  
  }

  .categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .featured-badge {
    padding: 5px 10px;
    font-size: 12px;
  }

  .carousel {
    padding: 20px 10px;
  }

  .carousel-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

  .carousel-image-wrapper {
    width: 220px;
    height: 220px;
    margin: 0 auto;
  }

  .carousel-details {
    width: 100%;
    max-width: 280px;
    min-height: 130px;
    margin: 0 auto;
    align-items: center;
    text-align: center;
  }

  .carousel-details h2 {
    min-height: 48px;
    font-size: 20px;
  }

  .carousel-details p {
    margin-bottom: 12px;
  }

  .carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    z-index: 1;
  }

  .carousel-button.previous {
    left: 10px;
  }

  .carousel-button.next {
    right: 10px;
  }

  .filters {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

}
@media (max-width: 375px) {
  .cart-count {
    right:135px;
  }
}

@media (max-width: 320px) {
  .cart-count {
    top: 100px;
    right:110px;
  }
}

</style>