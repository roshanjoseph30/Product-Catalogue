<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const currentStep = ref(1)
const orderPlaced = ref(false)
const errorMessage = ref('')

const shipping = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
})

const deliveryMethod = ref('standard')
const paymentMethod = ref('card')

const steps = [
  'Shipping',
  'Delivery',
  'Payment',
  'Review',
]

const totalItems = computed(() => cartStore.totalItems)
const totalPrice = computed(() => cartStore.totalPrice)

const deliveryCost = computed(() => {
  return deliveryMethod.value === 'express' ? 15 : 0
})

const grandTotal = computed(() => {
  return totalPrice.value + deliveryCost.value
})

// Validate shipping details
const validateShipping = () => {
  if (
    !shipping.value.fullName.trim() ||
    !shipping.value.email.trim() ||
    !shipping.value.phone.trim() ||
    !shipping.value.address.trim() ||
    !shipping.value.city.trim() ||
    !shipping.value.postalCode.trim()
  ) {
    errorMessage.value = 'Please fill in all shipping details.'
    return false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(shipping.value.email)) {
    errorMessage.value = 'Please enter a valid email address.'
    return false
  }

  errorMessage.value = ''
  return true
}

const nextStep = () => {
  errorMessage.value = ''

  if (currentStep.value === 1 && !validateShipping()) {
    return
  }

  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  errorMessage.value = ''

  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const placeOrder = () => {
  if (cartStore.items.length === 0) {
    errorMessage.value = 'Your cart is empty.'
    return
  }

  orderPlaced.value = true
  cartStore.clearCart()
}
</script>

<template>
  <main class="checkout-page">
    <h1>Checkout</h1>

    <section v-if="orderPlaced" class="order-success">
      <h2>Thank you for your order!</h2>

      <p>Your order has been submitted successfully.</p>

      <NuxtLink to="/" class="primary-button">
        Continue Shopping
      </NuxtLink>
    </section>

    <template v-else>
      <nav class="step-indicator" aria-label="Checkout progress">
        <div
          v-for="(step, index) in steps"
          :key="step"
          class="step"
          :class="{
            active: currentStep === index + 1,
            completed: currentStep > index + 1
          }"
        >
          <span class="step-number">
            {{ index + 1 }}
          </span>

          <span>{{ step }}</span>
        </div>
      </nav>

      <div class="checkout-layout">
        <section class="checkout-form">
          <div v-if="currentStep === 1">
            <h2>Shipping Details</h2>

            <form @submit.prevent="nextStep">
              <label for="fullName">Full Name</label>

              <input
                id="fullName"
                v-model="shipping.fullName"
                type="text"
                autocomplete="name"
                required
                placeholder="Enter your full name"
              >

              <label for="email">Email Address</label>

              <input
                id="email"
                v-model="shipping.email"
                type="email"
                autocomplete="email"
                required
                placeholder="Enter your email"
              >

              <label for="phone">Phone Number</label>

              <input
                id="phone"
                v-model="shipping.phone"
                type="tel"
                autocomplete="tel"
                required
                placeholder="Enter your phone number"
              >

              <label for="address">Street Address</label>

              <input
                id="address"
                v-model="shipping.address"
                type="text"
                autocomplete="street-address"
                required
                placeholder="Enter your address"
              >

              <div class="form-row">
                <div>
                  <label for="city">City</label>

                  <input
                    id="city"
                    v-model="shipping.city"
                    type="text"
                    autocomplete="address-level2"
                    required
                    placeholder="City"
                  >
                </div>

                <div>
                  <label for="postalCode">Postal Code</label>

                  <input
                    id="postalCode"
                    v-model="shipping.postalCode"
                    type="text"
                    autocomplete="postal-code"
                    required
                    placeholder="Postal code"
                  >
                </div>
              </div>

              <button type="submit" class="primary-button">
                Continue to Delivery
              </button>
            </form>
          </div>

          <div v-else-if="currentStep === 2">
            <h2>Choose Delivery Method</h2>

            <label class="option-card">
              <input
                v-model="deliveryMethod"
                type="radio"
                value="standard"
              >

              <span>
                <strong>Standard Delivery</strong>
                <small>Free delivery</small>
              </span>

              <strong>$0.00</strong>
            </label>

            <label class="option-card">
              <input
                v-model="deliveryMethod"
                type="radio"
                value="express"
              >

              <span>
                <strong>Express Delivery</strong>
                <small>Faster delivery</small>
              </span>

              <strong>$15.00</strong>
            </label>

            <div class="form-actions">
              <button
                type="button"
                class="secondary-button"
                @click="previousStep"
              >
                Back
              </button>

              <button
                type="button"
                class="primary-button"
                @click="nextStep"
              >
                Continue to Payment
              </button>
            </div>
          </div>

          <div v-else-if="currentStep === 3">
            <h2>Payment Method</h2>

            <label class="option-card">
              <input
                v-model="paymentMethod"
                type="radio"
                value="card"
              >

              <span>
                <strong>Credit / Debit Card</strong>
                <small>Pay using your card</small>
              </span>
            </label>

            <label class="option-card">
              <input
                v-model="paymentMethod"
                type="radio"
                value="upi"
              >

              <span>
                <strong>UPI</strong>
                <small>Pay using a UPI application</small>
              </span>
            </label>

            <label class="option-card">
              <input
                v-model="paymentMethod"
                type="radio"
                value="cod"
              >

              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
            </label>

            <div class="form-actions">
              <button
                type="button"
                class="secondary-button"
                @click="previousStep"
              >
                Back
              </button>

              <button
                type="button"
                class="primary-button"
                @click="nextStep"
              >
                Review Order
              </button>
            </div>
          </div>

          <div v-else-if="currentStep === 4">
            <h2>Review Your Order</h2>

            <div class="review-section">
              <h3>Shipping Information</h3>

              <p>{{ shipping.fullName }}</p>
              <p>{{ shipping.email }}</p>
              <p>{{ shipping.phone }}</p>

              <p>
                {{ shipping.address }},
                {{ shipping.city }},
                {{ shipping.postalCode }}
              </p>

              <button
                type="button"
                class="edit-button"
                @click="currentStep = 1"
              >
                Edit
              </button>
            </div>

            <div class="review-section">
              <h3>Delivery Method</h3>

              <p>
                {{ deliveryMethod === 'express'
                  ? 'Express Delivery'
                  : 'Standard Delivery' }}
              </p>

              <button
                type="button"
                class="edit-button"
                @click="currentStep = 2"
              >
                Edit
              </button>
            </div>

            <div class="review-section">
              <h3>Payment Method</h3>

              <p>
                {{
                  paymentMethod === 'card'
                    ? 'Credit / Debit Card'
                    : paymentMethod === 'upi'
                      ? 'UPI'
                      : 'Cash on Delivery'
                }}
              </p>

              <button
                type="button"
                class="edit-button"
                @click="currentStep = 3"
              >
                Edit
              </button>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="secondary-button"
                @click="previousStep"
              >
                Back
              </button>

              <button
                type="button"
                class="primary-button"
                @click="placeOrder"
              >
                Place Order
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="error-message" role="alert">
            {{ errorMessage }}
          </p>
        </section>
  
        <aside class="order-summary">
          <h2>Order Summary</h2>

          <div
            v-for="item in cartStore.items"
            :key="item.product.id"
            class="summary-item"
          >
            <img
              :src="item.product.thumbnail"
              :alt="item.product.title"
            >

            <div class="summary-details">
              <h3>{{ item.product.title }}</h3>

              <p>Quantity: {{ item.quantity }}</p>

              <p>
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </p>
            </div>
          </div>

          <hr>

          <p>
            Total items:
            <strong>{{ totalItems }}</strong>
          </p>

          <p>
            Subtotal:
            <strong>${{ totalPrice.toFixed(2) }}</strong>
          </p>

          <p>
            Delivery:
            <strong>${{ deliveryCost.toFixed(2) }}</strong>
          </p>

          <hr>

          <p class="grand-total">
            Total:
            <strong>${{ grandTotal.toFixed(2) }}</strong>
          </p>
        </aside>
      </div>
    </template>
  </main>
