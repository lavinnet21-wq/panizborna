import type { SiteSettings } from "~/types/site-settings";

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

function fromSettingsRow(row: any): SiteSettings {
  return {
    homeTitle: row.home_title || defaultSettings.homeTitle,
    artistName: row.artist_name || defaultSettings.artistName,
    homeSubtitle: row.home_subtitle || defaultSettings.homeSubtitle,
    introText: row.intro_text || defaultSettings.introText,
    introImage: row.intro_image || "",
    featureTitle: row.feature_title || defaultSettings.featureTitle,
    featureText: row.feature_text || defaultSettings.featureText,
    featureImage: row.feature_image || "",
    aboutHeading: row.about_heading || defaultSettings.aboutHeading,
    aboutText: row.about_text || defaultSettings.aboutText,
    artistImage: row.artist_image || "",
    email: row.email || "",
    phone: row.phone || "",
  };
}

function toSettingsRow(settings: SiteSettings) {
  return {
    id: "main",
    home_title: settings.homeTitle,
    artist_name: settings.artistName,
    home_subtitle: settings.homeSubtitle,
    intro_text: settings.introText,
    intro_image: settings.introImage,
    feature_title: settings.featureTitle,
    feature_text: settings.featureText,
    feature_image: settings.featureImage,
    about_heading: settings.aboutHeading,
    about_text: settings.aboutText,
    artist_image: settings.artistImage,
    email: settings.email,
    phone: settings.phone,
    updated_at: new Date().toISOString(),
  };
}

export function useSiteSettings() {
  const settings = useState<SiteSettings>("site-settings", () => ({ ...defaultSettings }));
  const settingsError = useState<string>("site-settings-error", () => "");

  async function loadSettings() {
    try {
      const supabase = useSupabaseClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .single();

      if (error) {
        throw error;
      }

      settings.value = { ...defaultSettings, ...fromSettingsRow(data) };
      settingsError.value = "";
    } catch (error: any) {
      settings.value = { ...defaultSettings };
      settingsError.value = error.message || "Could not load site settings.";
    }
  }

  async function saveSettings(nextSettings: SiteSettings) {
    const supabase = useSupabaseClient();
    const { error } = await supabase.from("site_settings").upsert(toSettingsRow(nextSettings));

    if (error) {
      throw error;
    }

    settings.value = { ...nextSettings };
    await loadSettings();
  }

  return {
    settings,
    settingsError,
    loadSettings,
    saveSettings,
  };
}
