import { motion, AnimatePresence } from "framer-motion";
import { MAP_EMBED_URL, mapModalContent } from "../data/contactContent";
import { CrossIcon } from "./ContactIcons";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                <h3 className="text-xl md:text-2xl font-black text-gray-900">{mapModalContent.title}</h3>
                <p className="text-sm md:text-base text-gray-500 font-medium mt-1">{mapModalContent.subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center transition-colors border border-gray-100 shrink-0 ml-4"
              >
                <CrossIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 w-full h-full bg-gray-200">
              <iframe
                src={MAP_EMBED_URL}
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
  );
}