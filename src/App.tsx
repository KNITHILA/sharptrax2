import { BrowserRouter, Routes, Route } from "react-router-dom";
import Location from "./pages/Location";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Industries from "./pages/Industries";
import Gallery from "./pages/gallery";
import WhatsAppFloat from "./components/whatsapp";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <WhatsAppFloat />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
