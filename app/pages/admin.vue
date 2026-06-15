<template>
  <div>
    <SiteHeader v-if="isLoggedIn" admin />

    <main v-if="!isLoggedIn">
      <section class="admin-login">
        <p class="eyebrow">Private area</p>
        <h1>admin login</h1>
        <form class="admin-login-form" @submit.prevent="login">
          <label>
            Email
            <input v-model="loginForm.email" type="email" autocomplete="username" />
          </label>
          <label>
            Password
            <input v-model="loginForm.password" type="password" autocomplete="current-password" />
          </label>
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
          <button type="submit">Log in</button>
        </form>
      </section>
    </main>

    <main v-else>
      <section class="admin-hero">
        <p class="eyebrow">Portfolio admin</p>
        <h1>admin</h1>
        <p>
          Manage the home page, yearly artwork archive, image galleries, and contact details.
        </p>
        <div class="admin-jump-links">
          <a href="#home-content">Home</a>
          <a href="#artworks">Works</a>
          <a href="#settings">About / Contact</a>
          <button type="button" @click="logout">Log out</button>
        </div>
        <p v-if="adminMessage" class="admin-message">{{ adminMessage }}</p>
      </section>

      <section class="admin-section" id="home-content">
        <div class="admin-section-heading">
          <p class="section-number">01</p>
          <h2>home content</h2>
        </div>

        <form class="admin-card-form" @submit.prevent="saveSiteSettings('home')">
          <label>
            Main title
            <input v-model="settingsForm.homeTitle" placeholder="portfolio" />
          </label>

          <label>
            Artist name
            <input v-model="settingsForm.artistName" placeholder="paniz borna" />
          </label>

          <label class="wide-field">
            Subtitle
            <input
              v-model="settingsForm.homeSubtitle"
              placeholder="Ceramic sculpture / drawing / material studies"
            />
          </label>

          <label class="wide-field">
            Intro text
            <textarea v-model="settingsForm.introText" rows="4"></textarea>
          </label>

          <div class="upload-field wide-field">
            <span>Intro image</span>
            <input type="file" accept="image/*" @change="uploadSettingImage($event, 'introImage')" />
            <p v-if="pendingSettingFiles.introImage" class="form-status-note">
              {{ pendingSettingFiles.introImage.name }} is ready. Save home content to publish it.
            </p>
            <img v-if="getSettingImagePreview('introImage')" :src="getSettingImagePreview('introImage')" alt="" />
          </div>

          <label>
            Feature title
            <input v-model="settingsForm.featureTitle" placeholder="selected study" />
          </label>

          <label>
            About heading
            <input v-model="settingsForm.aboutHeading" placeholder="about" />
          </label>

          <label class="wide-field">
            Feature text
            <textarea v-model="settingsForm.featureText" rows="4"></textarea>
          </label>

          <div class="upload-field wide-field">
            <span>Feature image</span>
            <input type="file" accept="image/*" @change="uploadSettingImage($event, 'featureImage')" />
            <p v-if="pendingSettingFiles.featureImage" class="form-status-note">
              {{ pendingSettingFiles.featureImage.name }} is ready. Save home content to publish it.
            </p>
            <img v-if="getSettingImagePreview('featureImage')" :src="getSettingImagePreview('featureImage')" alt="" />
          </div>

          <label class="wide-field">
            About text
            <textarea v-model="settingsForm.aboutText" rows="5"></textarea>
          </label>

          <p class="form-status-note wide-field">
            Images and text in this section are only published after you click Save home content.
          </p>

          <p v-if="hasUnsavedSettingsChanges" class="form-status-note wide-field">
            New changes are ready. Click Save home content to publish them on the site.
          </p>

          <p v-if="isSavingHome" class="form-status-note wide-field">
            Saving home content and uploading images...
          </p>

          <p v-if="homeSaveSuccess" class="form-success-note wide-field">
            Home content saved successfully and is now connected to the first page.
          </p>

          <button type="submit" :disabled="isSavingHome">
            {{ isSavingHome ? "Saving..." : "Save home content" }}
          </button>
        </form>
      </section>

      <section class="admin-section" id="artworks">
        <div class="admin-section-heading">
          <p class="section-number">02</p>
          <h2>works by year</h2>
        </div>

        <div class="admin-grid">
          <form class="admin-card-form" @submit.prevent="saveArtwork">
            <div class="form-group-title">
              <p class="section-number">{{ form.id ? "Edit work" : "New work" }}</p>
              <p>Choose a year, then add the artwork details and as many image paths as needed.</p>
            </div>

            <label>
              Year
              <input v-model="form.year" required placeholder="2026" />
            </label>

            <label>
              Artwork title
              <input v-model="form.title" required placeholder="Untitled Vessel Study" />
            </label>

            <label>
              Material / Medium
              <input v-model="form.medium" required placeholder="stoneware, glaze" />
            </label>

            <label>
              Dimensions
              <input v-model="form.dimensions" placeholder="24 x 18 x 12 cm" />
            </label>

            <label>
              Status
              <input v-model="form.status" placeholder="available / archive / study" />
            </label>

            <div class="upload-field">
              <span>Cover image</span>
              <input type="file" accept="image/*" @change="uploadCoverImage" />
              <p v-if="pendingArtworkCoverFile" class="form-status-note">
                {{ pendingArtworkCoverFile.name }} is ready. Save artwork to publish it.
              </p>
              <img v-if="form.image" :src="form.image" alt="" />
            </div>

            <div class="upload-field wide-field">
              <span>Gallery images</span>
              <input type="file" accept="image/*" multiple @change="uploadGalleryImages" />
              <p v-if="pendingArtworkGalleryFiles.length" class="form-status-note">
                {{ pendingArtworkGalleryFiles.length }} new image(s) are ready. Save artwork to publish them.
              </p>
              <div v-if="galleryPreviewImages.length" class="upload-preview-grid">
                <img v-for="image in galleryPreviewImages" :key="image" :src="image" alt="" />
              </div>
            </div>

            <label class="wide-field">
              Description
              <textarea v-model="form.description" rows="5"></textarea>
            </label>

            <p v-if="hasUnsavedArtworkChanges" class="form-status-note wide-field">
              Artwork changes are ready. Click Save artwork to publish them on the site.
            </p>

            <p v-if="isSavingArtwork" class="form-status-note wide-field">
              Saving artwork and uploading images...
            </p>

            <p v-if="artworkSaveSuccess" class="form-success-note wide-field">
              Artwork saved successfully and is now connected to the site.
            </p>

            <div class="admin-actions wide-field">
              <button type="submit" :disabled="isSavingArtwork">
                {{ isSavingArtwork ? "Saving..." : "Save artwork" }}
              </button>
              <button type="button" @click="clearForm">New artwork</button>
              <button type="button" @click="resetDemoData">Reset demo data</button>
            </div>
          </form>

          <div class="admin-list-wrap">
            <div class="admin-list-heading">
              <p class="section-number">Current works</p>
              <p>{{ sortedArtworks.length }} items</p>
            </div>

            <div class="admin-year-group" v-for="group in adminArtworksByYear" :key="group.year">
              <h3>{{ group.year }}</h3>
              <article v-for="artwork in group.items" :key="artwork.id" class="admin-item">
                <div>
                  <h2>{{ artwork.title }}</h2>
                  <p>{{ artwork.medium }}</p>
                  <p>{{ artwork.dimensions || "dimensions not set" }}</p>
                  <p>{{ artworkImageCount(artwork) }} image(s)</p>
                </div>
                <div class="admin-item-actions">
                  <button type="button" @click="editArtwork(artwork)">Edit</button>
                  <button type="button" @click="removeArtwork(artwork.id)">Delete</button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="admin-section" id="settings">
        <div class="admin-section-heading">
          <p class="section-number">03</p>
          <h2>about & contact</h2>
        </div>

        <form class="admin-card-form compact-form" @submit.prevent="saveSiteSettings('contact')">
          <div class="upload-field">
            <span>Artist image</span>
            <input type="file" accept="image/*" @change="uploadSettingImage($event, 'artistImage')" />
            <p v-if="pendingSettingFiles.artistImage" class="form-status-note">
              {{ pendingSettingFiles.artistImage.name }} is ready. Save settings to publish it.
            </p>
            <img v-if="getSettingImagePreview('artistImage')" :src="getSettingImagePreview('artistImage')" alt="" />
          </div>

          <label>
            Email
            <input v-model="settingsForm.email" type="email" placeholder="hello@example.com" />
          </label>

          <label>
            Phone
            <input v-model="settingsForm.phone" placeholder="+98 ..." />
          </label>

          <p v-if="hasUnsavedSettingsChanges" class="form-status-note wide-field">
            Changes are ready. Click Save settings to publish them on the site.
          </p>

          <p v-if="isSavingContact" class="form-status-note wide-field">
            Saving about and contact settings...
          </p>

          <p v-if="contactSaveSuccess" class="form-success-note wide-field">
            About and contact settings saved successfully.
          </p>

          <button type="submit" :disabled="isSavingContact">
            {{ isSavingContact ? "Saving..." : "Save settings" }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useHead } from "#imports";
