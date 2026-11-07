<template>
  <blockquote class="quote-block">
    {{ value }}
  </blockquote>
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
.quote-block {
  margin: 30px 0;
  padding: 16px 20px;
  border-left: 3px solid #999;
  color: #666;
  font-style: italic;
}
</style>