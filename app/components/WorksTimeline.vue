<template>
  <section class="works-page" aria-labelledby="works-page-title">
    <div class="works-page-rail">
      <span class="studio-mark">studio</span>
    </div>

    <div class="works-page-content">
      <div class="works-page-heading">
        <p class="eyebrow">Selected archive</p>
        <h1 id="works-page-title">works</h1>
      </div>

      <article v-for="group in artworksByYear" :key="group.year" class="works-timeline-year">
        <NuxtLink class="works-timeline-year-label" :to="`/works/year/${group.year}`">
          {{ group.year }}
        </NuxtLink>
        <div class="works-timeline-list">
          <NuxtLink
            v-for="(artwork, index) in group.items"
            :key="artwork.id"
            class="timeline-work"
            :to="`/works/${artwork.id}`"
          >
            <span class="timeline-dot" aria-hidden="true" />
            <span class="timeline-count">
              {{ String(index + 1).padStart(2, "0") }} /
              {{ String(group.items.length).padStart(2, "0") }}
            </span>
            <span class="timeline-title">{{ artwork.title }}</span>
            <span class="timeline-meta">{{ artwork.medium }}</span>
          </NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { artworksByYear, loadArtworks } = useArtworks();

onMounted(() => {
  loadArtworks();
});
</script>
