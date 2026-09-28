"use client";

import { StatusPill } from "@/components/admin/status-pill";
import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  category_id: number;
  is_active: boolean;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
  variants: { id: number; size: string; color: string; sku: string; stock_quantity: number }[];
};

const filters = ["All", "Active", "Inactive"] as const;

export function ProductBoard() {
  const { token } = useAdminAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .get<ApiProduct[]>("/admin/products?limit=500", token)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = products.filter((p) => {
    if (filter === "Active") return p.is_active;
    if (filter === "Inactive") return !p.is_active;
    return true;
  });

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading products...</p>;
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
              filter === item ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted">No products found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
            return (
              <article key={product.id} className="rounded-[1.5rem] bg-white/5 p-1">
                <div className="overflow-hidden rounded-[1.25rem] bg-[#121316]">
                  <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] bg-[#121316]">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.image_url}
                        alt={primaryImage.alt_text || product.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
                      />
                    ) : null}
                  </Link>
                  <div className="flex items-start justify-between gap-3 px-4 py-4">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Product</p>
                      <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.03em]">
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h2>
                      <p className="mt-2 text-sm">{formatPrice(product.base_price)}</p>
                    </div>
                    <StatusPill status={product.is_active ? "Active" : "Inactive"} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
