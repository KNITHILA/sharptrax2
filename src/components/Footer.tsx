import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Footer() {
  const [openForm, setOpenForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFooterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "service_67r7kfg",
        "template_xwnafxs",
        formRef.current,
        "9bJ_hqjsB63RMeUH0",
      )
      .then(() => {
        alert("Enquiry sent successfully!");
        setOpenForm(false);
        formRef.current?.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Failed to send enquiry.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const socialLinks = [
    {
      id: "facebook",
      url: "https://www.facebook.com/sharptraxtechnologies",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: "youtube",
      url: "https://www.youtube.com/@sharptraxtechnologies9926",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M21.8 8.001c.2 1.402.3 3.003.3 3.999s-.1 2.597-.3 3.999c-.18.998-.95 1.768-1.95 1.948-1.5.201-7.55.201-7.85.201s-6.35 0-7.85-.201c-1-.18-1.77-.95-1.95-1.948-.2-1.402-.3-3.003-.3-3.999s.1-2.597.3-3.999c.18-.998.95-1.768 1.95-1.948 1.5-.201 7.55-.201 7.85-.201s6.35 0 7.85.201c1 .18 1.77.95 1.95 1.948zM10.5 15.004l5.5-3-5.5-3v6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: "linkedin",
      url: "https://www.linkedin.com/company/sharptrax-technologies",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: "instagram",
      url: "https://www.instagram.com/sharptrax/",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <footer
      className="relative pt-16 pb-10 overflow-hidden"
      style={{
        background: "linear-gradient(45deg,#eeeeee 50%,#dddddd 50%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* TOP ROW - Stacks on mobile */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 mb-10 text-center md:text-left">
          <img src="/logo.svg" alt="logo" className="h-16 md:h-20 md:-mb-5" />

          <button
            className="border border-gray-400 bg-white px-6 py-2 rounded-full shadow-sm hover:bg-gray-200 transition-colors"
            onClick={() => setOpenForm(true)}
          >
            Contact Us
          </button>
        </div>

        <div className="border-t border-gray-300 mb-10"></div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-sm text-gray-700">
          {/* SERVICES */}
          <div>
            <h3 className="font-semibold mb-3">
              <a href="/services" className="hover:underline">
                Our Services
              </a>
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/services?cat=welding-automation&prod=Robotic Automation">
                  Robotic Welding
                </a>
              </li>
              <li>
                <a href="/services?cat=welding-automation&prod=Plasma Transferred Arc Welding System">
                  PTA Welding Systems
                </a>
              </li>
              <li>
                <a href="/services?cat=welding-automation&prod=Welding Rotator">
                  Welding Rotators
                </a>
              </li>
              <li>
                <a href="/services?cat=welding-positioners&prod=Welding Positioners">
                  Welding Positioners
                </a>
              </li>
              <li>
                <a href="/services?cat=cnc-cutting&prod=Plasma CNC Machine">
                  CNC Cutting Machines
                </a>
              </li>
              <li>
                <a href="/services?cat=welding-automation&prod=Port Welding Machine SPM">
                  Special Purpose Machines
                </a>
              </li>
            </ul>
          </div>

          {/* INDUSTRIES */}
          <div>
            <h3 className="font-semibold mb-3">
              <a href="/industries" className="hover:underline">
                Industries We Serve
              </a>
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/industries?type=heavy-engineering">
                  Heavy Engineering
                </a>
              </li>
              <li>
                <a href="/industries?type=manufacturing">Manufacturing</a>
              </li>
              <li>
                <a href="/industries?type=power-energy">Power & Energy</a>
              </li>
              <li>
                <a href="/industries?type=automotive">Automotive</a>
              </li>
              <li>
                <a href="/industries?type=infrastructure">Infrastructure</a>
              </li>
              <li>
                <a href="/industries?type=special-machinery">
                  Special Machinery
                </a>
              </li>
            </ul>
          </div>

          {/* ADDRESS */}
          <div>
            <h3 className="font-semibold mb-3">
              <a href="/location" className="hover:underline">
                Address
              </a>
            </h3>
            <a
              href="/location"
              className="text-gray-600 leading-relaxed hover:underline block"
            >
              166, 11th Main Road, SIDCO Industrial Estate, Thirumudivakkam,
              Chennai – 600040
            </a>
            
            {/* Added the second number here */}
            <div className="mt-4 space-y-1">
              <p>
                <a href="tel:+919944432149" className="hover:underline">
                  📞 +91 99444 32149
                </a>
              </p>
              <p>
                <a href="tel:+919840122149" className="hover:underline">
                  📞 +91 98401 22149
                </a>
              </p>
            </div>

            <p className="mt-2">
              <a href="mailto:sharptrax@yahoo.com" className="hover:underline">
                ✉ sharptrax@yahoo.com
              </a>
            </p>
            <p className="text-gray-600 mt-2">GSTIN: 33AJWPG6450H1ZZ</p>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="font-semibold mb-3">Follow us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-300 text-gray-700 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-6 border-t border-gray-300 md:border-none text-xs text-gray-600 gap-4 text-center md:text-left">
          <p>© Copyright Sharptrax Technologies. All Rights Reserved by Nextera</p>
        </div>

        {/* MODAL FORM - Functional Integration */}
        {openForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative">
              <button
                onClick={() => setOpenForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Request an Enquiry
              </h2>

              <form
                ref={formRef}
                className="space-y-4"
                onSubmit={handleFooterSubmit}
              >
                <div>
                  <label className="text-sm text-gray-600">Full Name *</label>
                  <input
                    name="user_name"
                    type="text"
                    required
                    minLength={3}
                    className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Email Address *
                  </label>
                  <input
                    name="user_email"
                    type="email"
                    required
                    className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Phone Number *
                  </label>
                  <input
                    name="user_phone"
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Requirement Details *
                  </label>
                  <textarea
                    name="project_details"
                    required
                    minLength={10}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:border-black"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpenForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSending ? "Sending..." : "Send Enquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}