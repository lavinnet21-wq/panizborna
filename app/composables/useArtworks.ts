import type { Artwork } from "~/types/artwork";

const storageKey = "paniz-portfolio-artworks";

const defaultArtworks: Artwork[] = [
  {
    id: "untitled-vessel-study",
    title: "Untitled Vessel Study",
    year: "2026",
    medium: "stoneware, glaze",
    dimensions: "24 x 18 x 12 cm",
    status: "available",
    image: "",
    images: [],
    description: "A hand-built ceramic form exploring surface and memory.",
  },
  {
    id: "body-forms-series",
    title: "Body Forms Series",
    year: "2026",
    medium: "ceramic sculpture",
    dimensions: "variable dimensions",
    status: "selected work",
    image: "",
    images: [],
    description: "A series of tactile forms shaped around body, vessel, and fragment.",
  },
  {
    id: "surface-studies",
    title: "Surface Studies",
    year: "2025",
    medium: "drawing on paper",
    dimensions: "29 x 42 cm",
    status: "study",
    image: "",
    images: [],
    description: "Drawings focused on texture, edges, repetition, and surface tension.",
  },
  {
    id: "memory-objects",
    title: "Memory Objects",
    year: "2025",
    medium: "mixed ceramic objects",
    dimensions: "variable dimensions",
    status: "archive",
    image: "",
    images: [],
    description: "Small ceramic objects built as quiet records of gesture and time.",
  },
  {
    id: "clay-archive",
    title: "Clay Archive",
    year: "2024",
    medium: "hand-built clay studies",
    dimensions: "variable dimensions",
    status: "archive",
    image: "",
    images: [],
    description: "Early material studies in clay, form, and pressure.",
  },
];

function createArtworkId(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useArtworks() {
  const artworks = useState<Artwork[]>("artworks", () => defaultArtworks);

  function loadArtworks() {
    if (!import.meta.client) {
      return;
    }

    const stored = localStorage.getItem(storageKey);

    if (!stored) {
      artworks.value = defaultArtworks;
      return;
    }

    try {
      artworks.value = JSON.parse(stored);
    } catch {
      artworks.value = defaultArtworks;
    }
  }

  function saveArtworks(nextArtworks: Artwork[]) {
    artworks.value = nextArtworks;

    if (import.meta.client) {
      localStorage.setItem(storageKey, JSON.stringify(nextArtworks));
    }
  }

  function upsertArtwork(artwork: Artwork) {
    const id = artwork.id || createArtworkId(artwork.title);
    const nextArtwork = { ...artwork, id, images: artwork.images || [] };
    const index = artworks.value.findIndex((item) => item.id === id);
    const nextArtworks = [...artworks.value];

    if (index >= 0) {
      nextArtworks[index] = nextArtwork;
    } else {
      nextArtworks.push(nextArtwork);
    }

    saveArtworks(nextArtworks);
  }

  function deleteArtwork(id: string) {
    saveArtworks(artworks.value.filter((artwork) => artwork.id !== id));
  }

  function resetArtworks() {
    saveArtworks(defaultArtworks);
  }

  const artworksByYear = computed(() => {
    const groups = artworks.value.reduce<Record<string, Artwork[]>>((result, artwork) => {
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

  return {
    artworks,
    artworksByYear,
    loadArtworks,
    upsertArtwork,
    deleteArtwork,
    resetArtworks,
  };
}
