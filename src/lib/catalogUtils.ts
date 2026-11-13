import type { Category } from "../data/servicesCatalog";

/* ------------------------------ slugs / ids ------------------------------ */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
}

/** Returns a new array with the item at `index` moved by `dir` (-1 up, +1 down). */
export function swap<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) {
    return list;
  }
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

/* --------------------------------- media --------------------------------- */

/** Accepts "/path/img.jpg", "path/img.jpg", "https://...", or data:image URLs. */
export function normalizeImagePath(input: string): string {
  const raw = input.trim();
  if (!raw) return "";
  if (/^(https?:\/\/|data:image\/)/i.test(raw)) return raw;
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

/** Converts YouTube watch / short / youtu.be links into embed links. */
export function normalizeVideoUrl(input: string): string {
  const raw = input.trim();
  if (!raw) return "";

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      const host = url.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        const id = url.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}`;
      }

      if (host === "youtube.com" || host === "m.youtube.com") {
        if (url.pathname === "/watch") {
          const id = url.searchParams.get("v");
          if (id) return `https://www.youtube.com/embed/${id}`;
        }
        if (url.pathname.startsWith("/shorts/")) {
          const id = url.pathname.split("/")[2];
          if (id) return `https://www.youtube.com/embed/${id}`;
        }
      }
    } catch {
      /* fall through and return raw */
    }
    return raw;
  }

  return raw.startsWith("/") ? raw : `/${raw}`;
}

/** Resizes to max 1200px and re-encodes as JPEG (SVG is passed through). */
export function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error(`${file.name} is not an image.`));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error(`${file.name} is larger than 15 MB.`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.onload = () => {
      const dataUrl = String(reader.result);

      if (file.type === "image/svg+xml") {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error(`Could not decode ${file.name}.`));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas is not supported in this browser."));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/* --------------------------- download / export --------------------------- */

export function downloadTextFile(filename: string, text: string, mime: string): void {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function imageFileName(slug: string, index: number, src: string): string {
  if (src.startsWith("data:")) {
    const ext = src.startsWith("data:image/png")
      ? "png"
      : src.startsWith("data:image/svg")
        ? "svg"
        : "jpg";
    return `${slug}-${index + 1}.${ext}`;
  }
  const clean = src.split("?")[0];
  const name = clean.substring(clean.lastIndexOf("/") + 1);
  return name || `${slug}-${index + 1}.jpg`;
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Flat CSV for WordPress / WooCommerce style imports. */
export function buildWordPressCsv(categories: Category[]): string {
  const header = [
    "category",
    "category_slug",
    "product_name",
    "product_slug",
    "sort_order",
    "description",
    "specifications",
    "image_files",
    "image_paths",
    "videos",
  ];

  const rows: string[] = [header.map(csvCell).join(",")];

  for (const category of categories) {
    category.products.forEach((product, index) => {
      const files = product.imgs.map((src, i) => imageFileName(product.slug, i, src));
      const paths = product.imgs.map((src) =>
        src.startsWith("data:") ? "(uploaded in admin - see JSON backup)" : src,
      );
      rows.push(
        [
          category.title,
          category.id,
          product.name,
          product.slug,
          String(index + 1),
          product.desc,
          (product.features ?? []).join("\n"),
          files.join("|"),
          paths.join("|"),
          (product.videos ?? []).join("|"),
        ]
          .map(csvCell)
          .join(","),
      );
    });
  }

  return "\uFEFF" + rows.join("\r\n");
}

/** Flat JSON array: one object per product, with image filenames. */
export function buildWordPressJson(categories: Category[]): string {
  const items = categories.flatMap((category) =>
    category.products.map((product, index) => ({
      category: category.title,
      category_slug: category.id,
      name: product.name,
      slug: product.slug,
      sort_order: index + 1,
      description: product.desc,
      specifications: product.features ?? [],
      image_files: product.imgs.map((src, i) => imageFileName(product.slug, i, src)),
      image_paths: product.imgs.map((src) =>
        src.startsWith("data:") ? "(uploaded in admin - see JSON backup)" : src,
      ),
      videos: product.videos ?? [],
    })),
  );
  return JSON.stringify(items, null, 2);
}