"use client";

import { readHeld, writeHeld, type HeldPiece } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { fetchProducts } from "@/lib/storefront-api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span>{label}</span>
      <span className="rounded-2xl bg-white/5 p-1">
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-12 w-full rounded-[0.9rem] bg-bg px-4 text-sm text-fg outline-none placeholder:text-muted focus:ring-1 focus:ring-accent"
        />
      </span>
    </label>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const [items, setItems] = useState<HeldPiece[]>([]);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(readHeld());
    setReady(true);
  }, []);

  if (!ready) return <p className="px-4 py-16 text-muted">Loading checkout.</p>;

  if (items.length === 0) {
    return (
      <div className="px-4 py-16 md:px-12">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Checkout</h1>
        <p className="mt-4 text-muted">
          Your cart is empty.{" "}
          <Link href="/shop" className="text-accent">
            Shop the floor
          </Link>
        </p>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("zyro-token");
      if (!token) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const products = await fetchProducts({ limit: 100 });
      const variantMap = new Map<number, number>();
      for (const product of products) {
        for (const variant of product.variants) {
          variantMap.set(variant.id, product.id);
        }
      }

      const orderItems = items.map((item) => {
        const product = products.find((p) => p.slug === item.slug);
        const variant = product?.variants.find((v) => v.size === item.size);
        return {
          variant_id: variant?.id,
          qty: item.qty,
        };
      }).filter((item) => item.variant_id);

      if (orderItems.length === 0) {
        setError("Could not match cart items to products. Please try again.");
        setSubmitting(false);
        return;
      }

      const data = new FormData(event.currentTarget);
      const orderData = {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        city: String(data.get("city") ?? ""),
        address: String(data.get("address") ?? ""),
        note: String(data.get("note") ?? ""),
        items: orderItems,
      };

      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err: { detail?: string } = await res.json().catch(() => ({ detail: "Failed to create order" }));
        throw new Error(err.detail || "Failed to create order");
      }

      writeHeld([]);
      router.push("/order-confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="lg:grid lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"
      onSubmit={handleSubmit}
    >
      <section className="px-4 py-10 md:px-12 lg:py-16">
        <p className="text-sm text-accent">Delivery</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Checkout</h1>
        <p className="mt-3 max-w-[40ch] text-muted">You pay when the shop confirms the size is in stock.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" required autoComplete="name" />
          <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
          <Field label="City" name="city" required defaultValue="Haripur" autoComplete="address-level2" />
          <Field label="Address" name="address" required autoComplete="street-address" />
          <div className="sm:col-span-2">
            <Field label="Note" name="note" placeholder="Optional" />
          </div>
        </div>
        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </section>
      <aside className="flex flex-col bg-surface px-4 py-10 md:px-10 lg:sticky lg:top-24 lg:h-[calc(100dvh-6rem)] lg:py-12">
        <h2 className="font-display text-3xl tracking-[-0.03em]">Your order</h2>
        <ul className="mt-6 flex-1 divide-y divide-line overflow-y-auto">
          {items.map((item) => (
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
        <div className="border-t border-line pt-5">
          <div className="flex items-baseline justify-between">
            <span className="text-muted">Total</span>
            <span className="text-2xl">{formatPrice(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary mt-5 w-full disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </div>
      </aside>
    </form>
  );
}
