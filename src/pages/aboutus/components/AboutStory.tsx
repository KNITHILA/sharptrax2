import { motion } from "framer-motion";
import { storyContent } from "../data/aboutContent";

export default function AboutStory() {
  const { image, stat, headingLead, headingAccent, paragraphs, highlights } =
    storyContent;

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* IMAGE COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={image.src}
                alt={image.alt}
                className="w-100 h-120 object-cover"
              />
            </div>
            {/* Floating Stat Card (Hidden on small mobile) - Changed to dark gray */}
            <div className="absolute -bottom-6 -right-6 bg-neutral-800 text-white p-8 rounded-xl hidden sm:block shadow-2xl">
              <h3 className="text-4xl font-bold text-red-500">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                {stat.label}
              </p>
            </div>
          </motion.div>

          {/* TEXT COLUMN */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {headingLead} <br />
              <span className="text-red-500">{headingAccent}</span>
            </h2>

            <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed">
              {paragraphs.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </div>

            {/* SMALL STATS ROW */}
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-gray-100">
              {highlights.map((item) => (
                <div key={item.title}>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}