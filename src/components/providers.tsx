"use client";

import type { SessionUser } from "@/lib/auth";
import { I18nProvider } from "./I18nProvider";
import { AuthProvider } from "./AuthProvider";
import { SocketProvider } from "./SocketProvider";
import { ToastProvider } from "./ToastProvider";

export function Providers({
  initialUser,
  children,
}: {
  initialUser: SessionUser | null;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <AuthProvider initialUser={initialUser}>
        <SocketProvider>
          <ToastProvider>{children}</ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
