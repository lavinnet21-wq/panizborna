<template>
  <div class="dynamic-backdrop" aria-hidden="true" />
</template>

<script setup lang="ts">
const { artworks, loadArtworks } = useArtworks();
const { buildPalette, fallbackPalette } = useArtworkPalette();

function applyPalette(colors: string[]) {
  const palette = [...colors, ...fallbackPalette].slice(0, 4);
  const root = document.documentElement;

  palette.forEach((color, index) => {
    root.style.setProperty(`--wash-${index + 1}`, color);
  });
}

async function updatePalette() {
  const recentImages = [...artworks.value]
    .sort((a, b) => Number(b.year) - Number(a.year))
    .flatMap((artwork) => [artwork.image, ...(artwork.images || [])]);

  applyPalette(await buildPalette(recentImages));
}

onMounted(async () => {
  loadArtworks();
  await updatePalette();
});

watch(
  artworks,
  async () => {
    await updatePalette();
  },
  { deep: true },
);
</script>
