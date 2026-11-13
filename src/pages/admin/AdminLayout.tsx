import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export interface AdminOutletContext {
  setDirty: (dirty: boolean) => void;
}

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/categories", label: "Categories", end: false },
  { to: "/admin/products", label: "Products", end: false },
  { to: "/admin/featured", label: "Home & Footer", end: false },
];

export default function AdminLayout() {
  const [dirty, setDirty] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const confirmLeave = (): boolean =>
    !dirty || window.confirm("You have unsaved changes. Leave this page?");

  const guard = (e: React.MouseEvent) => {
    if (!confirmLeave()) e.preventDefault();
  };

  const handleLogout = () => {
    if (!confirmLeave()) return;
    setDirty(false);
    logout();
    navigate("/");
  };

  const context: AdminOutletContext = { setDirty };

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <aside className="lg:w-64 shrink-0 bg-neutral-900 text-white lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-[10px] tracking-[3px] uppercase text-red-400 font-bold">
            Sharptrax
          </p>
          <h1 className="text-xl font-black tracking-tight">Admin Panel</h1>
        </div>

        <nav className="flex lg:flex-col gap-1 p-3 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={guard}
              className={({ isActive }) =>
                `whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-3 flex lg:flex-col gap-2 border-t border-white/10">
          <Link
            to="/"
            onClick={guard}
            className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-white/10"
          >
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet context={context} />
      </main>
    </div>
  );
}