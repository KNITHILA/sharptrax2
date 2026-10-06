import type { Category, Product } from "../data/servicesCatalog";
import {
  SITE_URL,
  SITE_NAME,
  TITLE_SUFFIX,
  TITLE_SUFFIX_SHORT,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../config/site";

export interface SeoMeta {
  attr: "name" | "property";
  key: string;
  content: string;
}

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  image: string;
  /** Open Graph + Twitter tags (the plain description tag is handled via `description`). */
  metas: SeoMeta[];
  jsonLd: Array<Record<string, unknown>>;
}

/** `{Name} | Sharptrax Technologies, Chennai`, or `{Name} | Sharptrax` if > 65 chars. */
export function buildTitle(name: string): string {
  const full = `${name} | ${TITLE_SUFFIX}`;
  return full.length <= MAX_TITLE_LENGTH ? full : `${name} | ${TITLE_SUFFIX_SHORT}`;
}

/**
 * Existing `desc`, cut at the last sentence end within 155 characters,
 * otherwise at a word boundary plus "…" (total still <= 155).
 */
export function buildDescription(desc: string): string {
  const text = desc.replace(/\s+/g, " ").trim();
  const max = MAX_DESCRIPTION_LENGTH;
  if (text.length <= max) return text;

  let cut = -1;
  const sentenceEnd = /[.!?](?=\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = sentenceEnd.exec(text)) !== null) {
    if (m.index + 1 > max) break;
    cut = m.index + 1;
  }
  if (cut > 0) return text.slice(0, cut);

  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const base = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).replace(
    /[\s,;:–—-]+$/,
    "",
  );
  return `${base}…`;
}

/** Absolute URL; spaces encoded as %20 (meta + schema only). */
export function absoluteUrl(siteUrl: string, pathOrUrl: string): string {
  const full = /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  return full.replace(/ /g, "%20");
}

export function buildSeo(
  product: Product,
  category: Category,
  siteUrl: string = SITE_URL,
): SeoData {
  const base = siteUrl.replace(/\/+$/, "");
  const canonical = `${base}/services/${product.slug}`;
  const title = buildTitle(product.name);
  const description = buildDescription(product.desc);
  const images = product.imgs.map((src) => absoluteUrl(base, src));
  const image = images[0] ?? "";

  const metas: SeoMeta[] = [
    { attr: "property", key: "og:type", content: "website" },
    { attr: "property", key: "og:site_name", content: SITE_NAME },
    { attr: "property", key: "og:title", content: title },
    { attr: "property", key: "og:description", content: description },
    { attr: "property", key: "og:url", content: canonical },
    { attr: "property", key: "og:image", content: image },
    { attr: "name", key: "twitter:card", content: "summary_large_image" },
    { attr: "name", key: "twitter:title", content: title },
    { attr: "name", key: "twitter:description", content: description },
    { attr: "name", key: "twitter:image", content: image },
  ];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${base}/services` },
      { "@type": "ListItem", position: 3, name: product.name, item: canonical },
    ],
  };

  // No `offers`: there are no prices.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.desc,
    image: images,
    url: canonical,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: category.title,
  };

  return { title, description, canonical, image, metas, jsonLd: [breadcrumb, productLd] };
}