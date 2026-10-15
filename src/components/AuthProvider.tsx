"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

type Ctx = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  const router = useRouter();

  const refresh = useCallback(async () => {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    setUser(res.ok ? (await res.json()).user ?? null : null);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <AuthCtx.Provider value={{ user, isAuthenticated: !!user, refresh, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
