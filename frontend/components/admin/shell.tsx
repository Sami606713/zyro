"use client";

import { Mark } from "@/components/logo";
import { sampleOrders } from "@/lib/admin-sample";
import { cn } from "@/lib/utils";
import { ArrowUpRight, LayoutDashboard, Shirt, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Shirt },
];

const waiting = sampleOrders.filter((order) => order.status === "New").length;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-dvh bg-bg text-fg lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="flex flex-col border-b border-white/10 bg-[#101114] lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
          <Mark className="h-8 w-8" />
          <span>
            <span className="block font-display text-lg leading-none font-semibold tracking-[-0.05em]">ZYRO</span>
            <span className="mt-1 block text-[11px] tracking-[0.18em] text-muted uppercase">Floor desk</span>
          </span>
        </Link>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible" aria-label="Admin">
          {links.map((link) => {
            const active = path === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm whitespace-nowrap transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  active ? "bg-accent text-ink" : "text-muted hover:bg-white/5 hover:text-fg",
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {link.label}
                {link.href === "/admin/orders" && waiting > 0 ? (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-1.5 text-[11px] font-medium",
                      active ? "bg-ink/15" : "bg-accent text-ink",
                    )}
                  >
                    {waiting}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden px-5 pt-6 pb-16 lg:block">
          <p className="text-xs leading-5 text-muted">Sample figures for the Haripur floor. Nothing here is a live sale.</p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-bg/80 px-4 backdrop-blur-xl md:px-8">
          <p className="text-[11px] tracking-[0.18em] text-muted uppercase">Haripur · private</p>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] tracking-[0.16em] text-muted uppercase ring-1 ring-white/10">
              Dummy data
            </span>
            <Link href="/" className="inline-flex items-center gap-1 text-sm">
              Shop
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </header>
        <div className="px-4 py-8 md:px-8 md:py-10">{children}</div>
      </div>
    </div>
  );
}
