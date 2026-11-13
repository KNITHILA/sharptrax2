import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { useAuth } from "../context/AuthContext";
import { serviceUrl } from "../lib/serviceUrls";

export default function Navbar() {
  const { categories } = useCatalog();
  const { isAdmin, logout } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [activeDesktopCatId, setActiveDesktopCatId] = useState<string>("");

  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [activeMobileCat, setActiveMobileCat] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fall back to the first category if the stored one was deleted.
  const activeDesktopCat =
    categories.find((c) => c.id === activeDesktopCatId) ?? categories[0] ?? null;

  const closeMenus = () => {
    setOpenMenu(false);
    setDesktopServicesOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full h-20 lg:h-20 z-[100] bg-white backdrop-blur-md shadow">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between px-6 md:px-10 h-full relative z-[105] bg-white">
        {/* LOGO */}
        <div className="flex items-center shrink-0">
          <Link to="/">
            <img
              src="/logo.svg"
              alt="Sharptrax Technologies"
              className="h-10 md:h-14 lg:h-[80px] xl:h-[80px] w-auto object-contain transition-all duration-300 -translate-y-1 lg:-translate-y-2"
            />
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-10 h-full">
          <div className="flex items-center gap-4 xl:gap-6 text-gray-700 font-medium h-full">
            <Link to="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>

            <p className="text-gray-300">/</p>

            <Link to="/about-us" className="hover:text-red-600 transition-colors">
              About Us
            </Link>

            <p className="text-gray-300">/</p>

            {/* SERVICES DROPDOWN */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setDesktopServicesOpen(true)}
              onMouseLeave={() => setDesktopServicesOpen(false)}
            >
              <Link
                to="/services"
                className={`flex items-center gap-1 transition-colors ${
                  desktopServicesOpen ? "text-red-600" : "hover:text-red-600"
                }`}
              >
                Products & Services
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    desktopServicesOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              <div
                className={`absolute top-full right-0 lg:right-[-150px] w-[850px] bg-white border border-gray-100 shadow-2xl rounded-b-2xl transition-all duration-300 origin-top overflow-hidden flex flex-col whitespace-normal ${
                  desktopServicesOpen
                    ? "opacity-100 scale-y-100 visible"
                    : "opacity-0 scale-y-95 invisible"
                }`}
              >
                <div className="flex h-[450px]">
                  <div className="w-1/3 bg-gray-50 border-r border-gray-100 p-4 overflow-y-auto custom-scrollbar shrink-0">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">
                      Categories
                    </h3>
                    <ul className="space-y-1">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <button
                            onMouseEnter={() => setActiveDesktopCatId(category.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                              activeDesktopCat?.id === category.id
                                ? "bg-white text-red-600 shadow-sm border-l-4 border-red-600"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent"
                            }`}
                          >
                            {category.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-2/3 p-6 bg-white overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                      {activeDesktopCat?.title} Systems
                    </h3>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                      {activeDesktopCat?.products.map((prod) => (
                        <Link
                          key={prod.slug}
                          to={serviceUrl(prod.slug)}
                          onClick={closeMenus}
                          className="block w-full text-left text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-md transition-colors leading-relaxed break-words"
                        >
                          {prod.name}
                        </Link>
                      ))}
                      {activeDesktopCat && activeDesktopCat.products.length === 0 && (
                        <p className="text-sm text-gray-400 col-span-2">
                          No products in this category yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                  <Link
                    to="/services"
                    onClick={() => setDesktopServicesOpen(false)}
                    className="text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-widest transition-colors"
                  >
                    View Full Directory →
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-gray-300">/</p>

            <Link to="/gallery" className="hover:text-red-600 transition-colors">
              Gallery
            </Link>

            <p className="text-gray-300">/</p>

            <Link to="/contact" className="hover:text-red-600 transition-colors">
              Contact Us
            </Link>
          </div>

          {/* AUTH LINKS */}
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-500">
            {isAdmin ? (
              <>
                <Link to="/admin" className="hover:text-red-600 transition-colors">
                  Admin
                </Link>
                <button onClick={handleLogout} className="hover:text-red-600 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-red-600 transition-colors">
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => navigate("/contact")}
            className="bg-black text-white px-6 py-3 whitespace-nowrap rounded-md text-sm font-bold tracking-wide shrink-0 hover:bg-red-600 transition-colors shadow-md ml-2"
          >
            Enquire Now
          </button>
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="flex lg:hidden items-center gap-4 shrink-0">
          <button
            className="flex justify-center items-center w-8 h-8 z-[110] relative shrink-0 text-gray-900 hover:text-red-600 transition-colors ml-1"
            onClick={() => setOpenMenu(!openMenu)}
            aria-label="Toggle Menu"
          >
            {openMenu ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute top-20 left-0 w-full bg-white border-b shadow-2xl transition-all duration-300 ease-in-out z-[90] max-h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar ${
          openMenu ? "translate-y-0 opacity-100 visible" : "-translate-y-10 opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4 text-gray-700 font-medium">
          <Link to="/" className="hover:text-red-600 transition-colors text-lg font-bold" onClick={() => setOpenMenu(false)}>
            Home
          </Link>
          <Link to="/about-us" className="hover:text-red-600 transition-colors text-lg font-bold" onClick={() => setOpenMenu(false)}>
            About Us
          </Link>

          <div className="flex flex-col border-y border-gray-100 py-3">
            <button
              className="flex items-center justify-between hover:text-red-600 transition-colors text-lg font-bold w-full text-left"
              onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
            >
              Services
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  mobileServicesExpanded ? "rotate-180 text-red-600" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`flex flex-col overflow-hidden transition-all duration-300 ${
                mobileServicesExpanded ? "max-h-[2000px] mt-4 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {categories.map((category) => (
                <div key={category.id} className="border-b border-gray-50 last:border-none">
                  <button
                    onClick={() =>
                      setActiveMobileCat(activeMobileCat === category.id ? null : category.id)
                    }
                    className="flex items-center justify-between w-full py-3 text-left font-semibold text-gray-800 text-sm hover:text-red-600"
                  >
                    {category.title}
                    <span className="text-gray-400 font-normal text-xl">
                      {activeMobileCat === category.id ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeMobileCat === category.id ? "max-h-[1000px] mb-3" : "max-h-0"
                    }`}
                  >
                    <ul className="flex flex-col space-y-1 border-l-2 border-red-200 ml-2 pl-4 py-2">
                      {category.products.map((prod) => (
                        <li key={prod.slug}>
                          <Link
                            to={serviceUrl(prod.slug)}
                            onClick={closeMenus}
                            className="block text-gray-500 text-sm hover:text-red-600 text-left w-full whitespace-normal py-1.5 break-words"
                          >
                            {prod.name}
                          </Link>
                        </li>
                      ))}
                      {category.products.length === 0 && (
                        <li className="text-gray-400 text-sm py-1.5">No products yet.</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}

              <Link
                to="/services"
                onClick={() => setOpenMenu(false)}
                className="bg-gray-50 p-3 rounded-lg text-center text-sm font-bold text-gray-900 mt-4 block border border-gray-100 transition-colors hover:bg-gray-100 hover:text-red-600"
              >
                View Full Directory
              </Link>
            </div>
          </div>

          <Link to="/gallery" className="hover:text-red-600 transition-colors text-lg font-bold" onClick={() => setOpenMenu(false)}>
            Gallery
          </Link>
          <Link to="/contact" className="hover:text-red-600 transition-colors text-lg font-bold" onClick={() => setOpenMenu(false)}>
            Contact Us
          </Link>

          {isAdmin ? (
            <>
              <Link to="/admin" className="hover:text-red-600 transition-colors text-lg font-bold" onClick={() => setOpenMenu(false)}>
                Admin Panel
              </Link>
              <button onClick={handleLogout} className="text-left hover:text-red-600 transition-colors text-lg font-bold">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-red-600 transition-colors text-lg font-bold" onClick={() => setOpenMenu(false)}>
              Login
            </Link>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `,
        }}
      />
    </nav>
  );
}