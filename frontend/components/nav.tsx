"use client";

import {
  accountLinks,
  brandLinks,
  customerLinks,
  legalLinks,
  moreLinks,
  shopLinks,
} from "@/lib/store-nav";
import { Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cartCount } from "@/lib/cart-store";
import { useEffect, useRef, useState } from "react";
import { CartDrawer } from "./cart-drawer";
import { Logo } from "./logo";

const groups = [
  { title: "Shop", links: shopLinks },
  { title: "Account", links: accountLinks },
  { title: "Customer", links: customerLinks },
  { title: "Brand", links: brandLinks },
  { title: "Legal", links: legalLinks },
  { title: "More", links: moreLinks },
];

function MenuMark() {
  return (
    <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
      <span className="block h-px w-5 bg-current" />
      <span className="block h-px w-5 bg-current" />
      <span className="block h-px w-3.5 bg-current" />
    </span>
  );
}

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [itemsInCart, setItemsInCart] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => setItemsInCart(cartCount());
    sync();
    window.addEventListener("zyro-cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("zyro-cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  return (
    <>
    <header className="fixed inset-x-2 top-2 z-40 overflow-visible rounded-full border border-white/10 bg-black/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl sm:inset-x-3 sm:top-3 md:inset-x-6">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-2.5 sm:px-4 md:px-6">
        <div
          ref={menuRef}
          className="flex items-center self-stretch justify-self-start"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center gap-2 px-1 text-xs tracking-[0.16em] text-fg uppercase transition-colors hover:text-accent sm:gap-3 sm:px-0 sm:tracking-[0.22em]"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => {
              if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
              setMenuOpen((open) => !open);
            }}
          >
            <MenuMark />
            <span className="hidden min-[380px]:inline">Menu</span>
          </button>
          {menuOpen ? (
            <nav
              id="site-menu"
              aria-label="Store menu"
              className="absolute top-full left-0 z-50 w-full max-w-[980px] pt-3"
            >
              <div className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto border border-line bg-bg p-5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] sm:grid-cols-2 sm:gap-8 sm:p-6 lg:grid-cols-3">
                {groups.map((group) => (
                  <div key={group.title} className="min-w-0">
                    <p className="text-xs tracking-[0.18em] text-muted uppercase">{group.title}</p>
                    <ul className="mt-3 space-y-1">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block py-1.5 text-base tracking-[-0.02em] break-words hover:text-accent"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          ) : null}
        </div>

        <Link
          href="/"
          aria-label="Zyro home"
          className="justify-self-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <Logo className="max-[379px]:[&_svg]:hidden" />
        </Link>

        <div className="flex min-w-0 items-center justify-end justify-self-end gap-0.5 pl-2 sm:gap-2 sm:pl-3">
          <Link href="/search" aria-label="Search" className="inline-flex h-10 w-9 shrink-0 items-center justify-center sm:hidden">
            <Search size={20} />
          </Link>
          <form
            action="/search"
            role="search"
            className="hidden h-10 min-w-0 flex-1 items-center gap-2 border border-line bg-surface px-3 sm:flex sm:max-w-44 md:max-w-64"
          >
            <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="nav-search" className="sr-only">
              Search
            </label>
            <input
              id="nav-search"
              name="q"
              type="search"
              placeholder="Search"
              className="w-full min-w-0 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
          </form>
          <Link
            href="/account"
            aria-label="Profile"
            className="inline-flex h-10 w-9 shrink-0 items-center justify-center text-fg hover:text-accent sm:w-10"
          >
            <User size={22} />
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={itemsInCart > 0 ? `Cart, ${itemsInCart} items` : "Cart"}
            className="relative inline-flex h-10 w-9 shrink-0 items-center justify-center text-fg hover:text-accent sm:w-10"
          >
            <ShoppingBag size={22} />
            {itemsInCart > 0 ? (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-ink">
                {itemsInCart > 9 ? "9+" : itemsInCart}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
