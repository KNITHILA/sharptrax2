import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send, Zap, PlayCircle, ArrowRight, X, ChevronRight, Settings2 } from "lucide-react";
import { categories, type Category, type Product } from "../data/servicesCatalog";
import {
  productBySlug,
  categoryBySlug,
  resolveLegacy,
  serviceUrl,
} from "../lib/serviceUrls";

interface RecommendedProduct extends Product {
  categoryId: string;
}

/* ------------------------------------------------------------------ */
/* OUTER: decides WHICH machine to show (or where to redirect)         */
/* ------------------------------------------------------------------ */
export default function Services() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  // /services/<slug>
  if (slug) {
    const product = productBySlug(slug);
    const category = categoryBySlug(slug);
    if (!product || !category) {
      return <Navigate to="/services" replace />;
    }
    return <ServiceDetail key={product.slug} product={product} category={category} />;
  }

  // /services  (maybe with legacy ?cat=&prod=)
  const params = new URLSearchParams(location.search);
  const legacy = resolveLegacy(params.get("cat"), params.get("prod"));
  if (legacy) {
    return <Navigate to={serviceUrl(legacy.slug)} replace />;
  }

  // Plain /services (or unresolvable query): show the first machine
  const defaultCategory = categories[0];
  const defaultProduct = defaultCategory.products[0];
  return (
    <ServiceDetail
      key={defaultProduct.slug}
      product={defaultProduct}
      category={defaultCategory}
    />
  );
}

/* ------------------------------------------------------------------ */
/* INNER: the existing page, now driven by props                       */
/* ------------------------------------------------------------------ */
interface ServiceDetailProps {
  product: Product;
  category: Category;
}

