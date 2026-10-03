"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { holdPiece } from "@/lib/cart-store";

export type ChatProduct = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  base_price: number;
  images?: {
    id: number;
    image_url: string;
    alt_text?: string | null;
    is_primary?: boolean;
  }[];
  variants?: {
    id: number;
    size: string;
    color: string;
    sku: string;
    stock_quantity: number;
    price_override?: number | null;
  }[];
};

function unitPrice(product: ChatProduct, variantId: number | null) {
  const variant = product.variants?.find((v) => v.id === variantId);
  if (variant?.price_override != null) return Number(variant.price_override);
  return Number(product.base_price);
}

const AUTH_EVENT = "zyro-auth-change";

function subscribeAuth(onChange: () => void) {
  window.addEventListener(AUTH_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTH_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getToken() {
  return localStorage.getItem("zyro-token");
}

export function ChatProductCard({ product }: { product: ChatProduct }) {
  const variants = useMemo(
    () => (product.variants ?? []).filter((v) => v.stock_quantity > 0),
    [product.variants]
  );

  const [variantId, setVariantId] = useState<number | null>(variants[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const image =
    product.images?.find((img) => img.is_primary)?.image_url ??
    product.images?.[0]?.image_url ??
    "";
  const price = unitPrice(product, variantId);
  const selected = variants.find((v) => v.id === variantId) ?? null;
  const maxQty = selected ? Math.min(selected.stock_quantity, 10) : 1;
  const token = useSyncExternalStore(subscribeAuth, getToken, getToken);

  async function addToCart() {
    if (!variantId || !selected) return;
    setState("loading");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ variant_id: variantId, quantity: qty }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.detail || "Could not add to cart");
      }

      holdPiece({
        slug: product.slug,
        name: product.name,
        price,
        image,
        size: selected.size,
      });

      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch (err) {
      console.error(err);
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <article className="w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
      <div className="relative aspect-[4/3] w-full bg-[#1f1f1f]">
        {image ? (
          <Image
            src={image}
            alt={product.images?.[0]?.alt_text || product.name}
            fill
            sizes="300px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/40">
            No image
          </div>
        )}
      </div>

      <div className="space-y-3 p-3">
        <div className="space-y-0.5">
          <h3 className="line-clamp-2 text-sm font-medium text-white">{product.name}</h3>
          <p className="text-sm text-white/70">{formatPrice(price)}</p>
        </div>

        {variants.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wide text-white/40">
              {variants.length === 1 ? "Size" : "Choose option"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((variant) => {
                const label =
                  variants.length === 1
                    ? variant.size
                    : `${variant.size} · ${variant.color}`;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setVariantId(variant.id);
                      setQty(1);
                    }}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                      variant.id === variantId
                        ? "border-white bg-white text-black"
                        : "border-white/20 text-white/70 hover:border-white/50"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-white/15 px-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-sm tabular-nums text-white">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={qty >= maxQty}
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 disabled:opacity-30"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={!variantId || state === "loading"}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors",
              state === "done"
                ? "bg-emerald-500 text-white"
                : state === "error"
                  ? "bg-red-500/90 text-white"
                  : "bg-white text-black hover:bg-white/90 disabled:opacity-40"
            )}
          >
            {state === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {state === "done" && <Check className="h-3.5 w-3.5" />}
            {state === "idle" && <ShoppingBag className="h-3.5 w-3.5" />}
            {state === "done"
              ? "Added"
              : state === "error"
                ? "Failed"
                : state === "loading"
                  ? "Adding"
                  : "Add to cart"}
          </button>
        </div>

        {!token && (
          <p className="text-[11px] leading-tight text-amber-300/80">
            Log in to sync this to your cart.
          </p>
        )}
      </div>
    </article>
  );
}
