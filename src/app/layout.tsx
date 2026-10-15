import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSessionUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nzuri.rw";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nzuri — The Curated Estate",
    template: "%s — Nzuri",           // ← fixed: no more "Nzuri Nzuri"
  },
  description:
    "East Africa's premier curated luxury real estate platform. Discover architectural masterpieces in Rwanda and beyond.",
  applicationName: "Nzuri",
  authors: [{ name: "Nzuri", url: SITE_URL }],
  keywords: [
    "luxury real estate","Rwanda","Kigali","property","estate",
    "East Africa","curated homes","real estate platform",
  ],
  manifest: "/favicon_io/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon_io/favicon.ico", sizes: "any" },
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Nzuri",
    locale: "en_US",
    url: SITE_URL,
    title: "Nzuri — The Curated Estate",
    description:
      "East Africa's premier curated luxury real estate platform.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Nzuri — The Curated Estate" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nzuri — The Curated Estate",
    description: "East Africa's premier curated luxury real estate platform.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e7a63",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ── Server-fetch session so the header does NOT flash a skeleton ──
  const user = await getSessionUser();

  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers initialUser={user}>
          <Header initialUser={user} />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
