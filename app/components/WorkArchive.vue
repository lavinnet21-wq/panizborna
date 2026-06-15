<template>
  <div class="works-archive">
    <article v-for="group in artworksByYear" :key="group.year" class="year-block">
      <div class="year-label">{{ group.year }}</div>
      <div class="work-list">
        <NuxtLink
          v-for="artwork in group.items"
          :key="artwork.id"
          class="work-item"
          :to="`/works/${artwork.id}`"
          :aria-label="artwork.title"
        >
          <span class="work-title">{{ artwork.title }}</span>
          <span class="work-meta">{{ artwork.medium }}</span>
          <span class="work-link">{{ artwork.status || "view" }}</span>
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const { artworksByYear, loadArtworks } = useArtworks();

onMounted(() => {
  loadArtworks();
});
</script>
