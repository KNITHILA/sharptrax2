import { motion } from "framer-motion";
import { heroContent } from "../data/aboutContent";

export default function AboutHero() {
  return (
    <section className="relative py-16 md:py-24 bg-gray-50 overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs tracking-[4px] uppercase text-red-500 font-bold mb-4"
        >
          {heroContent.eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
        >
          {heroContent.titleLine1} <br className="hidden md:block" />{" "}
          {heroContent.titleLine2}
        </motion.h1>
      </div>
    </section>
  );
}