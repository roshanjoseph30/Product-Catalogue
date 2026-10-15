<script setup lang="ts">
const { locale, setLocale } = useI18n()

async function changeLanguage() {
  await setLocale(locale.value === 'en' ? 'de' : 'en')
}
</script>

<template>
  <div class="btn-container">
    <Transition name="slide-up">
      <button
        :key="locale"
        @click="changeLanguage"
      >
        {{ locale === 'en' ? 'Deutsch' : 'English' }}
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.btn-container {
  display: inline-block;
  position: relative;
  height: 1em;
  width: 70px;
}

button {
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  cursor: pointer;
  border: 2px solid #000;

  background-color: white;
  border-radius: 10px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>