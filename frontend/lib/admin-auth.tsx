"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

type AdminUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
};

type AuthContextType = {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("zyro-admin-token");
    const savedUser = localStorage.getItem("zyro-admin-user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = exp - now;

    if (timeUntilExpiry < 60000) {
      const refreshToken = localStorage.getItem("zyro-admin-refresh-token");
      if (refreshToken) {
        api.post<{ access_token: string; refresh_token: string }>(
          "/users/refresh-token",
          { refresh_token: refreshToken }
        ).then((data) => {
          setToken(data.access_token);
          localStorage.setItem("zyro-admin-token", data.access_token);
          localStorage.setItem("zyro-admin-refresh-token", data.refresh_token);
        }).catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem("zyro-admin-token");
          localStorage.removeItem("zyro-admin-refresh-token");
          localStorage.removeItem("zyro-admin-user");
        });
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await api.post<{ access_token: string; refresh_token: string }>(
      "/users/login",
      { email, password }
    );

    setToken(data.access_token);
    localStorage.setItem("zyro-admin-token", data.access_token);
    localStorage.setItem("zyro-admin-refresh-token", data.refresh_token);

    const meRes = await api.get<AdminUser>("/users/me", data.access_token);
    setUser(meRes);
    localStorage.setItem("zyro-admin-user", JSON.stringify(meRes));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("zyro-admin-token");
    localStorage.removeItem("zyro-admin-refresh-token");
    localStorage.removeItem("zyro-admin-user");
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function AdminRouteProtection({ children }: { children: ReactNode }) {
  const { token, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/admin/login");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!token) return null;

  return <>{children}</>;
}
