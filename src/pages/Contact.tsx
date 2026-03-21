import { type FormEvent, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

// Animation Variants for smooth loading
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Lock body scroll when map modal is open
  useEffect(() => {
    if (isMapOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMapOpen]);

  // Email client redirect
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setSubmitStatus("idle");

    if (!formRef.current) return;

    try {
      const formData = new FormData(formRef.current);
      const name = formData.get("user_name") as string;
      const email = formData.get("user_email") as string;
      const phone = formData.get("user_phone") as string;
      const details = formData.get("project_details") as string;

      // Construct the email subject and body
      const subject = encodeURIComponent(`New Machinery Enquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nProject Requirements:\n${details}`);

      // Trigger the default email client to open with the pre-filled data
      window.location.href = `mailto:sharptrax@yahoo.com?subject=${subject}&body=${body}`;

      // Simulate a quick success state to provide user feedback
      setTimeout(() => {
        setSubmitStatus("success");
        formRef.current?.reset();
        setIsSending(false);
        setTimeout(() => setSubmitStatus("idle"), 6000);
      }, 800);

    } catch (error) {
      console.error("Error formatting email:", error);
      setSubmitStatus("error");
      setIsSending(false);
    }
  };

  // Google Maps Exact Location Embed URL for Sharptrax Technologies
  const mapEmbedUrl = "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Sharp%20Trax%20Technologies,%20166,%2011th%20Main%20Rd,%20SIDCO%20Industrial%20Estate,%20Thirumudivakkam,%20Chennai,%20Tamil%20Nadu%20600132&t=&z=16&ie=UTF8&iwloc=B&output=embed";

  return (
    <div className="relative w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 md:py-20 px-4 md:px-8 hero-font selection:bg-red-100 overflow-hidden">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 -z-10 pointer-events-none"></div>

      {/* FLOATING MAP MODAL */}
      <AnimatePresence>
        {isMapOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMapOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-6xl h-[75vh] md:h-[85vh] bg-white rounded-[30px] shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900">Sharptrax Technologies</h3>
                  <p className="text-sm md:text-base text-gray-500 font-medium mt-1">SIDCO Industrial Estate, Thirumudivakkam, Chennai</p>
                </div>
                <button 
                  onClick={() => setIsMapOpen(false)} 
                  className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center transition-colors border border-gray-100 shrink-0 ml-4"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="flex-1 w-full h-full bg-gray-200">
                <iframe 
                  src={mapEmbedUrl}
                  className="w-full h-full border-0" 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN UNIFIED SPLIT CARD */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={cardVariant}
        className="max-w-6xl w-full bg-white rounded-[30px] shadow-2xl shadow-gray-200/60 flex flex-col lg:flex-row overflow-hidden border border-gray-100 z-10"
      >
        
        {/* LEFT SIDE: MAP PREVIEW & ADDRESS */}
        <div 
          onClick={() => setIsMapOpen(true)}
          className="w-full lg:w-5/12 relative min-h-[350px] lg:min-h-full bg-gray-100 cursor-pointer group overflow-hidden shrink-0"
        >
          <iframe
            src={mapEmbedUrl}
            className="absolute inset-0 w-full h-full pointer-events-none group-hover:scale-105 transition-all duration-[800ms]"
            style={{ border: 0 }}
          ></iframe>
          
          <div className="absolute inset-0 bg-red-600/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
             <div className="bg-white/95 backdrop-blur px-5 py-2.5 rounded-full shadow-2xl font-bold text-red-600 text-sm translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                Click to View Map
             </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 bg-white/95 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-xl border border-white/50 transition-transform duration-500 group-hover:-translate-y-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 leading-none">Sharptrax</h3>
            </div>
            
            <p className="text-gray-600 font-medium leading-snug text-sm mb-2">
              166, 11th Main Rd, SIDCO Industrial Estate,<br/>
              Thirumudivakkam, Chennai,<br/>
              Tamil Nadu 600132
            </p>
            <a href="mailto:sharptrax@yahoo.com" className="text-red-600 font-bold text-sm hover:text-red-700 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              sharptrax@yahoo.com
            </a>
          </div>
        </div>

        {/* RIGHT SIDE: COMPACT FORM */}
        <div className="w-full lg:w-7/12 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white relative overflow-y-auto custom-scrollbar">
          
          <div className="relative z-10 mb-6">
            <span className="text-red-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-1.5 block">
              Contact Engineering
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Ready to automate your workflow?
            </h2>
          </div>

          {/* CONTACT INFO CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 relative z-10">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone Support</p>
                <a href="tel:+919840122149" className="text-gray-900 text-sm font-bold hover:text-red-600 transition-colors block">
                  +91 98401 22149
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-red-200 transition-colors">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Us</p>
                <a href="mailto:sharptrax@yahoo.com" className="text-gray-900 text-sm font-bold hover:text-red-600 transition-colors block">
                  sharptrax@yahoo.com
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 relative z-10 pb-2">
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="user_name"
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="user_email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="user_phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">
                Project Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                name="project_details"
                required
                rows={2}
                placeholder="Tell us about your machinery requirements..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all resize-none shadow-sm"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-md flex justify-center items-center gap-3 ${
                  isSending 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                    : "bg-gray-900 text-white hover:bg-red-600 active:scale-[0.98]"
                }`}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Opening Mail Client...
                  </>
                ) : (
                  "Submit Enquiry"
                )}
              </button>
            </div>

            <AnimatePresence>
              {submitStatus === "success" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 mt-3 overflow-hidden">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-green-800 text-xs font-bold">Please complete sending the email from your mail client. Thank you!</p>
                </motion.div>
              )}
              
              {submitStatus === "error" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 mt-3 overflow-hidden">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                  <p className="text-red-800 text-xs font-bold">Failed to open mail client. Please email us directly at sharptrax@yahoo.com.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </form>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
}