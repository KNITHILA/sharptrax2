import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// --- DATA ---
const heroVideos = [
  "/welding.mp4",
];

const solutions = [
  {
    title: "Robotic Automation",
    categoryId: "welding-automation",
    desc: "At Sharptrax Technologies, we design and integrate robotic welding systems that deliver consistent weld quality, improved productivity, and reduced manual dependency.",
    img: "/screen5/5ma1.svg",
  },
  {
    title: "Welding Positioners",
    categoryId: "welding-positioners",
    desc: "Custom-built welding positioners designed to improve accessibility, accuracy, and productivity in complex welding applications.",
    img: "/screen5/5ma2.svg",
  },
  {
    title: "Plasma Transferred Arc Welding System",
    categoryId: "welding-automation",
    desc: "Our PTA welding systems provide precise hardfacing and cladding solutions with superior material control and repeatability.",
    img: "/screen5/5ma3.svg",
  },
  {
    title: "Plasma CNC Machine",
    categoryId: "cnc-cutting",
    desc: "Automated CNC cutting solutions delivering accuracy, efficiency, and clean cuts for industrial fabrication requirements.",
    img: "/screen5/5ma4.svg",
  },
  {
    title: "Welding Rotator",
    categoryId: "welding-automation",
    desc: "Engineered for safe and efficient rotation of cylindrical components, ensuring uniform weld quality and operator safety.",
    img: "/screen5/5ma5.svg",
  },
  {
    title: "Port Welding Machine SPM",
    categoryId: "welding-automation",
    desc: "Tailor-made automation and welding SPMs designed to meet unique production and process requirements.",
    img: "/screen5/5ma6.svg",
  },
];

const logos = [
  "/companylogo/logo (1).svg",
  "/companylogo/logo (2).svg",
  "/companylogo/logo (3).svg",
  "/companylogo/logo (4).svg",
  "/companylogo/logo (5).svg",
  "/companylogo/logo (6).png",
  "/companylogo/logo (7).svg",
  "/companylogo/logo (8).svg",
  "/companylogo/logo (9).svg",
  "/companylogo/logo (10).svg",
  "/companylogo/logo (11).svg",
  "/companylogo/logo (12).svg",
  "/companylogo/logo (13).svg",
  "/companylogo/logo (14).svg",
  "/companylogo/logo (15).svg",
  "/companylogo/logo (16).svg",
  "/companylogo/logo (17).svg",
  "/companylogo/logo (18).svg",
];

const faqs = [
  {
    question: "What Industries Do You Serve With Your Automation Solutions?",
    answer:
      "We provide automation solutions for industries including automotive, heavy manufacturing, fabrication, energy, and industrial production.",
  },
  {
    question: "Do You Offer Customized Welding Automation Solutions?",
    answer:
      "Yes. We specialize in designing fully customized welding automation systems tailored to your production needs.",
  },
  {
    question: "Can You Integrate Automation With Existing Industrial Systems?",
    answer:
      "Our automation solutions are built to integrate seamlessly with existing machines and production lines.",
  },
  {
    question: "How Can I Request A Consultation Or Quote?",
    answer:
      "You can submit a quote request through our website form or contact our engineering team directly.",
  },
];

const testimonials = [
  {
    id: 1,
    name: "GANESAN",
    role: "Regional Markets Executive",
    text: "Their robotic welding solutions helped us reduce manual errors and increase output. Sharptrax is our go-to partner for all automation needs!",
    imgSrc: "/ceoimg.png", 
    initial: "G",
    bgColor: "bg-blue-600",
  },
  {
    id: 2,
    name: "Ram Kumar",
    role: "Client",
    text: "Sharptrax Technologies provided us with a seamless welding automation system that significantly improved our production efficiency. Their expertise and customer support are exceptional!",
    imgSrc: "", 
    initial: "R",
    bgColor: "bg-slate-400",
  },
  {
    id: 3,
    name: "Elstin S",
    role: "Client",
    text: "We integrated their solutions into our plant, and the results were outstanding! The precision and reliability of their systems are truly commendable.",
    imgSrc: "", 
    initial: "E",
    bgColor: "bg-gray-600",
  },
  {
    id: 4,
    name: "Helana",
    role: "Client",
    text: "We have been working with Sharptrax for years, and their dedication to quality and innovation is unmatched. Highly recommend their services!",
    imgSrc: "", 
    initial: "H",
    bgColor: "bg-blue-500",
  },
  {
    id: 5,
    name: "Peter Amala Anand",
    role: "Client",
    text: "The team at Sharptrax Technologies understands automation like no other. Their custom-built systems were a game-changer for our manufacturing unit.",
    imgSrc: "", 
    initial: "P",
    bgColor: "bg-gray-700",
  },
];

