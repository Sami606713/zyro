"use client";

import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { usePathname } from "next/navigation";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Nav />
      <div className="pt-24">{children}</div>
      <Footer />
    </>
  );
}
