import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { isAdmin, login } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  if (isAdmin) return <Navigate to={from} replace />;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 hero-font flex items-center justify-center px-4 pt-28 pb-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-5"
      >
        <div>
          <span className="text-red-600 font-bold tracking-[0.2em] text-[10px] uppercase block mb-1">
            Admin Access
          </span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Login</h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to manage categories, products and services.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
            autoComplete="username"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 bg-gray-50"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1 block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            autoComplete="current-password"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-red-500 bg-gray-50"
          />
        </div>

        {error && (
          <p className="text-red-600 text-xs font-bold uppercase bg-red-50 border border-red-100 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-red-600 transition-colors uppercase tracking-widest text-sm"
        >
          Sign In
        </button>

      
      </form>
    </div>
  );
}