function ServiceDetail({ product, category }: ServiceDetailProps) {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Form / Modal State
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", details: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSending, setIsSending] = useState(false);

  // Lock background scroll when enquiry modal is open
  useEffect(() => {
    if (isEnquiryModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isEnquiryModalOpen]);

  // Scroll to top whenever the machine changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.slug]);

  // Related systems: same category (excluding current), fall back to Welding Automation
  const recommendedProducts = useMemo<RecommendedProduct[]>(() => {
    let recs: RecommendedProduct[] = category.products
      .filter((p) => p.name !== product.name)
      .map((p) => ({ ...p, categoryId: category.id }));

    if (recs.length < 3) {
      const fallbackCat =
        categories.find((c) => c.id === "welding-automation") || categories[0];
      const extraRecs = fallbackCat.products
        .filter((p) => p.name !== product.name && !recs.find((r) => r.name === p.name))
        .map((p) => ({ ...p, categoryId: fallbackCat.id }));
      recs = [...recs, ...extraRecs];
    }

    return recs.slice(0, 3);
  }, [category, product]);

  // Phase 2: Related cards still emit legacy URLs; the outer component redirects them.
  const handleRecommendationClick = (categoryId: string, productName: string) => {
    navigate(`/services?cat=${categoryId}&prod=${encodeURIComponent(productName)}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) newErrors.name = "Required (min 3 chars).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required.";
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "10-digit number required.";
    if (!formData.details.trim() || formData.details.trim().length < 10) newErrors.details = "More details needed.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSending(true);

    emailjs.send(
      "service_67r7kfg",
      "template_xwnafxs",
      {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        project_details: formData.details,
        product_interest: product.name
      },
      "9bJ_hqjsB63RMeUH0"
    ).then(() => {
      alert("Enquiry Sent Successfully!");
      setFormData({ name: "", email: "", phone: "", details: "" });
      setErrors({});
      setIsEnquiryModalOpen(false);
    }).catch(err => {
      console.error(err);
      alert("Failed to send. Please try again.");
    }).finally(() => setIsSending(false));
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] font-sans pb-20 selection:bg-red-100">
      <div className="h-20 w-full bg-white border-b border-gray-200"></div>

      {/* --- HERO BANNER --- */}
      <div className="bg-[#444f5a] py-16 px-6 border-b-4 border-yellow-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2c343f] to-transparent opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col relative z-10">
          <div className="flex items-center text-gray-100 text-sm mb-4 font-bold tracking-widest uppercase">
             <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
             <ChevronRight size={14} className="mx-2" />
             <span className="hover:text-white cursor-pointer transition-colors">Services</span>
             <ChevronRight size={14} className="mx-2" />
             <span className="text-yellow-400">{category.title}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase max-w-4xl">
            {product.name}
          </h1>
        </div>
      </div>

      {/* --- SPLIT LAYOUT SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT: Media (Image + Thumbnails + Video) - STICKY ON DESKTOP */}
          <div className="lg:col-span-7 flex flex-col lg:sticky lg:top-28">
            {/* Main Image */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-center relative w-full h-[400px] md:h-[500px] shadow-sm group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImgIndex}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={product.imgs[activeImgIndex]}
                  alt={product.name}
                  className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Strip */}
            {product.imgs.length > 1 && (
              <div className="flex gap-3 overflow-x-auto mt-4 pb-2 custom-scrollbar">
                {product.imgs.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 p-2 transition-all bg-white ${
                      activeImgIndex === idx ? "border-red-600 shadow-md ring-2 ring-red-100" : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-contain" alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}

            {/* Machine Videos */}
            {product.videos && product.videos.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-black uppercase text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                  <PlayCircle className="text-red-600" size={24} /> Video Demonstration
                </h3>
                <div className="grid gap-6">
                  {product.videos.map((vid, idx) => (
                    <div key={idx} className="bg-neutral-800 rounded-2xl aspect-video relative shadow-md border border-gray-200 overflow-hidden">
                      {vid.includes("youtube.com") || vid.includes("youtu.be") ? (
                        <iframe
                          className="w-full h-full absolute inset-0 border-0"
                          src={vid}
                          title={`${product.name} Video ${idx + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video controls className="w-full h-full absolute inset-0 object-cover" src={vid}>
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Product Information - SCROLLING ON DESKTOP */}
          <div className="lg:col-span-5 flex flex-col pt-2">

            {/* System Overview */}
            <div className="mb-10">
               <h3 className="text-2xl font-black text-gray-900 mb-4 pb-2 flex items-center gap-3 uppercase tracking-tight">
                 <Settings2 className="text-red-600" size={28} /> System Overview
               </h3>
               <p className="text-gray-600 text-lg leading-relaxed font-medium">
                 {product.desc}
               </p>
            </div>

            {/* Key Features List */}
            {product.features && (
              <div className="mb-12">
                <h3 className="text-2xl font-black text-gray-900 mb-6 pb-2 flex items-center gap-3 uppercase tracking-tight">
                  <Zap className="text-red-600" size={28} /> Specifications
                </h3>
                <ul className="space-y-4">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-red-300 transition-colors">
                      <CheckCircle2 className="text-red-600 shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700 font-medium leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final CTA Button placed cleanly at the bottom */}
            <div className="mt-auto border-t border-gray-200 pt-8 pb-4">
               <h4 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-widest text-center">Interested in this system?</h4>
               <button
                 onClick={() => setIsEnquiryModalOpen(true)}
                 className="w-full py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 text-base bg-red-600 text-white hover:bg-red-700 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
               >
                 <Send size={20} /> Enquire Now
               </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- RECOMMENDED MACHINES SECTION --- */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-red-600 font-bold uppercase tracking-widest text-xs mb-1 block">Keep Exploring</span>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                Related Systems
              </h3>
            </div>
            <span className="hidden md:flex text-sm font-bold text-red-600 cursor-pointer hover:text-red-700 transition-colors items-center gap-1" onClick={() => navigate("/gallery")}>
              View Full Catalog <ArrowRight size={16}/>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedProducts.map((prod, idx) => (
              <div
                key={idx}
                onClick={() => handleRecommendationClick(prod.categoryId, prod.name)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col"
              >
                <div className="h-56 w-full bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                  <img
                    src={prod.imgs[0]}
                    alt={prod.name}
                    className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-black text-gray-900 text-lg uppercase leading-snug group-hover:text-red-600 transition-colors mb-4">
                    {prod.name}
                  </h4>
                  <div className="mt-auto flex items-center text-gray-400 font-bold text-xs uppercase tracking-widest group-hover:text-red-600 transition-colors">
                    Explore Specifications <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ENQUIRY MODAL POPUP --- */}
      <AnimatePresence>
        {isEnquiryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-md"
            onClick={() => setIsEnquiryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-10 shadow-2xl relative border-t-[6px] border-red-600"
            >
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-md flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">Enquiry</h3>
              <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                Regarding: <strong className="text-red-600 font-bold">{product.name}</strong>
              </p>

              <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`} />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`} />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`} />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Requirements</label>
                  <textarea name="details" rows={4} value={formData.details} onChange={handleInputChange}
                    className={`w-full bg-gray-50 border p-3.5 rounded-lg text-sm font-medium focus:outline-none resize-none transition-all ${errors.details ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500 focus:bg-white'}`}></textarea>
                  {errors.details && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.details}</p>}
                </div>

                <button type="submit" disabled={isSending}
                  className={`w-full py-4 mt-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg text-sm ${isSending ? "bg-gray-400 text-white cursor-not-allowed" : "bg-black text-white hover:bg-red-600 active:scale-[0.98]"}`}>
                  <Send size={18} /> {isSending ? "Sending..." : "Submit Enquiry"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}} />
    </div>
  );
}