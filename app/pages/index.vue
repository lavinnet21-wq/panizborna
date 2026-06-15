<template>
  <div>
    <DynamicBackdrop />
    <SiteHeader />

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">{{ settings.homeSubtitle }}</p>
        <h1 id="hero-title">{{ settings.homeTitle }}</h1>
        <p class="hero-name">{{ settings.artistName }}</p>
      </section>

      <section class="intro-grid" aria-label="Portfolio introduction">
        <div class="intro-copy">
          <p>{{ settings.introText }}</p>
        </div>
        <div class="intro-image" aria-label="Ceramic work placeholder">
          <NuxtLink
            v-if="settings.introImage && settings.introArtworkId"
            class="home-image-link"
            :to="`/works/${settings.introArtworkId}`"
            aria-label="Open linked artwork"
          >
            <img :src="settings.introImage" alt="Selected ceramic work" />
          </NuxtLink>
          <img v-else-if="settings.introImage" :src="settings.introImage" alt="Selected ceramic work" />
          <span v-else>image / selected work</span>
        </div>
      </section>

      <section class="feature" aria-labelledby="feature-title">
        <div class="feature-copy">
          <p class="section-number">01</p>
          <h2 id="feature-title">{{ settings.featureTitle }}</h2>
          <p>{{ settings.featureText }}</p>
        </div>
        <div class="feature-image">
          <NuxtLink
            v-if="settings.featureImage && settings.featureArtworkId"
            class="home-image-link"
            :to="`/works/${settings.featureArtworkId}`"
            aria-label="Open linked artwork"
          >
            <img :src="settings.featureImage" alt="Artwork detail" />
          </NuxtLink>
          <img v-else-if="settings.featureImage" :src="settings.featureImage" alt="Artwork detail" />
          <span v-else>detail shot</span>
        </div>
      </section>

      <section class="about" id="about" aria-labelledby="about-title">
        <div class="section-heading">
          <p class="section-number">02</p>
          <h2 id="about-title">{{ settings.aboutHeading }}</h2>
        </div>
        <div class="about-grid">
          <div class="artist-image">
            <img v-if="settings.artistImage" :src="settings.artistImage" alt="Paniz Borna" />
            <span v-else>artist image</span>
          </div>
          <p>{{ settings.aboutText }}</p>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { settings, loadSettings } = useSiteSettings();

useHead({
  title: "Portfolio | Paniz Borna",
});

onMounted(() => {
  loadSettings();
});
</script>
