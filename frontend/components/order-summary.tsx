"use client";

import { formatPrice } from "@/lib/catalog";
import { readOrder, type PlacedOrder } from "@/lib/order-store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function OrderSummary() {
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(readOrder());
    setReady(true);
  }, []);

  if (!ready) return <p className="px-4 py-16 text-muted">Loading the order.</p>;

  if (!order) {
    return (
      <div className="px-4 py-16 md:px-12">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Order confirmation</h1>
        <p className="mt-4 text-muted">
          No order yet.{" "}
          <Link href="/shop" className="text-accent">
            Shop the floor
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <section className="px-4 py-12 md:px-12 lg:py-16">
        <p className="text-sm text-accent">Order {order.id}</p>
        <h1 className="font-display mt-2 max-w-[12ch] text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
          Thanks, {order.name}.
        </h1>
        <p className="mt-4 max-w-[42ch] leading-relaxed text-muted">
          The shop will confirm stock before you pay. Keep this number if you write to @zyrostore1.
        </p>
        <dl className="mt-10 max-w-lg divide-y divide-line border-y border-line">
          <div className="flex justify-between gap-6 py-3 text-sm">
            <dt className="text-muted">Phone</dt>
            <dd>{order.phone}</dd>
          </div>
          <div className="flex justify-between gap-6 py-3 text-sm">
            <dt className="text-muted">City</dt>
            <dd>{order.city}</dd>
          </div>
          <div className="flex justify-between gap-6 py-3 text-sm">
            <dt className="text-muted">Address</dt>
            <dd className="text-right">{order.address}</dd>
          </div>
          {order.note ? (
            <div className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-muted">Note</dt>
              <dd className="text-right">{order.note}</dd>
            </div>
          ) : null}
        </dl>
        <Link href="/shop" className="btn btn-primary mt-8">
          Back to the shop
        </Link>
      </section>
      <aside className="bg-surface px-4 py-10 md:px-10 lg:px-12 lg:py-16">
        <h2 className="font-display text-3xl tracking-[-0.03em]">What you ordered</h2>
        <ul className="mt-6 divide-y divide-line">
          {order.items.map((item) => (
            <li key={`${item.slug}-${item.size}`} className="flex gap-4 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-bg">
                <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg">{item.name}</p>
                <p className="text-sm text-muted">
                  Size {item.size}, qty {item.qty}
                </p>
              </div>
              <p>{formatPrice(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-baseline justify-between border-t border-line pt-5">
          <span className="text-muted">Total</span>
          <span className="text-2xl">{formatPrice(order.total)}</span>
        </div>
      </aside>
    </div>
  );
}
