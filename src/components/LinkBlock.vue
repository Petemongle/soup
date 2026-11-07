<template>
  <a
    class="link-block"
    :href="target"
  >
    {{ text }}
  </a>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },

  target: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.link-block {
  display: inline-block;
  margin: 10px 0 24px;
}
</style>