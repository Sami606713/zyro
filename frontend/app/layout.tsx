import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFrame } from "@/components/site-frame";
import { cn } from "@/lib/utils";

const outfit = localFont({
  src: "./fonts/outfit-latin.woff2",
  variable: "--font-outfit",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zyro | Designed to define you",
  description:
    "Zyro is a men's clothing floor in Haripur. Apparel, bottomwear, and accessories.",
  openGraph: {
    title: "Zyro | Designed to define you",
    description:
      "Men's apparel, bottomwear, and accessories from the Zyro floor in Haripur.",
    locale: "en_PK",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", outfit.variable, "font-sans")}>
      <body className="min-h-full overflow-x-hidden bg-bg text-fg antialiased">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
