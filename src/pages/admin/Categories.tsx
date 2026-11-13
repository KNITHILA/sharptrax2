import { useState } from "react";
import { useCatalog } from "../../context/CatalogContext";
import type { Category } from "../../data/servicesCatalog";
import { btnDanger, btnGhost, btnPrimary, btnSmall, cardCls, inputCls, labelCls } from "./adminUi";

export default function Categories() {
  const { categories, addCategory, renameCategory, moveCategory, deleteCategory } = useCatalog();

  const [newTitle, setNewTitle] = useState("");
  const [newId, setNewId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [mode, setMode] = useState<"delete" | "move">("move");
  const [targetId, setTargetId] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const report = (r: { ok: true } | { ok: false; error: string }, okText: string) =>
    setMsg(r.ok ? { ok: true, text: okText } : { ok: false, text: r.error });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const r = addCategory(newTitle, newId);
    report(r, "Category added.");
    if (r.ok) {
      setNewTitle("");
      setNewId("");
    }
  };

  const startRename = (c: Category) => {
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const saveRename = (id: string) => {
    const r = renameCategory(id, editTitle);
    report(r, "Category renamed.");
    if (r.ok) setEditingId(null);
  };

  const startDelete = (c: Category) => {
    setDeleting(c);
    const other = categories.find((x) => x.id !== c.id);
    setTargetId(other?.id ?? "");
    setMode(c.products.length > 0 && other ? "move" : "delete");
  };

  const confirmDelete = () => {
    if (!deleting) return;
    const r =
      mode === "move"
        ? deleteCategory(deleting.id, { type: "move", targetId })
        : deleteCategory(deleting.id, { type: "delete" });
    report(r, "Category deleted.");
    if (r.ok) setDeleting(null);
  };

  const others = deleting ? categories.filter((c) => c.id !== deleting.id) : [];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Categories</h2>
        <p className="text-sm text-gray-500 mt-1">
          Order here is the order shown in the Navbar, mobile menu and Gallery.
        </p>
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

      <form onSubmit={handleAdd} className={`${cardCls} grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end`}>
        <div>
          <label className={labelCls}>Category name</label>
          <input
            className={inputCls}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Laser Cutting"
          />
        </div>
        <div>
          <label className={labelCls}>ID (optional)</label>
          <input
            className={inputCls}
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="auto from name"
          />
        </div>
        <button type="submit" className={btnPrimary}>
          + Add
        </button>
      </form>

      <div className={`${cardCls} p-0 divide-y divide-gray-100`}>
        {categories.length === 0 && (
          <p className="p-5 text-sm text-gray-400">No categories yet.</p>
        )}
        {categories.map((c, i) => (
          <div key={c.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="flex gap-1">
              <button
                className={btnSmall}
                disabled={i === 0}
                onClick={() => moveCategory(c.id, -1)}
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                className={btnSmall}
                disabled={i === categories.length - 1}
                onClick={() => moveCategory(c.id, 1)}
                aria-label="Move down"
              >
                ↓
              </button>
            </div>

            <div className="flex-1 min-w-[200px]">
              {editingId === c.id ? (
                <input
                  className={inputCls}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename(c.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <>
                  <p className="font-bold text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-400">
                    id: {c.id} · {c.products.length} product{c.products.length === 1 ? "" : "s"}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {editingId === c.id ? (
                <>
                  <button className={btnPrimary} onClick={() => saveRename(c.id)}>
                    Save
                  </button>
                  <button className={btnGhost} onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className={btnGhost} onClick={() => startRename(c)}>
                    Rename
                  </button>
                  <button className={btnDanger} onClick={() => startDelete(c)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {deleting && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-black text-gray-900">Delete "{deleting.title}"?</h3>

            {deleting.products.length > 0 ? (
              <>
                <p className="text-sm text-gray-600">
                  This category has {deleting.products.length} product
                  {deleting.products.length === 1 ? "" : "s"}. Choose what happens to them.
                </p>

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="radio"
                    checked={mode === "move"}
                    disabled={others.length === 0}
                    onChange={() => setMode("move")}
                    className="mt-1"
                  />
                  <span>
                    <strong>Move products</strong> to another category
                  </span>
                </label>
                {mode === "move" && (
                  <select
                    className={inputCls}
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                  >
                    {others.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.title}
                      </option>
                    ))}
                  </select>
                )}

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="radio"
                    checked={mode === "delete"}
                    onChange={() => setMode("delete")}
                    className="mt-1"
                  />
                  <span>
                    <strong className="text-red-600">Delete products too</strong> (also removes
                    their Home cards and Footer links)
                  </span>
                </label>
              </>
            ) : (
              <p className="text-sm text-gray-600">This category is empty and will be removed.</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button className={btnGhost} onClick={() => setDeleting(null)}>
                Cancel
              </button>
              <button
                className={btnDanger}
                onClick={confirmDelete}
                disabled={mode === "move" && !targetId}
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}