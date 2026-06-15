import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  srcDir: "app/",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  routeRules: {
    "/admin": { ssr: false },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabasePublishableKey: process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  },
});
