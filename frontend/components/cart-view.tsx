"use client";

import { readHeld, writeHeld, type HeldPiece } from "@/lib/cart-store";
import { formatPrice } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartView() {
  const [items, setItems] = useState<HeldPiece[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readHeld());
    setReady(true);
  }, []);

  if (!ready) return <p className="mt-8 text-muted">Loading the cart.</p>;

  if (items.length === 0) {
    return (
      <p className="mt-8 text-muted">
        Your cart is empty.{" "}
        <Link href="/shop" className="text-accent">
          Shop the floor
        </Link>
      </p>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="mt-10">
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-5">
            <Link href={`/products/${item.slug}`} className="relative h-28 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface">
              <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
            </Link>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="text-lg">
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
      <p className="mt-6 text-xl">Total {formatPrice(total)}</p>
      <Link href="/checkout" className="btn btn-primary mt-6">
        Checkout
      </Link>
    </div>
  );
}
