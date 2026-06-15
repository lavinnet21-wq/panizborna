<template>
  <div>
    <DynamicBackdrop />
    <SiteHeader />

    <main>
      <section class="contact-page">
        <p class="eyebrow">Contact</p>
        <h1>contact</h1>

        <div class="contact-list">
          <a v-if="settings.email" :href="`mailto:${settings.email}`">
            <span>Email</span>
            {{ settings.email }}
          </a>
          <a v-if="settings.phone" :href="`tel:${settings.phone}`">
            <span>Phone</span>
            {{ settings.phone }}
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { settings, loadSettings } = useSiteSettings();

useHead({
  title: "Contact | Paniz Borna",
});

onMounted(() => {
  loadSettings();
});
</script>
