import {
  categories,
  type Category,
  type Product,
} from "../data/servicesCatalog";

const allProducts: Product[] = categories.flatMap((c) => c.products);

/** `/services/<slug>` */
export function serviceUrl(slug: string): string {
  return `/services/${slug}`;
}

/** Slug for a product name. Case-insensitive, same rule as the old ?prod= matching. */
export function slugByName(name: string): string | null {
  const key = name.toLowerCase();
  return allProducts.find((p) => p.name.toLowerCase() === key)?.slug ?? null;
}

/** URL for a product name. Falls back to /services (and warns in dev) if unknown. */
export function serviceUrlByName(name: string): string {
  const slug = slugByName(name);
  if (!slug) {
    if (import.meta.env.DEV) {
      console.warn(`[serviceUrls] Unknown product name: "${name}"`);
    }
    return "/services";
  }
  return serviceUrl(slug);
}

/**
 * Resolves a legacy ?cat=&prod= pair using today's rules:
 * category id is an exact match, product name is case-insensitive within that category.
 */
export function resolveLegacy(
  cat: string | null | undefined,
  prod: string | null | undefined
): Product | null {
  if (!cat || !prod) return null;
  const category = categories.find((c) => c.id === cat);
  if (!category) return null;
  const key = prod.toLowerCase();
  return category.products.find((p) => p.name.toLowerCase() === key) ?? null;
}

export function productBySlug(slug: string | null | undefined): Product | null {
  if (!slug) return null;
  return allProducts.find((p) => p.slug === slug) ?? null;
}

/** Category that owns a slug (needed for breadcrumbs and schema in later phases). */
export function categoryBySlug(slug: string | null | undefined): Category | null {
  if (!slug) return null;
  return categories.find((c) => c.products.some((p) => p.slug === slug)) ?? null;
}