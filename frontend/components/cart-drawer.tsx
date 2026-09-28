"use client";

import { readHeld, writeHeld, type HeldPiece } from "@/lib/cart-store";
import { formatPrice } from "@/lib/catalog";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<HeldPiece[]>([]);

  useEffect(() => {
    const sync = () => setItems(readHeld());
    sync();
    window.addEventListener("zyro-cart", sync);
    return () => window.removeEventListener("zyro-cart", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close cart" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-line bg-bg">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-2xl tracking-[-0.03em]">Cart</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center">
            <X size={20} />
          </button>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-8 text-muted">
            Your cart is empty.{" "}
            <Link href="/shop" className="text-accent" onClick={onClose}>
              Shop the floor
            </Link>
          </p>
        ) : (
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {items.map((item) => (
              <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-5">
                <Link href={`/products/${item.slug}`} onClick={onClose} className="relative h-24 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface">
                  <Image src={item.image} alt="" fill sizes="72px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.slug}`} onClick={onClose} className="block truncate">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted">Size {item.size}</p>
                  <p className="mt-1">{formatPrice(item.price)}</p>
                </div>
                <button
                  type="button"
                  className="text-sm text-muted hover:text-fg"
                  onClick={() => {
                    const next = items.filter((piece) => !(piece.slug === item.slug && piece.size === item.size));
                    writeHeld(next);
                    setItems(next);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 ? (
          <div className="border-t border-line px-5 py-5">
            <p className="text-lg">Total {formatPrice(total)}</p>
            <Link href="/checkout" onClick={onClose} className="btn btn-primary mt-4 w-full">
              Checkout
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
