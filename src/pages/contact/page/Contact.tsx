import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useContactForm } from "../hooks/useContactForm";
import { useMapModal } from "../hooks/useMapModal";
import MapModal from "../components/MapModal";
import MapPreview from "../components/MapPreview";
import ContactHeading from "../components/ContactHeading";
import ContactInfoCards from "../components/ContactInfoCards";
import ContactForm from "../components/ContactForm";

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
  const { formRef, isSending, submitStatus, handleSubmit } = useContactForm();
  const { isMapOpen, openMap, closeMap } = useMapModal();

  return (
    <div className="relative w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 md:py-20 px-4 md:px-8 hero-font selection:bg-red-100 overflow-hidden">

      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-50 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 -z-10 pointer-events-none"></div>

      {/* FLOATING MAP MODAL */}
      <MapModal isOpen={isMapOpen} onClose={closeMap} />

      {/* MAIN UNIFIED SPLIT CARD */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariant}
        className="max-w-6xl w-full bg-white rounded-[30px] shadow-2xl shadow-gray-200/60 flex flex-col lg:flex-row overflow-hidden border border-gray-100 z-10"
      >

        {/* LEFT SIDE: MAP PREVIEW & ADDRESS */}
        <MapPreview onOpen={openMap} />

        {/* RIGHT SIDE: COMPACT FORM */}
        <div className="w-full lg:w-7/12 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white relative overflow-y-auto custom-scrollbar">

          <ContactHeading />

          {/* CONTACT INFO CARDS */}
          <ContactInfoCards />

          {/* Form */}
          <ContactForm
            formRef={formRef}
            isSending={isSending}
            submitStatus={submitStatus}
            onSubmit={handleSubmit}
          />
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