import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../config/auth";

interface AuthContextValue {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const SESSION_KEY = "sharptrax_admin_session";

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): boolean {
  try {
    return typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => readSession());

  const login = useCallback((username: string, password: string): boolean => {
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback((): void => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}