import { useArtworks } from "../composables/useArtworks";
import { useSiteSettings } from "../composables/useSiteSettings";
import { useSupabaseClient } from "../composables/useSupabaseClient";
import type { Artwork } from "../types/artwork";
import type { SiteSettings } from "../types/site-settings";

useHead({
  title: "Admin | Paniz Borna Portfolio",
});

const { artworks, loadArtworks, upsertArtwork, deleteArtwork, resetArtworks } = useArtworks();
const { settings, loadSettings, saveSettings } = useSiteSettings();
const supabase = useSupabaseClient();

const emptyArtwork: Artwork = {
  id: "",
  title: "",
  year: "",
  medium: "",
  dimensions: "",
  status: "",
  image: "",
  images: [],
  description: "",
};

const form = reactive<Artwork>({ ...emptyArtwork });
const galleryText = ref("");
const settingsForm = reactive<SiteSettings>({ ...settings.value });
const isLoggedIn = ref(false);
const loginError = ref("");
const adminMessage = ref("");
const hasUnsavedArtworkChanges = ref(false);
const hasUnsavedSettingsChanges = ref(false);
const isSavingHome = ref(false);
const isSavingArtwork = ref(false);
const isSavingContact = ref(false);
const homeSaveSuccess = ref(false);
const artworkSaveSuccess = ref(false);
const contactSaveSuccess = ref(false);
const pauseArtworkDirtyTracking = ref(false);
const pauseSettingsDirtyTracking = ref(false);
const pendingSettingFiles = reactive<{
  introImage: File | null;
  featureImage: File | null;
  artistImage: File | null;
}>({
  introImage: null,
  featureImage: null,
  artistImage: null,
});
const pendingSettingImagePreviews = reactive<Record<"introImage" | "featureImage" | "artistImage", string>>({
  introImage: "",
  featureImage: "",
  artistImage: "",
});
const pendingArtworkCoverFile = ref<File | null>(null);
const pendingArtworkGalleryFiles = ref<File[]>([]);
const loginForm = reactive({
  email: "",
  password: "",
});

