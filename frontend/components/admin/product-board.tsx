"use client";

import { StatusPill } from "@/components/admin/status-pill";
import { sampleProducts } from "@/lib/admin-sample";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const filters = ["All", "Apparel", "Bottomwear", "Outerwear", "Accessories"] as const;

export function ProductBoard() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const rows = filter === "All" ? sampleProducts : sampleProducts.filter((product) => product.category === filter);

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((product) => (
          <article key={product.slug} className="rounded-[1.5rem] bg-white/5 p-1">
            <div className="overflow-hidden rounded-[1.25rem] bg-[#121316]">
              <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] bg-[#121316]">
                <Image src={product.image} alt={product.alt} fill className="object-cover" sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw" />
              </Link>
              <div className="flex items-start justify-between gap-3 px-4 py-4">
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-muted uppercase">{product.category}</p>
                  <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.03em]">
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  </h2>
                  <p className="mt-2 text-sm">{formatPrice(product.price)}</p>
                </div>
                <StatusPill status={product.status} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
