<template>
  <component
    :is="componentMap[block.type]"
    v-bind="block"
  />
</template>

<script setup>
import TextBlock from './TextBlock.vue'
import QuoteBlock from './QuoteBlock.vue'
import LinkBlock from './LinkBlock.vue'
import ImageBlock from './ImageBlock.vue'

const componentMap = {
  text: TextBlock,
  quote: QuoteBlock,
  link: LinkBlock,
  image: ImageBlock
}

defineProps({
  block: {
    type: Object,
    required: true
  }
})
</script>