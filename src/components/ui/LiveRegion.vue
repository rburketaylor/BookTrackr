<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  politeness?: 'polite' | 'assertive'
}>()

const displayMessage = ref('')

// Only update the live region when the message changes
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      displayMessage.value = newMessage
      // Clear after announcement to allow re-announcement of same message
      setTimeout(() => {
        displayMessage.value = ''
      }, 1000)
    }
  }
)
</script>

<template>
  <div
    :aria-live="politeness || 'polite'"
    aria-atomic="true"
    class="visually-hidden"
    role="status"
  >
    {{ displayMessage }}
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>