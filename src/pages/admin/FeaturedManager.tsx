import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import type { FeaturedItem, FooterLink } from "../../data/siteSeed";
import { compressImage, normalizeImagePath, swap, uid } from "../../lib/catalogUtils";
import type { AdminOutletContext } from "./AdminLayout";
import { btnDanger, btnGhost, btnPrimary, btnSmall, cardCls, inputCls, labelCls } from "./adminUi";

export default function FeaturedManager() {
  const { featured, footerLinks, allProducts, setFeatured, setFooterLinks } = useCatalog();
  const { setDirty } = useOutletContext<AdminOutletContext>();

  const [cards, setCards] = useState<FeaturedItem[]>(featured);
  const [links, setLinks] = useState<FooterLink[]>(footerLinks);
  const [cardPick, setCardPick] = useState("");
  const [linkPick, setLinkPick] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const baseline = useRef(JSON.stringify({ cards: featured, links: footerLinks }));
  const uploadFor = useRef<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify({ cards, links }) !== baseline.current;

  useEffect(() => {
    setDirty(dirty);
  }, [dirty, setDirty]);

  useEffect(() => () => setDirty(false), [setDirty]);

  const slugs = new Set(allProducts.map((p) => p.slug));
  const nameOf = (slug: string) => allProducts.find((p) => p.slug === slug)?.name;

  const addCard = () => {
    const p = allProducts.find((x) => x.slug === cardPick);
    if (!p) return;
    setCards((c) => [
      ...c,
      { id: uid(), slug: p.slug, title: p.name, desc: p.desc, img: p.imgs[0] ?? "" },
    ]);
    setCardPick("");
  };

  const patchCard = (id: string, p: Partial<FeaturedItem>) =>
    setCards((c) => c.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const addLink = () => {
    const p = allProducts.find((x) => x.slug === linkPick);
    if (!p) return;
    setLinks((l) => [...l, { id: uid(), slug: p.slug, label: p.name }]);
    setLinkPick("");
  };

  const patchLink = (id: string, p: Partial<FooterLink>) =>
    setLinks((l) => l.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = uploadFor.current;
    e.target.value = "";
    if (!file || !id) return;
    try {
      const data = await compressImage(file, 600, 0.8);
      patchCard(id, { img: data });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Upload failed." });
    }
  };

  const save = () => {
    const r1 = setFeatured(cards);
    if (!r1.ok) {
      setMsg({ ok: false, text: r1.error });
      return;
    }
    const r2 = setFooterLinks(links);
    if (!r2.ok) {
      setMsg({ ok: false, text: r2.error });
      return;
    }
    baseline.current = JSON.stringify({ cards, links });
    setDirty(false);
    setMsg({ ok: true, text: "Home cards and Footer links saved." });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Home & Footer</h2>
          <p className="text-sm text-gray-500 mt-1">
            Cards pointing to a missing product are hidden on the site automatically.
          </p>
        </div>
        <button className={btnPrimary} onClick={save} disabled={!dirty}>
          Save changes
        </button>
      </div>

      {dirty && <p className="text-xs font-bold text-yellow-600">Unsaved changes</p>}

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

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      {/* HOME CARDS */}
      <section className={`${cardCls} space-y-4`}>
        <h3 className="font-black text-gray-900">Home page "Automation Solutions" cards</h3>

        <div className="flex flex-wrap gap-2">
          <select
            className={`${inputCls} flex-1 min-w-[220px]`}
            value={cardPick}
            onChange={(e) => setCardPick(e.target.value)}
          >
            <option value="">Select a product to add...</option>
            {allProducts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          <button className={btnGhost} onClick={addCard} disabled={!cardPick}>
            + Add card
          </button>
        </div>

        {cards.length === 0 && <p className="text-sm text-gray-400">No cards. The section will be empty.</p>}

        <div className="space-y-4">
          {cards.map((c, i) => {
            const missing = !slugs.has(c.slug);
            return (
              <div key={c.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Links to: {nameOf(c.slug) ?? c.slug}
                  </p>
                  <div className="flex gap-1">
                    <button
                      className={btnSmall}
                      disabled={i === 0}
                      onClick={() => setCards((x) => swap(x, i, -1))}
                    >
                      ↑
                    </button>
                    <button
                      className={btnSmall}
                      disabled={i === cards.length - 1}
                      onClick={() => setCards((x) => swap(x, i, 1))}
                    >
                      ↓
                    </button>
                    <button
                      className={btnDanger}
                      onClick={() => setCards((x) => x.filter((y) => y.id !== c.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {missing && (
                  <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded p-2">
                    Product missing: this card is hidden on the website.
                  </p>
                )}

                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    className={inputCls}
                    value={c.title}
                    onChange={(e) => patchCard(c.id, { title: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    className={`${inputCls} resize-y`}
                    rows={3}
                    value={c.desc}
                    onChange={(e) => patchCard(c.id, { desc: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Image (path or upload)</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {c.img && (
                      <img
                        src={c.img}
                        alt=""
                        className="w-12 h-12 object-contain bg-gray-50 border border-gray-200 rounded"
                      />
                    )}
                    <input
                      className={`${inputCls} flex-1 min-w-[200px]`}
                      value={c.img.startsWith("data:") ? "(uploaded image)" : c.img}
                      readOnly={c.img.startsWith("data:")}
                      onChange={(e) => patchCard(c.id, { img: normalizeImagePath(e.target.value) })}
                      placeholder="/screen5/5ma1.svg"
                    />
                    <button
                      className={btnGhost}
                      onClick={() => {
                        uploadFor.current = c.id;
                        fileRef.current?.click();
                      }}
                    >
                      Upload
                    </button>
                    {c.img && (
                      <button className={btnGhost} onClick={() => patchCard(c.id, { img: "" })}>
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty to use the product's first image.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER LINKS */}
      <section className={`${cardCls} space-y-4`}>
        <h3 className="font-black text-gray-900">Footer "Our Services" links</h3>

        <div className="flex flex-wrap gap-2">
          <select
            className={`${inputCls} flex-1 min-w-[220px]`}
            value={linkPick}
            onChange={(e) => setLinkPick(e.target.value)}
          >
            <option value="">Select a product to add...</option>
            {allProducts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          <button className={btnGhost} onClick={addLink} disabled={!linkPick}>
            + Add link
          </button>
        </div>

        {links.length === 0 && <p className="text-sm text-gray-400">No footer links.</p>}

        <ul className="space-y-2">
          {links.map((l, i) => {
            const missing = !slugs.has(l.slug);
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-lg p-2">
                <input
                  className={`${inputCls} flex-1 min-w-[180px]`}
                  value={l.label}
                  onChange={(e) => patchLink(l.id, { label: e.target.value })}
                />
                <span className={`text-xs ${missing ? "text-red-600 font-bold" : "text-gray-400"}`}>
                  {missing ? "Product missing (hidden)" : `→ ${nameOf(l.slug)}`}
                </span>
                <div className="flex gap-1">
                  <button
                    className={btnSmall}
                    disabled={i === 0}
                    onClick={() => setLinks((x) => swap(x, i, -1))}
                  >
                    ↑
                  </button>
                  <button
                    className={btnSmall}
                    disabled={i === links.length - 1}
                    onClick={() => setLinks((x) => swap(x, i, 1))}
                  >
                    ↓
                  </button>
                  <button
                    className={btnDanger}
                    onClick={() => setLinks((x) => x.filter((y) => y.id !== l.id))}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}