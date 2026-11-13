import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import type { Product } from "../../data/servicesCatalog";
import {
  compressImage,
  normalizeImagePath,
  normalizeVideoUrl,
  slugify,
  swap,
} from "../../lib/catalogUtils";
import type { AdminOutletContext } from "./AdminLayout";
import { btnDanger, btnGhost, btnPrimary, btnSmall, cardCls, inputCls, labelCls } from "./adminUi";

interface FormState {
  categoryId: string;
  name: string;
  slug: string;
  desc: string;
  features: string;
  imgs: string[];
  videos: string[];
}

export default function ProductForm() {
  const { slug } = useParams<{ slug: string }>();
  return <ProductFormInner key={slug ?? "new"} originalSlug={slug ?? null} />;
}

function ProductFormInner({ originalSlug }: { originalSlug: string | null }) {
  const { categories, addProduct, updateProduct } = useCatalog();
  const { setDirty } = useOutletContext<AdminOutletContext>();
  const navigate = useNavigate();
  const isEdit = originalSlug !== null;

  const existing = (() => {
    if (!originalSlug) return null;
    for (const c of categories) {
      const p = c.products.find((x) => x.slug === originalSlug);
      if (p) return { product: p, categoryId: c.id };
    }
    return null;
  })();

  const [initial] = useState<FormState>(() => ({
    categoryId: existing?.categoryId ?? categories[0]?.id ?? "",
    name: existing?.product.name ?? "",
    slug: existing?.product.slug ?? "",
    desc: existing?.product.desc ?? "",
    features: (existing?.product.features ?? []).join("\n"),
    imgs: existing?.product.imgs ?? [],
    videos: existing?.product.videos ?? [],
  }));
  const initialJson = useRef(JSON.stringify(initial));

  const [form, setForm] = useState<FormState>(initial);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [imgInput, setImgInput] = useState("");
  const [vidInput, setVidInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(form) !== initialJson.current;

  useEffect(() => {
    setDirty(dirty);
  }, [dirty, setDirty]);

  useEffect(() => () => setDirty(false), [setDirty]);

  const patch = (p: Partial<FormState>) => {
    setError(null);
    setForm((f) => ({ ...f, ...p }));
  };

  if (isEdit && !existing) {
    return (
      <div className={`${cardCls} max-w-xl`}>
        <h2 className="text-xl font-black text-gray-900 mb-2">Product not found</h2>
        <p className="text-sm text-gray-500 mb-4">It may have been deleted or renamed.</p>
        <Link to="/admin/products" className={btnPrimary}>
          Back to products
        </Link>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`${cardCls} max-w-xl`}>
        <h2 className="text-xl font-black text-gray-900 mb-2">Create a category first</h2>
        <p className="text-sm text-gray-500 mb-4">Products must belong to a category.</p>
        <Link to="/admin/categories" className={btnPrimary}>
          Go to categories
        </Link>
      </div>
    );
  }

  const onName = (name: string) => {
    patch(slugTouched ? { name } : { name, slug: slugify(name) });
  };

  const addImagePath = () => {
    const path = normalizeImagePath(imgInput);
    if (!path) return;
    patch({ imgs: [...form.imgs, path] });
    setImgInput("");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    const added: string[] = [];
    const errors: string[] = [];
    for (const file of files) {
      try {
        added.push(await compressImage(file));
      } catch (err) {
        errors.push(err instanceof Error ? err.message : "Upload failed.");
      }
    }
    setForm((f) => ({ ...f, imgs: [...f.imgs, ...added] }));
    setError(errors.length ? errors.join(" ") : null);
    setUploading(false);
  };

  const addVideo = () => {
    const url = normalizeVideoUrl(vidInput);
    if (!url) return;
    patch({ videos: [...form.videos, url] });
    setVidInput("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      slug: form.slug,
      name: form.name,
      desc: form.desc,
      imgs: form.imgs,
      features: form.features.split("\n"),
      videos: form.videos,
    };
    const result =
      isEdit && originalSlug
        ? updateProduct(originalSlug, form.categoryId, product)
        : addProduct(form.categoryId, product);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDirty(false);
    navigate("/admin/products");
  };

  const handleCancel = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setDirty(false);
    navigate("/admin/products");
  };

  const slugChanged = isEdit && originalSlug !== form.slug;
  const imgChars = form.imgs.reduce((n, s) => n + (s.startsWith("data:") ? s.length : 0), 0);

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>
        {dirty && <p className="text-xs font-bold text-yellow-600 mt-1">Unsaved changes</p>}
      </div>

      {error && (
        <p className="text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      {/* BASICS */}
      <div className={`${cardCls} space-y-4`}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Category</label>
            <select
              className={inputCls}
              value={form.categoryId}
              onChange={(e) => patch({ categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Product name</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => onName(e.target.value)}
              placeholder="e.g. Laser Welding Machine"
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>URL slug</label>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              patch({ slug: e.target.value.toLowerCase() });
            }}
            placeholder="laser-welding-machine"
          />
          <p className="text-xs text-gray-400 mt-1">
            Page address: /services/{form.slug || "your-slug"} (lowercase letters, numbers, hyphens)
          </p>
          {slugChanged && (
            <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
              Changing the slug changes the product URL. Old links and bookmarks will stop working.
            </p>
          )}
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            className={`${inputCls} resize-y`}
            rows={5}
            value={form.desc}
            onChange={(e) => patch({ desc: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Specifications (one per line)</label>
          <textarea
            className={`${inputCls} resize-y`}
            rows={6}
            value={form.features}
            onChange={(e) => patch({ features: e.target.value })}
            placeholder={"Load capacity: 5 to 200 tonnes\nVariable speed rotation"}
          />
        </div>
      </div>

      {/* IMAGES */}
      <div className={`${cardCls} space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-black text-gray-900">Images</h3>
          <span className="text-xs text-gray-400">First image is the main / cover image</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            className={`${inputCls} flex-1 min-w-[220px]`}
            value={imgInput}
            onChange={(e) => setImgInput(e.target.value)}
            placeholder="/servicemachines/folder/image.jpg or https://..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImagePath();
              }
            }}
          />
          <button type="button" className={btnGhost} onClick={addImagePath}>
            Add path
          </button>
          <button
            type="button"
            className={btnGhost}
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Compressing..." : "Upload images"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {imgChars > 0 && (
          <p className="text-xs text-gray-500">
            Uploaded images use about {imgChars.toLocaleString()} characters of browser storage.
          </p>
        )}

        {form.imgs.length === 0 ? (
          <p className="text-sm text-gray-400">No images added.</p>
        ) : (
          <ul className="space-y-2">
            {form.imgs.map((src, i) => (
              <li
                key={`${i}-${src.slice(0, 40)}`}
                className="flex items-center gap-3 border border-gray-200 rounded-lg p-2"
              >
                <img src={src} alt="" className="w-14 h-14 object-contain bg-gray-50 rounded" />
                <p className="flex-1 min-w-0 text-xs text-gray-500 truncate">
                  {src.startsWith("data:") ? "Uploaded image" : src}
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={btnSmall}
                    disabled={i === 0}
                    onClick={() => patch({ imgs: swap(form.imgs, i, -1) })}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btnSmall}
                    disabled={i === form.imgs.length - 1}
                    onClick={() => patch({ imgs: swap(form.imgs, i, 1) })}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => patch({ imgs: form.imgs.filter((_, x) => x !== i) })}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* VIDEOS */}
      <div className={`${cardCls} space-y-4`}>
        <h3 className="font-black text-gray-900">Videos</h3>
        <div className="flex flex-wrap gap-2">
          <input
            className={`${inputCls} flex-1 min-w-[220px]`}
            value={vidInput}
            onChange={(e) => setVidInput(e.target.value)}
            placeholder="YouTube link or /servicemachines/folder/video.mp4"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addVideo();
              }
            }}
          />
          <button type="button" className={btnGhost} onClick={addVideo}>
            Add video
          </button>
        </div>
        <p className="text-xs text-gray-400">
          YouTube watch, short and youtu.be links are converted to embed links automatically.
        </p>

        {form.videos.length === 0 ? (
          <p className="text-sm text-gray-400">No videos added.</p>
        ) : (
          <ul className="space-y-2">
            {form.videos.map((v, i) => (
              <li key={`${i}-${v}`} className="flex items-center gap-3 border border-gray-200 rounded-lg p-2">
                <p className="flex-1 min-w-0 text-xs text-gray-600 truncate">{v}</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={btnSmall}
                    disabled={i === 0}
                    onClick={() => patch({ videos: swap(form.videos, i, -1) })}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btnSmall}
                    disabled={i === form.videos.length - 1}
                    onClick={() => patch({ videos: swap(form.videos, i, 1) })}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => patch({ videos: form.videos.filter((_, x) => x !== i) })}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary} disabled={uploading}>
          {isEdit ? "Save changes" : "Create product"}
        </button>
        <button type="button" className={btnGhost} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}