"use client";

import { ProductCard } from "@/components/product-card";
import { fetchProducts } from "@/lib/storefront-api";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
};

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 100 })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  const items = products.slice(0, 4);
  const [lead, ...rest] = items;

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display max-w-[10ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
            Best sellers
          </h2>
          <Link href="/shop" className="text-sm text-accent">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {lead ? (
            <div className="lg:col-span-7">
              <ProductCard product={lead} />
            </div>
          ) : null}
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
