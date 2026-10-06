import { useEffect } from "react";
import type { SeoData } from "./seo";

const MARK = "data-seo";

function removeManaged(head: HTMLHeadElement) {
  head.querySelectorAll(`[${MARK}]`).forEach((n) => n.remove());
}

/**
 * Dependency-free head manager.
 * - Every tag it creates is marked data-seo and replaced (never duplicated).
 * - Matching tags from index.html are set aside while active and restored on leave.
 * - On unmount the default title/description are restored. The defaults come from
 *   <html data-default-title / data-default-description> when present (stamped by
 *   the prerender), otherwise from the current document.
 * Pass a memoised object (useMemo) so the effect doesn't re-run every render.
 */
export function useSeo(seo: SeoData): void {
  useEffect(() => {
    const head = document.head;
    const html = document.documentElement;

    const defaultTitle = html.getAttribute("data-default-title") ?? document.title;
    const defaultDescription =
      html.getAttribute("data-default-description") ??
      head.querySelector<HTMLMetaElement>('meta[name="description"]:not([data-seo])')
        ?.content ??
      null;

    // Clear anything a previous run (or the prerendered HTML) left behind.
    removeManaged(head);

    const displaced: Element[] = [];
    const place = (el: Element, conflictSelector: string) => {
      head.querySelectorAll(conflictSelector).forEach((old) => {
        if (!old.hasAttribute(MARK)) {
          displaced.push(old);
          old.remove();
        }
      });
      el.setAttribute(MARK, "");
      head.appendChild(el);
    };

    document.title = seo.title;

    const desc = document.createElement("meta");
    desc.setAttribute("name", "description");
    desc.setAttribute("content", seo.description);
    place(desc, 'meta[name="description"]');

    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", seo.canonical);
    place(canonical, 'link[rel="canonical"]');

    for (const m of seo.metas) {
      const el = document.createElement("meta");
      el.setAttribute(m.attr, m.key);
      el.setAttribute("content", m.content);
      place(el, `meta[${m.attr}="${m.key}"]`);
    }

    for (const block of seo.jsonLd) {
      const el = document.createElement("script");
      el.setAttribute("type", "application/ld+json");
      el.textContent = JSON.stringify(block).replace(/</g, "\\u003c");
      el.setAttribute(MARK, "");
      head.appendChild(el);
    }

    return () => {
      removeManaged(head);
      displaced.forEach((el) => head.appendChild(el));
      document.title = defaultTitle;
      if (defaultDescription !== null && !head.querySelector('meta[name="description"]')) {
        const restored = document.createElement("meta");
        restored.setAttribute("name", "description");
        restored.setAttribute("content", defaultDescription);
        head.appendChild(restored);
      }
    };
  }, [seo]);
}