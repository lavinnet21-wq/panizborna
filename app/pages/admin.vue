<template>
  <div>
    <SiteHeader v-if="isLoggedIn" admin />

    <main v-if="!isLoggedIn">
      <section class="admin-login">
        <p class="eyebrow">Private area</p>
        <h1>admin login</h1>
        <form class="admin-login-form" @submit.prevent="login">
          <label>
            Username
            <input v-model="loginForm.username" autocomplete="username" />
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
      </section>

      <section class="admin-section" id="home-content">
        <div class="admin-section-heading">
          <p class="section-number">01</p>
          <h2>home content</h2>
        </div>

        <form class="admin-card-form" @submit.prevent="saveSiteSettings">
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
            <label>
              Intro image
              <input v-model="settingsForm.introImage" placeholder="/assets/home-intro.jpg" />
            </label>
            <input type="file" accept="image/*" @change="uploadSettingImage($event, 'introImage')" />
            <img v-if="settingsForm.introImage" :src="settingsForm.introImage" alt="" />
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
            <label>
              Feature image
              <input v-model="settingsForm.featureImage" placeholder="/assets/home-detail.jpg" />
            </label>
            <input type="file" accept="image/*" @change="uploadSettingImage($event, 'featureImage')" />
            <img v-if="settingsForm.featureImage" :src="settingsForm.featureImage" alt="" />
          </div>

          <label class="wide-field">
            About text
            <textarea v-model="settingsForm.aboutText" rows="5"></textarea>
          </label>

          <button type="submit">Save home content</button>
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

            <label>
              Cover image
              <input v-model="form.image" placeholder="/assets/2026/work-01.jpg" />
            </label>

            <div class="upload-field">
              <span>Upload cover</span>
              <input type="file" accept="image/*" @change="uploadCoverImage" />
              <img v-if="form.image" :src="form.image" alt="" />
            </div>

            <label class="wide-field">
              Gallery images
              <textarea
                v-model="galleryText"
                rows="5"
                placeholder="/assets/2026/detail-01.jpg&#10;/assets/2026/detail-02.jpg"
              ></textarea>
            </label>

            <div class="upload-field wide-field">
              <span>Upload gallery images</span>
              <input type="file" accept="image/*" multiple @change="uploadGalleryImages" />
              <div v-if="galleryImages.length" class="upload-preview-grid">
                <img v-for="image in galleryImages" :key="image" :src="image" alt="" />
              </div>
            </div>

            <label class="wide-field">
              Description
              <textarea v-model="form.description" rows="5"></textarea>
            </label>

            <div class="admin-actions wide-field">
              <button type="submit">Save artwork</button>
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
                  <button type="button" @click="deleteArtwork(artwork.id)">Delete</button>
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

        <form class="admin-card-form compact-form" @submit.prevent="saveSiteSettings">
          <label>
            Artist image path
            <input v-model="settingsForm.artistImage" placeholder="/assets/artist.jpg" />
          </label>

          <div class="upload-field">
            <span>Upload artist image</span>
            <input type="file" accept="image/*" @change="uploadSettingImage($event, 'artistImage')" />
            <img v-if="settingsForm.artistImage" :src="settingsForm.artistImage" alt="" />
          </div>

          <label>
            Email
            <input v-model="settingsForm.email" type="email" placeholder="hello@example.com" />
          </label>

          <label>
            Phone
            <input v-model="settingsForm.phone" placeholder="+98 ..." />
          </label>

          <button type="submit">Save settings</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Artwork } from "~/types/artwork";

useHead({
  title: "Admin | Paniz Borna Portfolio",
});

const { artworks, loadArtworks, upsertArtwork, deleteArtwork, resetArtworks } = useArtworks();
const { settings, loadSettings, saveSettings } = useSiteSettings();
const adminSessionKey = "paniz-admin-session";
const adminUsername = "paniz";
const adminPassword = "paniz2026";

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
const settingsForm = reactive({ ...settings.value });
const isLoggedIn = ref(false);
const loginError = ref("");
const loginForm = reactive({
  username: "",
  password: "",
});

const galleryImages = computed(() => {
  return galleryText.value
    .split("\n")
    .map((path) => path.trim())
    .filter(Boolean);
});

const sortedArtworks = computed(() => {
  return [...artworks.value].sort((a, b) => {
    return Number(b.year) - Number(a.year) || a.title.localeCompare(b.title);
  });
});

const adminArtworksByYear = computed(() => {
  const groups = sortedArtworks.value.reduce<Record<string, Artwork[]>>((result, artwork) => {
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

function clearForm() {
  Object.assign(form, emptyArtwork);
  galleryText.value = "";
}

function saveArtwork() {
  upsertArtwork({
    ...form,
    images: galleryText.value
      .split("\n")
      .map((path) => path.trim())
      .filter(Boolean),
  });
  clearForm();
}

function editArtwork(artwork: Artwork) {
  Object.assign(form, artwork);
  galleryText.value = (artwork.images || []).join("\n");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDemoData() {
  resetArtworks();
  clearForm();
}

function saveSiteSettings() {
  saveSettings({ ...settingsForm });
}

function login() {
  if (loginForm.username === adminUsername && loginForm.password === adminPassword) {
    isLoggedIn.value = true;
    loginError.value = "";
    sessionStorage.setItem(adminSessionKey, "true");
    return;
  }

  loginError.value = "Username or password is incorrect.";
}

function logout() {
  isLoggedIn.value = false;
  sessionStorage.removeItem(adminSessionKey);
}

function readFiles(files: FileList | null) {
  if (!files?.length) {
    return Promise.resolve([]);
  }

  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}

async function uploadCoverImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const [image] = await readFiles(input.files);

  if (image) {
    form.image = image;
  }
}

async function uploadGalleryImages(event: Event) {
  const input = event.target as HTMLInputElement;
  const images = await readFiles(input.files);

  if (images.length) {
    galleryText.value = [...galleryImages.value, ...images].join("\n");
  }
}

async function uploadSettingImage(
  event: Event,
  key: "artistImage" | "introImage" | "featureImage",
) {
  const input = event.target as HTMLInputElement;
  const [image] = await readFiles(input.files);

  if (image) {
    settingsForm[key] = image;
  }
}

onMounted(() => {
  isLoggedIn.value = sessionStorage.getItem(adminSessionKey) === "true";
  loadArtworks();
  loadSettings();
  Object.assign(settingsForm, settings.value);
});
</script>
