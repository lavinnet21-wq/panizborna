const fallbackPalette = ["#c6c5c1", "#dad9d5", "#a9aaa6", "#c0b6aa"];

function normalizeImagePath(path: string) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
}

function averageImageColor(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        resolve(null);
        return;
      }

      canvas.width = 24;
      canvas.height = 24;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let red = 0;
      let green = 0;
      let blue = 0;
      let count = 0;

      for (let index = 0; index < pixels.length; index += 16) {
        red += pixels[index];
        green += pixels[index + 1];
        blue += pixels[index + 2];
        count += 1;
      }

      resolve(
        `rgb(${Math.round(red / count)}, ${Math.round(green / count)}, ${Math.round(
          blue / count,
        )})`,
      );
    };

    image.onerror = () => resolve(null);
    image.src = normalizeImagePath(src);
  });
}

export function useArtworkPalette() {
  async function buildPalette(imagePaths: string[]) {
    if (!import.meta.client) {
      return fallbackPalette;
    }

    const colors = await Promise.all(
      imagePaths
        .filter(Boolean)
        .slice(0, 5)
        .map((imagePath) => averageImageColor(imagePath)),
    );

    const palette = colors.filter((color): color is string => Boolean(color));
    return palette.length ? palette : fallbackPalette;
  }

  return {
    fallbackPalette,
    buildPalette,
  };
}
