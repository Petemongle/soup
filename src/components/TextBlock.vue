<template>
  <p class="text-block">
    {{ value }}
  </p>
</template>

<script setup>
defineProps({
  value: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.text-block {
  margin: 0 0 24px;
  line-height: 1.8;
}
</style>