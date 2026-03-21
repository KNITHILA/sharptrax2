import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <>
      <div className="w-full min-h-screen bg-white hero-font">
        {/* HEADER SPACING (To clear fixed navbar) */}
        <div className="h-20 w-full bg-white"></div>

        {/* TOP HERO SECTION */}
        <section className="relative py-16 md:py-24 bg-gray-50 overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-[4px] uppercase text-red-500 font-bold mb-4"
            >
              Our Legacy
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
            >
              Engineering <br className="hidden md:block" /> Excellence
            </motion.h1>
          </div>
        </section>

        {/* CONTENT BLOCK 1: IMAGE LEFT, TEXT RIGHT */}
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
                    src="/4th-bg.svg"
                    alt="Industrial Facility"
                    className="w-100 h-120 object-cover"
                  />
                </div>
                {/* Floating Stat Card (Hidden on small mobile) - Changed to dark gray */}
                <div className="absolute -bottom-6 -right-6 bg-neutral-800 text-white p-8 rounded-xl hidden sm:block shadow-2xl">
                  <h3 className="text-4xl font-bold text-red-500">20+</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">
                    Years of Innovation
                  </p>
                </div>
              </motion.div>

              {/* TEXT COLUMN */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                  Driving the future of <br />
                  <span className="text-red-500">Industrial Automation.</span>
                </h2>

                <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed">
                  <p>
                    Established in 2005, Sharptrax Technologies has been at the
                    forefront of providing high-precision welding and cutting
                    solutions. We understand that in modern manufacturing,
                    precision isn't just a requirement—it's the foundation of
                    success.
                  </p>
                  <p>
                    Our facility in Chennai is equipped with the latest
                    engineering tools to design, prototype, and manufacture
                    Special Purpose Machines (SPMs) that solve complex
                    production challenges for the automotive and energy sectors.
                  </p>
                </div>

                {/* SMALL STATS ROW */}
                <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-900">Precision</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Micron-level accuracy in all automated welding paths.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Support</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      24/7 technical assistance for all integrated systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES / GRID SECTION - Changed to dark gray */}
        <section className="bg-neutral-800 py-20 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-16">
              Why Partners Choose Us
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
                <h3 className="text-xl font-bold mb-4 text-red-500">
                  Reliability
                </h3>
                <p className="text-sm text-gray-400">
                  Our machines are built for 24/7 operation in the most
                  demanding environments.
                </p>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
                <h3 className="text-xl font-bold mb-4 text-red-500">
                  Expertise
                </h3>
                <p className="text-sm text-gray-400">
                  Decades of cumulative engineering experience in robotic
                  integration.
                </p>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition sm:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-bold mb-4 text-red-500">
                  Innovation
                </h3>
                <p className="text-sm text-gray-400">
                  Constant R&D to bring the latest plasma and laser tech to your
                  floor.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
