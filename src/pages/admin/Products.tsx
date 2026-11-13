import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { btnDanger, btnGhost, btnPrimary, btnSmall, cardCls, inputCls } from "./adminUi";

export default function Products() {
  const { categories, deleteProduct, moveProduct } = useCatalog();

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => categoryId === "all" || c.id === categoryId)
      .flatMap((c) =>
        c.products.map((p, index) => ({
          product: p,
          category: c,
          index,
          count: c.products.length,
        })),
      )
      .filter(
        ({ product }) =>
          !q ||
          product.name.toLowerCase().includes(q) ||
          product.slug.toLowerCase().includes(q),
      );
  }, [categories, query, categoryId]);

  // Reordering only makes sense inside one category with no search applied.
  const canReorder = categoryId !== "all" && query.trim() === "";

  const handleDelete = (slug: string, name: string) => {
    if (
      !window.confirm(
        `Delete "${name}"? Its page, Home card and Footer link will be removed. This cannot be undone.`,
      )
    )
      return;
    const r = deleteProduct(slug);
    setMsg(r.ok ? { ok: true, text: "Product deleted." } : { ok: false, text: r.error });
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a category to enable reordering with the arrows.
          </p>
        </div>
        <Link to="/admin/products/new" className={btnPrimary}>
          + Add Product
        </Link>
      </div>

      {msg && (
        <p
          className={`text-sm font-bold rounded-lg p-3 border ${
            msg.ok
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className={`${cardCls} grid gap-3 md:grid-cols-[1fr_260px]`}>
        <input
          className={inputCls}
          placeholder="Search by name or slug..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={inputCls}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className={`${cardCls} p-0 overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              {canReorder && <th className="p-3 w-20">Order</th>}
              <th className="p-3 w-16">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-center">Imgs</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
            {rows.map(({ product, category, index, count }) => (
              <tr key={product.slug} className="hover:bg-gray-50">
                {canReorder && (
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        className={btnSmall}
                        disabled={index === 0}
                        onClick={() => moveProduct(product.slug, -1)}
                      >
                        ↑
                      </button>
                      <button
                        className={btnSmall}
                        disabled={index === count - 1}
                        onClick={() => moveProduct(product.slug, 1)}
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                )}
                <td className="p-3">
                  {product.imgs[0] ? (
                    <img
                      src={product.imgs[0]}
                      alt=""
                      className="w-12 h-12 object-contain bg-gray-50 border border-gray-200 rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded" />
                  )}
                </td>
                <td className="p-3">
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-400">/services/{product.slug}</p>
                </td>
                <td className="p-3 text-gray-600">{category.title}</td>
                <td className="p-3 text-center text-gray-600">{product.imgs.length}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/services/${product.slug}`} target="_blank" className={btnGhost}>
                      View
                    </Link>
                    <Link to={`/admin/products/edit/${product.slug}`} className={btnGhost}>
                      Edit
                    </Link>
                    <button
                      className={btnDanger}
                      onClick={() => handleDelete(product.slug, product.name)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}