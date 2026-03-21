import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const industries = [
  {
    id: "heavy-engineering",
    title: "Heavy Engineering",
    desc: "Sharptrax Technologies delivers robust welding automation and heavy-duty material handling systems engineered for large-scale industrial fabrication. We specialize in solutions that ensure maximum structural integrity and micron-level precision for massive components, meeting the rigorous safety and quality standards required in heavy engineering environments.",
    img: "/industries/heavy.jpg",
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    desc: "We empower modern production facilities by integrating high-speed robotic cells and specialized automated machinery. Our solutions are designed to eliminate production bottlenecks, increase throughput, and ensure 100% weld consistency across mass-production cycles, significantly reducing operational overhead and material waste.",
    img: "/industries/manufacturing.jpg",
  },
  {
    id: "power-energy",
    title: "Power & Energy",
    desc: "In the high-stakes Energy sector, precision is non-negotiable. Sharptrax provides advanced welding systems for the fabrication of pressure vessels, steam turbines, and renewable energy infrastructure. Our technology is optimized for high-strength alloys and critical joints that must perform under extreme thermal and pressure conditions.",
    img: "/industries/power.jpg",
  },
  {
    id: "automotive",
    title: "Automotive",
    desc: "Accelerate your assembly line with our precision-driven automotive welding solutions. From complex chassis fabrication to delicate component assembly, our robotic integration and high-speed positioning units offer the repeatability and cycle-time efficiency required by global automotive OEMs and Tier-1 suppliers.",
    img: "/industries/automotive.jpg",
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    desc: "We support large-scale infrastructure growth with automated welding systems tailored for bridge girders, railway components, and architectural steelwork. Our machines are built to handle high-volume structural fabrication, ensuring that every weld meets the stringent durability requirements of civil engineering projects.",
    img: "/industries/infra.jpg",
  },
  {
    id: "special-machinery",
    title: "Special Machinery",
    desc: "Where standard solutions fall short, our engineering team excels. We design and build custom Special Purpose Machines (SPMs) to solve unique, complex manufacturing challenges. By combining custom software with innovative mechanical design, we create proprietary systems that give our clients a distinct competitive advantage.",
    img: "/industries/special.jpg",
  },
];

export default function Industries() {
  const [activeInd, setActiveInd] = useState(industries[0]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const indId = params.get("type");
    if (indId) {
      const selected = industries.find((i) => i.id === indId);
      if (selected) setActiveInd(selected);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-white hero-font pb-20">
      <div className="h-20 w-full bg-white"></div>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-12 uppercase tracking-tight text-gray-900">
          Industries We Serve
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-2">
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setActiveInd(ind)}
                className={`text-left px-6 py-4 rounded-2xl font-bold transition-all border ${
                  activeInd.id === ind.id
                    ? "bg-black text-white border-black shadow-lg"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300"
                }`}
              >
                {ind.title}
              </button>
            ))}
          </div>

          {/* Dynamic Content Display */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeInd.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-50 rounded-[40px] p-8 md:p-12 border border-gray-100 min-h-125"
              >
                <div className="w-full h-64 md:h-80 bg-gray-200 rounded-3xl mb-8 overflow-hidden">
                  <img
                    src={activeInd.img}
                    alt={activeInd.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {activeInd.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  {activeInd.desc}
                </p>
                <div className="mt-10"></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
