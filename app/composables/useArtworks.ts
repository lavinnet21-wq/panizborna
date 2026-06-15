import type { Artwork } from "~/types/artwork";

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

function fromArtworkRow(row: any): Artwork {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    medium: row.medium,
    dimensions: row.dimensions || "",
    status: row.status || "",
    image: row.image || "",
    images: row.images || [],
    description: row.description || "",
  };
}

function toArtworkRow(artwork: Artwork) {
  return {
    id: artwork.id || createArtworkId(artwork.title),
    title: artwork.title,
    year: artwork.year,
    medium: artwork.medium,
    dimensions: artwork.dimensions || "",
    status: artwork.status || "",
    image: artwork.image || "",
    images: artwork.images || [],
    description: artwork.description || "",
    updated_at: new Date().toISOString(),
  };
}

export function useArtworks() {
  const artworks = useState<Artwork[]>("artworks", () => defaultArtworks);
  const artworksError = useState<string>("artworks-error", () => "");

  async function loadArtworks() {
    try {
      const supabase = useSupabaseClient();
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("year", { ascending: false })
        .order("title", { ascending: true });

      if (error) {
        throw error;
      }

      artworks.value = data?.length ? data.map(fromArtworkRow) : defaultArtworks;
      artworksError.value = "";
    } catch (error: any) {
      artworks.value = defaultArtworks;
      artworksError.value = error.message || "Could not load artworks.";
    }
  }

  async function upsertArtwork(artwork: Artwork) {
    const id = artwork.id || createArtworkId(artwork.title);
    const nextArtwork = { ...artwork, id, images: artwork.images || [] };
    const supabase = useSupabaseClient();
    const { error } = await supabase.from("artworks").upsert(toArtworkRow(nextArtwork));

    if (error) {
      throw error;
    }

    await loadArtworks();
  }

  async function deleteArtwork(id: string) {
    const supabase = useSupabaseClient();
    const { error } = await supabase.from("artworks").delete().eq("id", id);

    if (error) {
      throw error;
    }

    await loadArtworks();
  }

  async function resetArtworks() {
    const supabase = useSupabaseClient();
    const { error } = await supabase.from("artworks").upsert(defaultArtworks.map(toArtworkRow));

    if (error) {
      throw error;
    }

    await loadArtworks();
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
    artworksError,
    artworksByYear,
    loadArtworks,
    upsertArtwork,
    deleteArtwork,
    resetArtworks,
  };
}
