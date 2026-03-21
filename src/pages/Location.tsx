import { type FormEvent, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
        formRef.current?.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Failed to send enquiry. Please try again.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div
      className="w-full min-h-screen bg-white hero-font py-20 px-6"
      style={{
        backgroundImage: "url('/3nd-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-gray-900 text-center lg:text-left">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT COLUMN: CONTACT FORM */}
          <section>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6 bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Send an Enquiry
              </h3>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name *
                </label>
                <input
                  name="user_name"
                  type="text"
                  required
                  minLength={3}
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email Address *
                </label>
                <input
                  name="user_email"
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone Number *
                </label>
                <input
                  name="user_phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Requirement Details *
                </label>
                <textarea
                  name="project_details"
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSending ? "Sending..." : "Send Enquiry"}
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT COLUMN: LOCATION & MAP */}
          <section className="flex flex-col h-full">
            <div className="glass-box rounded-3xl shadow-xl p-6 md:p-8 border border-gray-200 bg-white/80 backdrop-blur-md h-full">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Our Location
              </h3>

              <div className="mb-6 text-gray-600">
                <p className="font-medium text-gray-900">
                  Sharptrax Technologies
                </p>
                <p>
                  Visit us at our headquarters for a coffee and a chat about
                  your next project.
                </p>
              </div>

              {/* MAP IFRAME */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.384666526131!2d77.6214534!3d12.9472305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU2JzUwLjAiTiA3N8KwMzcnMTcuMiJF!5e0!3m2!1sen!2sin!4v1647254552000!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
