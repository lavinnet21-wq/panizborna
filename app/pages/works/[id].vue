<template>
  <div>
    <DynamicBackdrop />
    <SiteHeader />

    <main>
      <article v-if="artwork" class="artwork-page">
        <NuxtLink class="back-link" to="/works">Back to works</NuxtLink>

        <section class="artwork-hero">
          <div>
            <p class="eyebrow">{{ artwork.year }} / {{ artwork.medium }}</p>
            <h1>{{ artwork.title }}</h1>
          </div>
          <div class="artwork-meta-panel">
            <p><span>Medium</span>{{ artwork.medium }}</p>
            <p><span>Dimensions</span>{{ artwork.dimensions || "Not specified" }}</p>
            <p><span>Status</span>{{ artwork.status || "Archive" }}</p>
          </div>
        </section>

        <section class="artwork-detail-grid">
          <div class="artwork-gallery">
            <div
              v-for="(image, index) in artworkGallery"
              :key="`${image}-${index}`"
              class="artwork-image"
            >
              <img :src="image" :alt="`${artwork.title} image ${index + 1}`" />
            </div>
            <div v-if="!artworkGallery.length" class="artwork-image">
              <span>image / {{ artwork.title }}</span>
            </div>
          </div>
          <div class="artwork-statement">
            <p class="section-number">Statement</p>
            <p>{{ artwork.description }}</p>
          </div>
        </section>
      </article>

      <section v-else class="artwork-page">
        <NuxtLink class="back-link" to="/works">Back to works</NuxtLink>
        <div class="artwork-hero">
          <div>
            <p class="eyebrow">Archive</p>
            <h1>work not found</h1>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { artworks, loadArtworks } = useArtworks();

const artwork = computed(() => {
  return artworks.value.find((item) => item.id === route.params.id);
});

const artworkGallery = computed(() => {
  if (!artwork.value) {
    return [];
  }

  return [artwork.value.image, ...(artwork.value.images || [])].filter(Boolean);
});

onMounted(() => {
  loadArtworks();
});

useHead(() => ({
  title: artwork.value ? `${artwork.value.title} | Paniz Borna` : "Work | Paniz Borna",
}));
</script>
