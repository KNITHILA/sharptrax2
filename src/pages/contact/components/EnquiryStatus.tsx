import { motion, AnimatePresence } from "framer-motion";
import { statusMessages } from "../data/contactContent";
import type { SubmitStatus } from "../hooks/useContactForm";
import { CheckIcon, CrossIcon } from "./ContactIcons";

interface EnquiryStatusProps {
  status: SubmitStatus;
}

export default function EnquiryStatus({ status }: EnquiryStatusProps) {
  return (
    <AnimatePresence>
      {status === "success" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 mt-3 overflow-hidden">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
            <CheckIcon className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-green-800 text-xs font-bold">{statusMessages.success}</p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 mt-3 overflow-hidden">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <CrossIcon className="w-4 h-4 text-red-600" strokeWidth="2.5" />
          </div>
          <p className="text-red-800 text-xs font-bold">{statusMessages.error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}