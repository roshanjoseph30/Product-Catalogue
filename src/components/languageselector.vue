<script setup lang="ts">
const { locale, setLocale } = useI18n()

async function changeLanguage(event: Event) {
  const target = event.target as HTMLSelectElement
  await setLocale(target.value)
}
</script>

<template>
  <select
    :value="locale"
    @change="changeLanguage"
    class="language-select"
    aria-label="Select language"
  >
    <option value="en">English</option>
    <option value="de">Deutsch</option>
  </select>
</template>

<style scoped>
.language-select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;
}
</style>