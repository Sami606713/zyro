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

export function SaleRow() {
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
      <section className="bg-surface px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-center text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-surface px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-center text-sm font-medium tracking-[0.28em] uppercase">Latest products</h2>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          {products.slice(0, 6).map((product) => (
            <div key={product.slug} className="w-[72%] shrink-0 sm:w-[46%] lg:w-[23%]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center border border-fg/30 px-6 text-sm tracking-wide hover:border-accent hover:text-accent"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
