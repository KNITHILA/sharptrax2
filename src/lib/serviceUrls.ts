import type { Category, Product } from "../data/servicesCatalog";

/** `/services/<slug>` */
export function serviceUrl(slug: string): string {
  return `/services/${slug}`;
}

export function flattenProducts(categories: Category[]): Product[] {
  return categories.flatMap((c) => c.products);
}

export function productBySlug(
  categories: Category[],
  slug: string | null | undefined,
): Product | null {
  if (!slug) return null;
  return flattenProducts(categories).find((p) => p.slug === slug) ?? null;
}

/** Category that owns a slug (breadcrumbs, schema). */
export function categoryBySlug(
  categories: Category[],
  slug: string | null | undefined,
): Category | null {
  if (!slug) return null;
  return categories.find((c) => c.products.some((p) => p.slug === slug)) ?? null;
}

export function slugByName(categories: Category[], name: string): string | null {
  const key = name.toLowerCase();
  return (
    flattenProducts(categories).find((p) => p.name.toLowerCase() === key)?.slug ?? null
  );
}

/** URL for a product name. Falls back to /services if unknown. */
export function serviceUrlByName(categories: Category[], name: string): string {
  const slug = slugByName(categories, name);
  return slug ? serviceUrl(slug) : "/services";
}

/** Resolves a legacy ?cat=&prod= pair. */
export function resolveLegacy(
  categories: Category[],
  cat: string | null | undefined,
  prod: string | null | undefined,
): Product | null {
  if (!cat || !prod) return null;
  const category = categories.find((c) => c.id === cat);
  if (!category) return null;
  const key = prod.toLowerCase();
  return category.products.find((p) => p.name.toLowerCase() === key) ?? null;
}