const savedGalleryImages = computed(() => {
  return galleryText.value
    .split("\n")
    .map((path: string) => path.trim())
    .filter(Boolean);
});

const galleryPreviewImages = computed(() => {
  return [
    ...savedGalleryImages.value,
    ...pendingArtworkGalleryFiles.value.map((file) => URL.createObjectURL(file)),
  ];
});

const sortedArtworks = computed(() => {
  return [...artworks.value].sort((a, b) => {
    return Number(b.year) - Number(a.year) || a.title.localeCompare(b.title);
  });
});

const adminArtworksByYear = computed(() => {
  const groups = sortedArtworks.value.reduce<Record<string, Artwork[]>>((result: Record<string, Artwork[]>, artwork: Artwork) => {
    if (!result[artwork.year]) {
      result[artwork.year] = [];
    }

    result[artwork.year].push(artwork);
    return result;
  }, {});

  return Object.keys(groups)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({
      year,
      items: groups[year],
    }));
});

function artworkImageCount(artwork: Artwork) {
  return [artwork.image, ...(artwork.images || [])].filter(Boolean).length;
}

function getSettingImagePreview(key: "artistImage" | "introImage" | "featureImage") {
  return pendingSettingImagePreviews[key] || settingsForm[key];
}

function runWithoutArtworkDirtyTracking(callback: () => void) {
  pauseArtworkDirtyTracking.value = true;
  callback();
  setTimeout(() => {
    pauseArtworkDirtyTracking.value = false;
  }, 0);
}

