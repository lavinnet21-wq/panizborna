<template>
  <footer class="site-footer" id="contact">
    <span>Paniz Borna</span>
    <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
    <NuxtLink to="/contact">contact</NuxtLink>
    <a href="#top">up</a>
  </footer>
</template>

<script setup lang="ts">
const { settings, loadSettings } = useSiteSettings();

onMounted(() => {
  loadSettings();
});
</script>
