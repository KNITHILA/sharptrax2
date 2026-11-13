import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Category, Product } from "../data/servicesCatalog";
import type { FeaturedItem, FooterLink } from "../data/siteSeed";
import {
  buildSeedState,
  clearCatalog,
  getStorageUsage,
  loadCatalog,
  parseCatalog,
  saveCatalog,
  STORAGE_KEY,
  STORAGE_LIMIT_CHARS,
  type CatalogState,
} from "../lib/catalogStorage";
import { isValidSlug, slugify, swap } from "../lib/catalogUtils";

export type Result = { ok: true } | { ok: false; error: string };
export type DeleteCategoryMode =
  | { type: "delete" }
  | { type: "move"; targetId: string };

interface CatalogContextValue {
  categories: Category[];
  featured: FeaturedItem[];
  footerLinks: FooterLink[];
  allProducts: Product[];
  storageUsed: number;
  storageLimit: number;

  addCategory: (title: string, idInput?: string) => Result;
  renameCategory: (id: string, title: string) => Result;
  moveCategory: (id: string, dir: -1 | 1) => Result;
  deleteCategory: (id: string, mode: DeleteCategoryMode) => Result;

  addProduct: (categoryId: string, product: Product) => Result;
  updateProduct: (originalSlug: string, categoryId: string, product: Product) => Result;
  deleteProduct: (slug: string) => Result;
  moveProduct: (slug: string, dir: -1 | 1) => Result;

  setFeatured: (list: FeaturedItem[]) => Result;
  setFooterLinks: (list: FooterLink[]) => Result;

