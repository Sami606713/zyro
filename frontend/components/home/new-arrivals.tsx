"use client";

import { ProductCard } from "@/components/product-card";
import { products, type CategorySlug } from "@/lib/catalog";
import Link from "next/link";
import { useState } from "react";

const tabs: { slug: CategorySlug; label: string }[] = [
  { slug: "apparel", label: "Apparel" },
  { slug: "bottomwear", label: "Bottomwear" },
  { slug: "accessories", label: "Accessories" },
];

export function NewArrivals() {
  const [active, setActive] = useState<CategorySlug>("apparel");
  const visible = products.filter((product) => product.categorySlug === active);

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display max-w-[12ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
          New arrivals
        </h2>
        <div className="mt-8 flex gap-6 border-b border-line" role="tablist" aria-label="New arrivals">
          {tabs.map((tab) => {
            const selected = tab.slug === active;
            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(tab.slug)}
                className={`-mb-px border-b-2 pb-3 text-sm tracking-wide ${
                  selected ? "border-accent text-fg" : "border-transparent text-muted"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4" role="tabpanel">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`/collections/${active}`}
            className="inline-flex h-11 items-center border border-fg/30 px-6 text-sm tracking-wide hover:border-accent hover:text-accent"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
