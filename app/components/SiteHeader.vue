<template>
  <header class="site-header">
    <NuxtLink class="brand" to="/">Paniz Borna</NuxtLink>
    <nav :aria-label="admin ? 'Admin navigation' : 'Main navigation'">
      <NuxtLink v-if="admin" to="/">Site</NuxtLink>
      <template v-else>
        <NuxtLink to="/works">Works</NuxtLink>
        <NuxtLink to="/#about">About</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
      </template>
      <a v-if="admin" href="#artworks">Artworks</a>
    </nav>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  admin?: boolean;
}>();
</script>