function runWithoutSettingsDirtyTracking(callback: () => void) {
  pauseSettingsDirtyTracking.value = true;
  callback();
  setTimeout(() => {
    pauseSettingsDirtyTracking.value = false;
  }, 0);
}

function clearForm() {
  runWithoutArtworkDirtyTracking(() => {
    Object.assign(form, emptyArtwork);
    galleryText.value = "";
  });
  pendingArtworkCoverFile.value = null;
  pendingArtworkGalleryFiles.value = [];
  hasUnsavedArtworkChanges.value = false;
  artworkSaveSuccess.value = false;
}

async function saveArtwork() {
  try {
    isSavingArtwork.value = true;
    artworkSaveSuccess.value = false;
    adminMessage.value = "Saving artwork...";
    let coverImage = form.image;
    if (pendingArtworkCoverFile.value) {
      coverImage = await uploadFile(
        pendingArtworkCoverFile.value,
        `artworks/${form.year || "uncategorized"}`,
      );
    }

    const uploadedGalleryImages = pendingArtworkGalleryFiles.value.length
      ? await Promise.all(
          pendingArtworkGalleryFiles.value.map((file) =>
            uploadFile(file, `artworks/${form.year || "uncategorized"}`),
          ),
        )
      : [];

    await upsertArtwork({
      ...form,
      image: coverImage,
      images: galleryText.value
        .split("\n")
        .map((path: string) => path.trim())
        .filter(Boolean)
        .concat(uploadedGalleryImages),
    });
    adminMessage.value = "Artwork saved and published on the site.";
    pendingArtworkCoverFile.value = null;
    pendingArtworkGalleryFiles.value = [];
    hasUnsavedArtworkChanges.value = false;
    artworkSaveSuccess.value = true;
    clearForm();
  } catch (error: any) {
    adminMessage.value = error.message || "Could not save artwork.";
  } finally {
    isSavingArtwork.value = false;
  }
}

