import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Location from "./pages/Location";
import Home from "./pages/Home";
import AboutUs from "./pages/aboutus/page/AboutUs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Services from "./pages/Services";
import Contact from "./pages/contact/page/Contact";
import Industries from "./pages/Industries";
import Gallery from "./pages/gallery";
import WhatsAppFloat from "./components/whatsapp";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { CatalogProvider } from "./context/CatalogContext";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import FeaturedManager from "./pages/admin/FeaturedManager";

function Shell() {
  const { pathname } = useLocation();
  const isAdminArea = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminArea && <Navbar />}
      {!isAdminArea && <WhatsAppFloat />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<Location />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:slug" element={<ProductForm />} />
          <Route path="featured" element={<FeaturedManager />} />
        </Route>
      </Routes>

      {!isAdminArea && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
          <Shell />
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}