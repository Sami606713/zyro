"use client";

import { fetchProduct } from "@/lib/storefront-api";
import { formatPrice } from "@/lib/format";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
  variants: { id: number; size: string; color: string; sku: string; stock_quantity: number; price_override: number | null }[];
  category: { id: number; name: string; slug: string } | null;
};

export function ProductQuickView({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct(slug)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!product) return null;

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-bg">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface"
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-surface">
            {primaryImage && (
              <Image
                src={primaryImage.image_url}
                alt={primaryImage.alt_text || product.name}
                fill
                sizes="(min-width: 768px) 40vw, 80vw"
                className="object-cover"
                loading="lazy"
              />
            )}
          </div>
          <div className="flex flex-col p-6">
            {product.category && (
              <Link href={`/collections/${product.category.slug}`} className="text-sm text-muted hover:text-fg">
                {product.category.name}
              </Link>
            )}
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-[-0.03em]">{product.name}</h2>
            <p className="mt-2 text-xl text-accent">{formatPrice(product.base_price)}</p>
            {product.description && (
              <p className="mt-4 text-sm leading-6 text-muted">{product.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <span
                  key={v.id}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    v.stock_quantity > 0 ? "border-white/20" : "border-red-500/30 text-red-400"
                  }`}
                >
                  {v.size} / {v.color}
                </span>
              ))}
            </div>
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="btn btn-primary mt-6 w-full"
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
