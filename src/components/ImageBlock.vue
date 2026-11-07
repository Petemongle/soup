<template>
  <figure class="image-block">
    <img
      :src="src"
      :alt="alt"
    />

    <figcaption v-if="caption">
      {{ caption }}
    </figcaption>
  </figure>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },

  alt: {
    type: String,
    default: ''
  },

  caption: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.image-block {
  margin: 32px 0;
}

.image-block img {
  display: block;
  max-width: 100%;
}

.image-block figcaption {
  margin-top: 8px;
  color: #777;
  font-size: 14px;
}
</style>