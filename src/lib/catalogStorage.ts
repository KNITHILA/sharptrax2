import {
  categories as seedCategories,
  type Category,
  type Product,
} from "../data/servicesCatalog";
import {
  seedFeatured,
  seedFooterLinks,
  type FeaturedItem,
  type FooterLink,
} from "../data/siteSeed";
import { uid } from "./catalogUtils";

// Bump the suffix + STORAGE_VERSION to force every browser back to the seed.
export const STORAGE_KEY = "sharptrax_catalog_v1";
export const STORAGE_VERSION = 1;
// Browsers allow roughly 5M characters of localStorage per origin.
export const STORAGE_LIMIT_CHARS = 5_000_000;

export interface CatalogState {
  version: number;
  categories: Category[];
  featured: FeaturedItem[];
  footerLinks: FooterLink[];
}

export type SaveResult = { ok: true } | { ok: false; error: string };
export type ParseResult =
  | { ok: true; state: CatalogState }
  | { ok: false; error: string };

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function buildSeedState(): CatalogState {
  return {
    version: STORAGE_VERSION,
    categories: clone(seedCategories),
    featured: clone(seedFeatured),
    footerLinks: clone(seedFooterLinks),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((x): x is string => typeof x === "string")
    : [];
}

/** Validates + normalises untrusted data (storage or imported file). */
export function parseCatalog(raw: unknown): ParseResult {
  if (!isRecord(raw)) {
    return { ok: false, error: "File is not a valid catalog." };
  }
  if (raw.version !== STORAGE_VERSION) {
    return {
      ok: false,
      error: `Unsupported catalog version (expected ${STORAGE_VERSION}).`,
    };
  }
  if (!Array.isArray(raw.categories)) {
    return { ok: false, error: "Catalog has no categories list." };
  }

  const ids = new Set<string>();
  const slugs = new Set<string>();
  const categories: Category[] = [];

  for (const c of raw.categories) {
    if (
      !isRecord(c) ||
      typeof c.id !== "string" ||
      typeof c.title !== "string" ||
      !Array.isArray(c.products)
    ) {
      return { ok: false, error: "A category in the file is malformed." };
    }
    if (ids.has(c.id)) {
      return { ok: false, error: `Duplicate category id "${c.id}".` };
    }
    ids.add(c.id);

    const products: Product[] = [];
    for (const p of c.products) {
      if (
        !isRecord(p) ||
        typeof p.slug !== "string" ||
        typeof p.name !== "string" ||
        typeof p.desc !== "string"
      ) {
        return { ok: false, error: `A product in "${c.title}" is malformed.` };
      }
      if (slugs.has(p.slug)) {
        return { ok: false, error: `Duplicate product slug "${p.slug}".` };
      }
      slugs.add(p.slug);

      const product: Product = {
        slug: p.slug,
        name: p.name,
        desc: p.desc,
        imgs: strings(p.imgs),
      };
      const features = strings(p.features);
      const videos = strings(p.videos);
      if (features.length) product.features = features;
      if (videos.length) product.videos = videos;
      products.push(product);
    }

    categories.push({ id: c.id, title: c.title, products });
  }

  const featured: FeaturedItem[] = Array.isArray(raw.featured)
    ? raw.featured
        .filter(isRecord)
        .map((f) => ({
          id: typeof f.id === "string" ? f.id : uid(),
          slug: String(f.slug ?? ""),
          title: String(f.title ?? ""),
          desc: String(f.desc ?? ""),
          img: String(f.img ?? ""),
        }))
        .filter((f) => f.slug)
    : clone(seedFeatured);

  const footerLinks: FooterLink[] = Array.isArray(raw.footerLinks)
    ? raw.footerLinks
        .filter(isRecord)
        .map((l) => ({
          id: typeof l.id === "string" ? l.id : uid(),
          slug: String(l.slug ?? ""),
          label: String(l.label ?? ""),
        }))
        .filter((l) => l.slug)
    : clone(seedFooterLinks);

  return {
    ok: true,
    state: { version: STORAGE_VERSION, categories, featured, footerLinks },
  };
}

export function loadCatalog(): CatalogState {
  if (typeof window === "undefined") return buildSeedState();
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    if (!text) return buildSeedState();
    const parsed = parseCatalog(JSON.parse(text));
    return parsed.ok ? parsed.state : buildSeedState();
  } catch {
    return buildSeedState();
  }
}

export function saveCatalog(state: CatalogState): SaveResult {
  if (typeof window === "undefined") return { ok: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        "Browser storage is full. Remove some uploaded images (or use image paths instead) and try again.",
    };
  }
}

export function clearCatalog(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Approximate characters used by all localStorage keys of this origin. */
export function getStorageUsage(): number {
  if (typeof window === "undefined") return 0;
  try {
    let total = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        total += key.length + (window.localStorage.getItem(key)?.length ?? 0);
      }
    }
    return total;
  } catch {
    return 0;
  }
}