const row1 = logos.slice(0, 9);
const row2 = logos.slice(9, 18);

// --- MAIN COMPONENT ---
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  
  // Video Slider State
  const [currentVideo] = useState(0);

  const [openForm, setOpenForm] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerCity: "",
    customerPhone: "",
    projectMessage: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    customerName?: string;
    customerEmail?: string;
    customerCity?: string;
    customerPhone?: string;
    projectMessage?: string;
  }>({});
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-slide video timer (Wait 30 seconds, then slide perfectly
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HANDLERS ---
  const handleQuoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateQuoteForm();
    setValidationErrors(errors);

    // If no errors, proceed to send email
    if (Object.keys(errors).length === 0) {
      setIsSending(true);

      if (form.current) {
        emailjs
          .sendForm(
            "service_67r7kfg", // Service ID
            "template_xwnafxs", // Template ID
            form.current,
            "9bJ_hqjsB63RMeUH0" // Public Key
          )
          .then(() => {
            alert("Enquiry sent! We will get back to you soon.");
            form.current?.reset();
            setQuoteFormData({
              customerName: "",
              customerEmail: "",
              customerCity: "",
              customerPhone: "",
              projectMessage: "",
            });
            setOpenForm(false);
          })
          .catch((error) => {
            alert("Oops! Something went wrong.");
            console.error("Error:", error.text);
          })
          .finally(() => {
            setIsSending(false);
          });
      }
    }
  };

  const handleQuoteInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuoteFormData({
      ...quoteFormData,
      [e.target.name]: e.target.value,
    });
  };

  const validateQuoteForm = () => {
    let errors: {
      customerName?: string;
      customerEmail?: string;
      customerCity?: string;
      customerPhone?: string;
      projectMessage?: string;
    } = {};

    if (!quoteFormData.customerName.trim())
      errors.customerName = "Name is required";

    if (!quoteFormData.customerEmail.trim()) {
      errors.customerEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(quoteFormData.customerEmail)) {
      errors.customerEmail = "Invalid email";
    }

    if (!quoteFormData.customerCity.trim())
      errors.customerCity = "City is required";

    if (!quoteFormData.customerPhone.trim()) {
      errors.customerPhone = "Phone number required";
    } else if (!/^\d{10}$/.test(quoteFormData.customerPhone)) {
      errors.customerPhone = "Number must be 10 digits";
    }

    if (!quoteFormData.projectMessage.trim())
      errors.projectMessage = "Message is required";

    return errors;
  };

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const activeTestimonial = testimonials[currentTestimonial];

  // --- RENDER ---
  return (
    <div className="w-full min-h-screen hero-font relative">

      {/* 1. HERO SECTION */}
      <section className="relative h-screen overflow-hidden bg-black">
        
        {/* SMOOTH CSS VIDEO SLIDER */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          {heroVideos.map((vid, idx) => (
            <div
              key={idx}
              className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(${(idx - currentVideo) * 100}%)`,
              }}
            >
              <video
                src={vid}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* HERO TEXT (PERFECTLY ALIGNED LEFT, NO BLACK OVERLAY) */}
        <div className="relative z-10 h-full flex items-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-7xl mx-auto px-6 md:px-12 xl:px-16 text-white"
          >
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-8xl font-black leading-[1.1] md:leading-[0.95] tracking-tight">
                BEYOND JUST <br />
                WELDING
              </h1>

              <p className="mt-6 text-xs md:text-sm tracking-widest text-gray-200 uppercase font-medium drop-shadow-md">
                YOUR ONE-STOP PARTNER FOR WELDING & CUTTING
                <br className="hidden md:block" />
                AUTOMATION SOLUTIONS
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  onClick={() => setOpenForm(true)}
                  className="bg-white text-black px-8 py-3.5 shadow-xl rounded-lg font-bold hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm"
                >
                  Enquire Now
                </button>

                <a 
                  href="/services" 
                  className="bg-transparent backdrop-blur-sm text-white shadow-xl px-8 py-3.5 rounded-lg border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-sm font-bold"
                >
                  Explore Solutions
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MODAL POPUP FORM */}
      <AnimatePresence>
        {openForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] px-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
            >
              <button
                onClick={() => setOpenForm(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-red-600 text-xl font-bold w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-red-50 transition-colors"
              >
                ×
              </button>

              <h2 className="text-2xl font-black mb-6 text-gray-900 uppercase tracking-tight">
                Request an Enquiry
              </h2>

              <form ref={form} className="space-y-4" onSubmit={handleQuoteSubmit}>
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Full Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={quoteFormData.customerName}
                    onChange={handleQuoteInputChange}
                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none transition-colors ${validationErrors.customerName ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 bg-gray-50"}`}
                  />
                  {validationErrors.customerName && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{validationErrors.customerName}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Email Address</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={quoteFormData.customerEmail}
                    onChange={handleQuoteInputChange}
                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none transition-colors ${validationErrors.customerEmail ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 bg-gray-50"}`}
                  />
                  {validationErrors.customerEmail && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{validationErrors.customerEmail}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={quoteFormData.customerPhone}
                      onChange={handleQuoteInputChange}
                      className={`w-full border rounded-lg p-3 text-sm focus:outline-none transition-colors ${validationErrors.customerPhone ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 bg-gray-50"}`}
                    />
                    {validationErrors.customerPhone && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{validationErrors.customerPhone}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">City</label>
                    <input
                      type="text"
                      name="customerCity"
                      value={quoteFormData.customerCity}
                      onChange={handleQuoteInputChange}
                      className={`w-full border rounded-lg p-3 text-sm focus:outline-none transition-colors ${validationErrors.customerCity ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 bg-gray-50"}`}
                    />
                    {validationErrors.customerCity && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{validationErrors.customerCity}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">Requirement Details</label>
                  <textarea
                    name="projectMessage"
                    value={quoteFormData.projectMessage}
                    onChange={handleQuoteInputChange}
                    rows={4}
                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none transition-colors resize-none ${validationErrors.projectMessage ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 bg-gray-50"}`}
                  ></textarea>
                  {validationErrors.projectMessage && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{validationErrors.projectMessage}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-red-600 transition-colors uppercase tracking-widest text-sm disabled:opacity-50"
                  >
                    {isSending ? "Sending..." : "Submit Enquiry"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ENGINEERING EXCELLENCE SECTION */}
      <section className="relative w-full py-20 md:py-32 bg-gray-100 overflow-hidden">
        {/* BACKGROUND GRID */}
        <div
          className="absolute inset-0 opacity-60 md:-mt-30"
          style={{
            height: "100%",
            width: "100%",
            backgroundImage: "url('/2nd-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 px-6 md:px-10 items-center">
          {/* LEFT SIDE IMAGE */}
          <div className="relative">
            <img
              src="/2nd-img1.svg"
              className="rounded-3xl w-full object-cover md:-mt-60"
              alt="Engineering Excellence"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1]">
              Engineering <br />
              Excellence Since <br />
              2005
            </h2>

            <p className="mt-6 text-gray-600 max-w-xl text-sm md:text-base">
              Since its establishment in 2005, Sharptrax Technologies has
              focused strongly on engineering excellence, automation quality,
              reliability, and long-term customer partnerships. Our core
              strength lies in delivering advanced welding and cutting
              automation systems for demanding industrial applications.
            </p>

            {/* STATS */}
            <div className="flex flex-row gap-8 md:gap-16 mt-10">
              <div>
                <h3 className="text-5xl md:text-7xl font-bold text-red-500">
                  20+
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mt-1">
                  Years of Experience
                </p>
              </div>

              <div>
                <h3 className="text-5xl md:text-7xl font-bold text-red-500">
                  5+
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mt-1">
                  Global automation partners
                </p>
              </div>
            </div>

            {/* SMALL IMAGE */}
            <div className="mt-8 md:mt-5">
              <img
                src="/2nd-img2.svg"
                className="rounded-2xl shadow-lg w-full max-w-sm md:ml-12"
                alt="Facility detail"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM TEXT */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 md:-mt-55 mt-16">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">
            The Sharptrax Technologies Facility
          </h3>

          <p className="text-gray-600 w-full md:max-w-[50%] mt-3 text-sm md:text-base">
            We specialize in the design and manufacturing of advanced welding
            automation systems, robotic welding solutions, and special purpose
            machines. Our systems are engineered for precision, durability, and
            seamless integration into industrial production environments.
          </p>
        </div>
      </section>

      {/* 3. PERFORMANCE STATS BANNER */}
      <section
        className="relative min-h-screen lg:h-screen w-full text-white py-20 lg:py-0 flex flex-col justify-center"
        style={{
          backgroundImage: "url('/3nd-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative h-full max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16 flex flex-col justify-between">
          
          {/* TITLE - Top Left */}
          <div className="mt-12 lg:mt-32 lg:absolute lg:top-0 lg:left-16 mb-12 lg:mb-0">
            <p className="text-[10px] md:text-xs tracking-[3px] uppercase text-gray-200 font-bold mb-4">
              Built on Precision, Engineering & Trust
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Sharptrax <br /> Technologies
            </h1>
          </div>

          {/* FEATURE BOXES - Bottom Row */}
          <div className="lg:absolute lg:bottom-20 lg:left-0 w-full lg:px-16 pb-10 lg:pb-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              
              <div className="h-48 md:h-56 w-full flex flex-col justify-between p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-colors">
                <img src="/Comp3/comp3-1.svg" className="w-10 h-10 md:w-12 md:h-12 opacity-90" alt="icon"/>
                <p className="text-sm md:text-base font-bold leading-tight">Advanced automation systems</p>
              </div>

              <div className="h-48 md:h-56 w-full flex flex-col justify-between p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-colors">
                <img src="/Comp3/comp3-2.svg" className="w-10 h-10 md:w-12 md:h-12 opacity-90" alt="icon"/>
                <p className="text-sm md:text-base font-bold leading-tight">High-precision welding solutions</p>
              </div>

              <div className="h-48 md:h-56 w-full flex flex-col justify-between p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-colors">
                <img src="/Comp3/comp3-3.svg" className="w-10 h-10 md:w-12 md:h-12 opacity-90" alt="icon"/>
                <p className="text-sm md:text-base font-bold leading-tight">Proven industrial performance</p>
              </div>

              <div className="h-48 md:h-56 w-full flex flex-col justify-between p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-colors">
                <img src="/Comp3/comp3-4.svg" className="w-10 h-10 mb-4 opacity-90" alt="icon"/>
                <p className="text-sm md:text-base font-bold leading-tight">Reliable project delivery</p>
              </div>

              <div className="h-48 md:h-56 w-full flex flex-col justify-between p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-colors col-span-2 sm:col-span-1 lg:col-span-1">
                <img src="/Comp3/comp3-5.svg" className="w-10 h-10 md:w-12 md:h-12 opacity-90" alt="icon"/>
                <p className="text-sm md:text-base font-bold leading-tight">Customer-focused engineering</p>
              </div>

            </div>
          </div>
        </div>
      </section>
      
      {/* 4. AUTOMATION SOLUTIONS GRID */}
      <section className="bg-gray-50 py-24 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-2 block">Our Products</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
              Automation Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {solutions.map((item, index) => (
              <a
                href={`/services?cat=${item.categoryId}&prod=${encodeURIComponent(item.title)}`}
                key={index}
                className="group flex flex-col sm:flex-row items-center sm:items-stretch gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-red-400 hover:shadow-xl transition-all duration-300 cursor-pointer block"
              >
                <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                  <h3 className="font-black text-xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                  <span className="mt-auto inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-red-600 uppercase tracking-widest group-hover:text-gray-900 transition-colors">
                    View Specifications <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>

                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gray-50 rounded-xl p-4 flex items-center justify-center border border-gray-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </a>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <a
              href="/services"
              className="bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-red-600 transition-colors uppercase tracking-widest text-sm shadow-lg"
            >
              Explore Full Catalog
            </a>
          </div>
        </div>
      </section>

      {/* 5. CLIENT LOGOS GALLERY (MOVED HERE) */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-center text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Our Valuable Clients
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* ROW 1 */}
        <div className="overflow-hidden mb-8 md:mb-12">
          <div className="flex gap-10 md:gap-20 scroll-right w-max">
            {[...row1, ...row1].map((logo, i) => (
              <img
                key={`r1-${i}`}
                src={logo}
                className="h-8 md:h-12 opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain"
                alt="client logo"
              />
            ))}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="overflow-hidden">
          <div className="flex gap-10 md:gap-20 scroll-left w-max">
            {[...row2, ...row2].map((logo, i) => (
              <img
                key={`r2-${i}`}
                src={logo}
                className="h-8 md:h-12 opacity-80 hover:opacity-100 transition-opacity duration-300 object-contain"
                alt="client logo"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIAL SECTION */}
      <section className="py-24 bg-gray-50 overflow-hidden border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <div className="relative w-full max-w-sm shrink-0 flex justify-center items-center">
            <motion.div 
              key={activeTestimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-full flex items-center justify-center border-[12px] border-white shadow-2xl overflow-hidden"
            >
              {activeTestimonial.imgSrc ? (
                <img
                  src={activeTestimonial.imgSrc}
                  alt={activeTestimonial.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${activeTestimonial.bgColor} text-white text-8xl font-black font-serif`}>
                  {activeTestimonial.initial}
                </div>
              )}
            </motion.div>
          </div>

          <div className="relative max-w-xl w-full">
            <h4 className="text-red-600 font-bold tracking-widest uppercase text-xs mb-4">
              Client Testimonials
            </h4>

            <motion.div
              key={`text-${activeTestimonial.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 uppercase">
                {activeTestimonial.name}
              </h2>

              <div className="flex gap-1 mt-2 mb-2 text-red-500 text-xl">
                ★★★★★
              </div>

              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6">
                {activeTestimonial.role}
              </p>

              <div className="bg-white p-8 rounded-2xl border border-gray-200 text-gray-700 text-lg leading-relaxed relative shadow-sm">
                <span className="text-6xl text-red-200 font-serif leading-none absolute top-4 left-4 select-none">"</span>
                <p className="relative z-10 font-medium italic">{activeTestimonial.text}</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4 mt-8">
              <button 
                onClick={handlePrevTestimonial} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600 font-bold text-xl"
              >
                &#8592;
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2.5 rounded-full transition-all ${index === currentTestimonial ? "bg-red-600 w-8" : "bg-gray-300 w-2.5 hover:bg-red-300"}`}
                  />
                ))}
              </div>
              <button 
                onClick={handleNextTestimonial} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors text-gray-600 font-bold text-xl"
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-2 block">Knowledge Base</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className={`border rounded-xl bg-gray-50 overflow-hidden transition-colors ${isOpen ? "border-red-600 shadow-md bg-white" : "border-gray-200"}`}>
                  <div
                    className="flex justify-between items-center px-6 py-5 cursor-pointer hover:bg-white"
                    onClick={() => toggle(index)}
                  >
                    <p className={`font-bold text-sm md:text-base pr-4 ${isOpen ? "text-red-600" : "text-gray-800"}`}>
                      {faq.question}
                    </p>
                    <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full transition-transform duration-300 font-bold ${isOpen ? "bg-red-600 text-white rotate-45" : "bg-gray-200 text-gray-600"}`}>
                      +
                    </div>
                  </div>
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}