  exportJson: () => string;
  importJson: (text: string) => Result;
  resetToDefaults: () => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

const OK: Result = { ok: true };

function cleanProduct(p: Product): Product {
  const features = (p.features ?? []).map((f) => f.trim()).filter(Boolean);
  const videos = (p.videos ?? []).map((v) => v.trim()).filter(Boolean);
  const product: Product = {
    slug: p.slug.trim(),
    name: p.name.trim(),
    desc: p.desc.trim(),
    imgs: p.imgs.map((i) => i.trim()).filter(Boolean),
  };
  if (features.length) product.features = features;
  if (videos.length) product.videos = videos;
  return product;
}

function validateProduct(p: Product): string | null {
  if (p.name.length < 3) return "Product name must be at least 3 characters.";
  if (p.desc.length < 10) return "Description must be at least 10 characters.";
  if (!isValidSlug(p.slug)) {
    return "Slug may only contain lowercase letters, numbers and single hyphens.";
  }
  return null;
}

function slugExists(categories: Category[], slug: string): boolean {
  return categories.some((c) => c.products.some((p) => p.slug === slug));
}

function pruneRefs(state: CatalogState, removed: string[]): CatalogState {
  if (removed.length === 0) return state;
  return {
    ...state,
    featured: state.featured.filter((f) => !removed.includes(f.slug)),
    footerLinks: state.footerLinks.filter((l) => !removed.includes(l.slug)),
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(() => loadCatalog());
  const [storageUsed, setStorageUsed] = useState<number>(() => getStorageUsage());
  const stateRef = useRef<CatalogState>(state);

  // Applies a mutation, persists it, and only then updates React state.
  const commit = useCallback(
    (mutate: (s: CatalogState) => CatalogState | string): Result => {
      const outcome = mutate(stateRef.current);
      if (typeof outcome === "string") return { ok: false, error: outcome };

      const saved = saveCatalog(outcome);
      if (!saved.ok) return saved;

      stateRef.current = outcome;
      setState(outcome);
      setStorageUsed(getStorageUsage());
      return OK;
    },
    [],
  );

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY && e.key !== null) return;
      const next = loadCatalog();
      stateRef.current = next;
      setState(next);
      setStorageUsed(getStorageUsage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ------------------------------ categories ------------------------------ */

  const addCategory = useCallback(
    (title: string, idInput?: string): Result =>
      commit((s) => {
        const t = title.trim();
        if (t.length < 2) return "Category name must be at least 2 characters.";
        const id = slugify(idInput && idInput.trim() ? idInput : t);
        if (!id) return "Could not generate a valid category id.";
        if (s.categories.some((c) => c.id === id)) {
          return `A category with id "${id}" already exists.`;
        }
        return { ...s, categories: [...s.categories, { id, title: t, products: [] }] };
      }),
    [commit],
  );

  const renameCategory = useCallback(
    (id: string, title: string): Result =>
      commit((s) => {
        const t = title.trim();
        if (t.length < 2) return "Category name must be at least 2 characters.";
        if (!s.categories.some((c) => c.id === id)) return "Category not found.";
        return {
          ...s,
          categories: s.categories.map((c) => (c.id === id ? { ...c, title: t } : c)),
        };
      }),
    [commit],
  );

  const moveCategory = useCallback(
    (id: string, dir: -1 | 1): Result =>
      commit((s) => {
        const index = s.categories.findIndex((c) => c.id === id);
        if (index < 0) return "Category not found.";
        return { ...s, categories: swap(s.categories, index, dir) };
      }),
    [commit],
  );

  const deleteCategory = useCallback(
    (id: string, mode: DeleteCategoryMode): Result =>
      commit((s) => {
        const category = s.categories.find((c) => c.id === id);
        if (!category) return "Category not found.";

        if (mode.type === "move") {
          if (mode.targetId === id) return "Choose a different target category.";
          if (!s.categories.some((c) => c.id === mode.targetId)) {
            return "Target category not found.";
          }
          return {
            ...s,
            categories: s.categories
              .filter((c) => c.id !== id)
              .map((c) =>
                c.id === mode.targetId
                  ? { ...c, products: [...c.products, ...category.products] }
                  : c,
              ),
          };
        }

        const next: CatalogState = {
          ...s,
          categories: s.categories.filter((c) => c.id !== id),
        };
        return pruneRefs(next, category.products.map((p) => p.slug));
      }),
    [commit],
  );

  /* ------------------------------- products ------------------------------- */

  const addProduct = useCallback(
    (categoryId: string, input: Product): Result =>
      commit((s) => {
        const product = cleanProduct(input);
        const error = validateProduct(product);
        if (error) return error;
        if (!s.categories.some((c) => c.id === categoryId)) return "Choose a category.";
        if (slugExists(s.categories, product.slug)) {
          return `The slug "${product.slug}" is already used by another product.`;
        }
        return {
          ...s,
          categories: s.categories.map((c) =>
            c.id === categoryId ? { ...c, products: [...c.products, product] } : c,
          ),
        };
      }),
    [commit],
  );

  const updateProduct = useCallback(
    (originalSlug: string, categoryId: string, input: Product): Result =>
      commit((s) => {
        const product = cleanProduct(input);
        const error = validateProduct(product);
        if (error) return error;

        const source = s.categories.find((c) =>
          c.products.some((p) => p.slug === originalSlug),
        );
        if (!source) return "Product not found.";
        if (!s.categories.some((c) => c.id === categoryId)) return "Choose a category.";
        if (product.slug !== originalSlug && slugExists(s.categories, product.slug)) {
          return `The slug "${product.slug}" is already used by another product.`;
        }

        const categories = s.categories.map((c) => {
          if (source.id === categoryId) {
            if (c.id !== categoryId) return c;
            return {
              ...c,
              products: c.products.map((p) => (p.slug === originalSlug ? product : p)),
            };
          }
          if (c.id === source.id) {
            return { ...c, products: c.products.filter((p) => p.slug !== originalSlug) };
          }
          if (c.id === categoryId) {
            return { ...c, products: [...c.products, product] };
          }
          return c;
        });

        const slugChanged = product.slug !== originalSlug;
        return {
          ...s,
          categories,
          featured: slugChanged
            ? s.featured.map((f) =>
                f.slug === originalSlug ? { ...f, slug: product.slug } : f,
              )
            : s.featured,
          footerLinks: slugChanged
            ? s.footerLinks.map((l) =>
                l.slug === originalSlug ? { ...l, slug: product.slug } : l,
              )
            : s.footerLinks,
        };
      }),
    [commit],
  );

  const deleteProduct = useCallback(
    (slug: string): Result =>
      commit((s) => {
        if (!slugExists(s.categories, slug)) return "Product not found.";
        const next: CatalogState = {
          ...s,
          categories: s.categories.map((c) => ({
            ...c,
            products: c.products.filter((p) => p.slug !== slug),
          })),
        };
        return pruneRefs(next, [slug]);
      }),
    [commit],
  );

  const moveProduct = useCallback(
    (slug: string, dir: -1 | 1): Result =>
      commit((s) => {
        const category = s.categories.find((c) => c.products.some((p) => p.slug === slug));
        if (!category) return "Product not found.";
        const index = category.products.findIndex((p) => p.slug === slug);
        return {
          ...s,
          categories: s.categories.map((c) =>
            c.id === category.id ? { ...c, products: swap(c.products, index, dir) } : c,
          ),
        };
      }),
    [commit],
  );

  /* ------------------------- featured / footer links ----------------------- */

  const setFeatured = useCallback(
    (list: FeaturedItem[]): Result =>
      commit((s) => ({
        ...s,
        featured: list
          .filter((f) => f.slug)
          .map((f) => ({
            ...f,
            title: f.title.trim(),
            desc: f.desc.trim(),
            img: f.img.trim(),
          })),
      })),
    [commit],
  );

  const setFooterLinks = useCallback(
    (list: FooterLink[]): Result =>
      commit((s) => ({
        ...s,
        footerLinks: list
          .filter((l) => l.slug && l.label.trim())
          .map((l) => ({ ...l, label: l.label.trim() })),
      })),
    [commit],
  );

  /* ------------------------------ data safety ------------------------------ */

  const exportJson = useCallback(
    (): string => JSON.stringify(stateRef.current, null, 2),
    [],
  );

  const importJson = useCallback(
    (text: string): Result => {
      let raw: unknown;
      try {
        raw = JSON.parse(text);
      } catch {
        return { ok: false, error: "File is not valid JSON." };
      }
      const parsed = parseCatalog(raw);
      if (!parsed.ok) return parsed;
      return commit(() => parsed.state);
    },
    [commit],
  );

  const resetToDefaults = useCallback((): void => {
    clearCatalog();
    const seed = buildSeedState();
    stateRef.current = seed;
    setState(seed);
    setStorageUsed(getStorageUsage());
  }, []);

  const allProducts = useMemo(
    () => state.categories.flatMap((c) => c.products),
    [state.categories],
  );

  const value = useMemo<CatalogContextValue>(
    () => ({
      categories: state.categories,
      featured: state.featured,
      footerLinks: state.footerLinks,
      allProducts,
      storageUsed,
      storageLimit: STORAGE_LIMIT_CHARS,
      addCategory,
      renameCategory,
      moveCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      moveProduct,
      setFeatured,
      setFooterLinks,
      exportJson,
      importJson,
      resetToDefaults,
    }),
    [
      state,
      allProducts,
      storageUsed,
      addCategory,
      renameCategory,
      moveCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      moveProduct,
      setFeatured,
      setFooterLinks,
      exportJson,
      importJson,
      resetToDefaults,
    ],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}