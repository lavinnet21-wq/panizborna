<template>
  <div>
    <DynamicBackdrop />
    <SiteHeader />

    <main>
      <section class="year-gallery-page">
        <NuxtLink class="back-link" to="/works">Back to works</NuxtLink>
        <div class="year-gallery-heading">
          <p class="eyebrow">Works from</p>
          <h1>{{ year }}</h1>
        </div>

        <div class="year-gallery-grid">
          <NuxtLink
            v-for="artwork in yearArtworks"
            :key="artwork.id"
            class="year-gallery-card"
            :to="`/works/${artwork.id}`"
          >
            <div class="year-gallery-image">
              <img v-if="artwork.image" :src="artwork.image" :alt="artwork.title" />
              <span v-else>{{ artwork.title }}</span>
            </div>
            <div>
              <h2>{{ artwork.title }}</h2>
              <p>{{ artwork.medium }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { artworks, loadArtworks } = useArtworks();
const year = computed(() => String(route.params.year));

const yearArtworks = computed(() => {
  return artworks.value.filter((artwork) => artwork.year === year.value);
});

useHead(() => ({
  title: `${year.value} Works | Paniz Borna`,
}));

onMounted(() => {
  loadArtworks();
});
</script>