function editArtwork(artwork: Artwork) {
  runWithoutArtworkDirtyTracking(() => {
    Object.assign(form, artwork);
    galleryText.value = (artwork.images || []).join("\n");
  });
  pendingArtworkCoverFile.value = null;
  pendingArtworkGalleryFiles.value = [];
  hasUnsavedArtworkChanges.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function removeArtwork(id: string) {
  try {
    await deleteArtwork(id);
    adminMessage.value = "Artwork deleted.";
  } catch (error: any) {
    adminMessage.value = error.message || "Could not delete artwork.";
  }
}

async function resetDemoData() {
  try {
    await resetArtworks();
    adminMessage.value = "Demo artworks saved to Supabase.";
    clearForm();
  } catch (error: any) {
    adminMessage.value = error.message || "Could not reset demo data.";
  }
}

async function saveSiteSettings(section: "home" | "contact") {
  try {
    if (section === "home") {
      isSavingHome.value = true;
      homeSaveSuccess.value = false;
      adminMessage.value = "Saving home content...";
    } else {
      isSavingContact.value = true;
      contactSaveSuccess.value = false;
      adminMessage.value = "Saving about and contact settings...";
    }
    const nextSettings = { ...settingsForm };

    if (pendingSettingFiles.introImage) {
      nextSettings.introImage = await uploadFile(pendingSettingFiles.introImage, "site");
    }

    if (pendingSettingFiles.featureImage) {
      nextSettings.featureImage = await uploadFile(pendingSettingFiles.featureImage, "site");
    }

    if (pendingSettingFiles.artistImage) {
      nextSettings.artistImage = await uploadFile(pendingSettingFiles.artistImage, "site");
    }

    await saveSettings(nextSettings);
    runWithoutSettingsDirtyTracking(() => {
      Object.assign(settingsForm, settings.value);
    });
    pendingSettingFiles.introImage = null;
    pendingSettingFiles.featureImage = null;
    pendingSettingFiles.artistImage = null;
    pendingSettingImagePreviews.introImage = "";
    pendingSettingImagePreviews.featureImage = "";
    pendingSettingImagePreviews.artistImage = "";
    adminMessage.value =
      section === "home"
        ? "Home content saved and published on the site."
        : "About and contact settings saved and published on the site.";
    hasUnsavedSettingsChanges.value = false;
    if (section === "home") {
      homeSaveSuccess.value = true;
    } else {
      contactSaveSuccess.value = true;
    }
  } catch (error: any) {
    adminMessage.value = error.message || "Could not save settings.";
  } finally {
    if (section === "home") {
      isSavingHome.value = false;
    } else {
      isSavingContact.value = false;
    }
  }
}

async function login() {
  const email = loginForm.email.trim().toLowerCase();
  const password = loginForm.password;

  if (!email || !password) {
    loginError.value = "Email and password are required.";
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!error) {
    isLoggedIn.value = true;
    loginError.value = "";
    await loadArtworks();
    await loadSettings();
    Object.assign(settingsForm, settings.value);
    return;
  }

  loginError.value = error.message;
}

async function logout() {
  await supabase.auth.signOut();
  isLoggedIn.value = false;
}

function makeStoragePath(file: File, folder: string) {
  const extension = file.name.split(".").pop() || "jpg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${folder}/${Date.now()}-${safeName}.${extension}`;
}

async function uploadFile(file: File, folder: string) {
  const path = makeStoragePath(file, folder);
  const { error } = await supabase.storage.from("portfolio").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
  return data.publicUrl;
}

async function uploadFiles(files: FileList | null, folder: string) {
  if (!files?.length) {
    return [];
  }

  return Promise.all(Array.from(files).map((file) => uploadFile(file, folder)));
}

async function uploadCoverImage(event: Event) {
  try {
    const input = event.target as HTMLInputElement;
    const [file] = Array.from(input.files || []);

    if (file) {
      pendingArtworkCoverFile.value = file;
      form.image = URL.createObjectURL(file);
      hasUnsavedArtworkChanges.value = true;
      artworkSaveSuccess.value = false;
      adminMessage.value = "Cover image is ready. Click Save artwork to upload it to the bucket and publish it.";
    }
  } catch (error: any) {
    adminMessage.value =
      error.message || "Could not upload cover image. Check admin access and storage policies.";
  }
}

async function uploadGalleryImages(event: Event) {
  try {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    if (files.length) {
      pendingArtworkGalleryFiles.value = [...pendingArtworkGalleryFiles.value, ...files];
      hasUnsavedArtworkChanges.value = true;
      artworkSaveSuccess.value = false;
      adminMessage.value = "Gallery images are ready. Click Save artwork to upload them to the bucket and publish them.";
    }
  } catch (error: any) {
    adminMessage.value =
      error.message || "Could not upload gallery images. Check admin access and storage policies.";
  }
}

async function uploadSettingImage(
  event: Event,
  key: "artistImage" | "introImage" | "featureImage",
) {
  try {
    const input = event.target as HTMLInputElement;
    const [file] = Array.from(input.files || []);

    if (file) {
      pendingSettingFiles[key] = file;
      pendingSettingImagePreviews[key] = URL.createObjectURL(file);
      hasUnsavedSettingsChanges.value = true;
      homeSaveSuccess.value = false;
      contactSaveSuccess.value = false;
      adminMessage.value = "Image is ready. Click Save home content to upload it to the bucket and publish it.";
    }
  } catch (error: any) {
    adminMessage.value =
      error.message || "Could not upload image. Check admin access and storage policies.";
  }
}

watch(
  form,
  () => {
    if (!pauseArtworkDirtyTracking.value) {
      hasUnsavedArtworkChanges.value = true;
    }
  },
  { deep: true },
);

watch(galleryText, () => {
  if (!pauseArtworkDirtyTracking.value) {
    hasUnsavedArtworkChanges.value = true;
  }
});

watch(
  settingsForm,
  () => {
    if (!pauseSettingsDirtyTracking.value) {
      hasUnsavedSettingsChanges.value = true;
    }
  },
  { deep: true },
);

onMounted(async () => {
  const sessionResult = await supabase.auth.getSession();
  isLoggedIn.value = Boolean(sessionResult.data.session);
  await loadArtworks();
  await loadSettings();
  runWithoutSettingsDirtyTracking(() => {
    Object.assign(settingsForm, settings.value);
  });
  hasUnsavedSettingsChanges.value = false;
});
</script>
