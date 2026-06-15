import type { SiteSettings } from "~/types/site-settings";

const settingsKey = "paniz-portfolio-settings";

const defaultSettings: SiteSettings = {
  homeTitle: "portfolio",
  artistName: "paniz borna",
  homeSubtitle: "Ceramic sculpture / drawing / material studies",
  introText:
    "A quiet archive of ceramic sculptures, drawings, and selected material studies organized by year.",
  introImage: "",
  featureTitle: "selected study",
  featureText:
    "Forms are collected as fragments: bodies, vessels, surfaces, and quiet objects shaped by hand.",
  featureImage: "",
  aboutHeading: "about",
  aboutText:
    "Paniz Borna works across ceramic sculpture and drawing, focusing on tactile forms, surface, memory, and the slow language of material.",
  artistImage: "",
  email: "hello@example.com",
  phone: "",
};

export function useSiteSettings() {
  const settings = useState<SiteSettings>("site-settings", () => ({ ...defaultSettings }));

  function loadSettings() {
    if (!import.meta.client) {
      return;
    }

    const stored = localStorage.getItem(settingsKey);

    if (!stored) {
      settings.value = { ...defaultSettings };
      return;
    }

    try {
      settings.value = { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      settings.value = { ...defaultSettings };
    }
  }

  function saveSettings(nextSettings: SiteSettings) {
    settings.value = nextSettings;

    if (import.meta.client) {
      localStorage.setItem(settingsKey, JSON.stringify(nextSettings));
    }
  }

  return {
    settings,
    loadSettings,
    saveSettings,
  };
}
