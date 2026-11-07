<template>
  <main class="web-page">
    <header class="site-header">
      <h1>{{ page.title }}</h1>
    </header>

    <article class="page-content">
  <ContentRenderer
    v-for="(block, index) in page.content"
    :key="index"
    :block="block"
  />
</article>
  </main>
</template>

<script setup>
import ContentRenderer from '../components/ContentRenderer.vue'
defineProps({
  page: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.web-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 30px;
}

.site-header {
  margin-bottom: 40px;
}

.page-content {
  line-height: 1.8;
}

.page-content p {
  margin: 0 0 24px;
}

.page-content blockquote {
  margin: 30px 0;
  padding-left: 20px;
  border-left: 3px solid #999;
  color: #666;
}

.page-content a {
  display: inline-block;
  margin-top: 20px;
}
</style>