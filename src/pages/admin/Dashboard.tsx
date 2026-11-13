import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import {
  buildWordPressCsv,
  buildWordPressJson,
  downloadTextFile,
} from "../../lib/catalogUtils";
import { btnDanger, btnGhost, btnPrimary, cardCls } from "./adminUi";

export default function Dashboard() {
  const {
    categories,
    allProducts,
    featured,
    footerLinks,
    storageUsed,
    storageLimit,
    exportJson,
    importJson,
    resetToDefaults,
  } = useCatalog();

  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const pct = Math.min(100, Math.round((storageUsed / storageLimit) * 100));
  const stamp = new Date().toISOString().slice(0, 10);

  const handleExport = () => {
    downloadTextFile(`sharptrax-catalog-${stamp}.json`, exportJson(), "application/json");
    setMsg({ ok: true, text: "Backup downloaded." });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!window.confirm("Importing replaces ALL current catalog data. Continue?")) return;
    const text = await file.text();
    const result = importJson(text);
    setMsg(
      result.ok
        ? { ok: true, text: "Catalog imported successfully." }
        : { ok: false, text: result.error },
    );
  };

  const handleReset = () => {
    if (!window.confirm("Reset everything to the original factory data? This cannot be undone.")) return;
    resetToDefaults();
    setMsg({ ok: true, text: "Catalog reset to defaults." });
  };

  const stats = [
    { label: "Categories", value: categories.length },
    { label: "Products", value: allProducts.length },
    { label: "Home cards", value: featured.length },
    { label: "Footer links", value: footerLinks.length },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Changes are saved in this browser and appear on the website instantly.
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={cardCls}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-4xl font-black text-red-600 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className={cardCls}>
        <h3 className="font-black text-gray-900 mb-3">Quick actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products/new" className={btnPrimary}>
            + Add Product
          </Link>
          <Link to="/admin/categories" className={btnGhost}>
            Manage Categories
          </Link>
          <Link to="/admin/products" className={btnGhost}>
            Manage Products
          </Link>
          <Link to="/admin/featured" className={btnGhost}>
            Home & Footer
          </Link>
        </div>
      </div>

  

      <div className={cardCls}>
        <h3 className="font-black text-gray-900 mb-1">Data safety</h3>
        <p className="text-xs text-gray-500 mb-4">
          Export a JSON backup regularly. Data lives only in this browser until exported.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className={btnPrimary} onClick={handleExport}>
            Export JSON backup
          </button>
          <button className={btnGhost} onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
          <button className={btnDanger} onClick={handleReset}>
            Reset to defaults
          </button>
        </div>
      </div>

      <div className={cardCls}>
        <h3 className="font-black text-gray-900 mb-1">WordPress handoff</h3>
        <p className="text-xs text-gray-500 mb-4">
          Flat export: one row per product with category, slug, order, description,
          specifications, image filenames and videos.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className={btnGhost}
            onClick={() =>
              downloadTextFile(
                `sharptrax-wordpress-${stamp}.csv`,
                buildWordPressCsv(categories),
                "text/csv",
              )
            }
          >
            Download CSV
          </button>
          <button
            className={btnGhost}
            onClick={() =>
              downloadTextFile(
                `sharptrax-wordpress-${stamp}.json`,
                buildWordPressJson(categories),
                "application/json",
              )
            }
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
}