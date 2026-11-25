import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local Vibes Grams",
  description:
    "Cerita, foto, dan kabar dari sekitar komplek kamu — semua di satu tempat.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-white text-neutral-800 antialiased">{children}</body>
    </html>
  );
}
