// Site-wide SEO constants.
// VITE_SITE_URL comes from .env.production. In dev it falls back to the
// current origin. `import.meta.env?.` keeps this file importable from
// Node/tsx scripts, where import.meta.env is undefined.

const envUrl = import.meta.env?.VITE_SITE_URL as string | undefined;

function resolveSiteUrl(): string {
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export const SITE_URL: string = resolveSiteUrl();
export const SITE_NAME = "Sharptrax Technologies";

// Title rule: `{Name} | Sharptrax Technologies, Chennai`
// If longer than MAX_TITLE_LENGTH use `{Name} | Sharptrax`
export const TITLE_SUFFIX = "Sharptrax Technologies, Chennai";
export const TITLE_SUFFIX_SHORT = "Sharptrax";
export const MAX_TITLE_LENGTH = 65;
export const MAX_DESCRIPTION_LENGTH = 155;