<template>
  <div class="public-layout">
    <main class="public-layout__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.public-layout {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: var(--color-app-bg);
}

.public-layout__main {
  width: min(420px, 100%);
  padding: 3rem 2.5rem;
  background: var(--color-surface);
  border-radius: 1.25rem;
  box-shadow: 0 35px 60px -40px rgba(15, 23, 42, 0.35);
}
</style>