</template>

<style scoped>

.checkout-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  color: #222;
}

.checkout-page > h1 {
  margin-bottom: 30px;
  font-size: 40px;
}

.step-indicator {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 35px;
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #888;
  padding-bottom: 12px;
  border-bottom: 3px solid #ddd;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #eee;
  font-weight: 600;
}

.step.active,
.step.completed {
  color: #111;
  border-color: #111;
}

.step.active .step-number,
.step.completed .step-number {
  background: #111;
  color: white;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  align-items: start;
  gap: 30px;
}

.checkout-form,
.order-summary {
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.checkout-form h2,
.order-summary h2 {
  margin-bottom: 25px;
}

.checkout-form form {
  display: flex;
  flex-direction: column;
}

.checkout-form form > label {
  margin-bottom: 8px;
  font-weight: 600;
}

.checkout-form input:not([type="radio"]) {
  width: 100%;
  padding: 12px;
  margin-bottom: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font: inherit;
  box-sizing: border-box;
}

.checkout-form input:focus {
  outline: 2px solid #777;
  outline-offset: 1px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-row label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.primary-button {
  background: #111;
  color: white;
}

.secondary-button {
  background: #eee;
  color: #111;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
}

.option-card input {
  accent-color: #111;
}

.option-card span {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
}

.option-card small {
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 25px;
}

.review-section {
  position: relative;
  padding: 18px 0;
  border-bottom: 1px solid #ddd;
}

.review-section h3 {
  margin-bottom: 10px;
}

.review-section p {
  margin: 6px 0;
  overflow-wrap: anywhere;
}

.edit-button {
  margin-top: 10px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.order-summary {
  background: #f5f0e5;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.summary-item img {
  width: 75px;
  height: 75px;
  object-fit: contain;
  border-radius: 8px;
  background: white;
}

.summary-details {
  min-width: 0;
}

.summary-details h3 {
  margin-bottom: 8px;
  font-size: 15px;
  overflow-wrap: anywhere;
}

.summary-details p {
  margin: 5px 0;
}

.order-summary > p {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin: 15px 0;
}

.grand-total {
  font-size: 20px;
}

.error-message {
  margin-top: 20px;
  color: #c00;
}

.order-success {
  padding: 60px 20px;
  text-align: center;
}

.order-success h2 {
  margin-bottom: 15px;
}

.order-success p {
  margin-bottom: 25px;
}

@media (max-width: 425px) {
  .checkout-page h1{
    text-align: center;
  }
  .checkout-layout {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 30px;
  }

  .step-indicator {
    display: flex;
    justify-content: center;
  }

  .step {
    display: none;
  }

  .step.active {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 3px solid #111;
  }
  .form-actions {
    flex-direction: column;
    }
}

</style>