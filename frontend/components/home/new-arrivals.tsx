"use client";

import { ProductCard } from "@/components/product-card";
import { fetchCategories, fetchProducts } from "@/lib/storefront-api";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  category_id: number | null;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

export function NewArrivals() {
  const [active, setActive] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts({ limit: 100 })])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods.items);
        if (cats.length > 0) setActive(cats[0].slug);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible = active ? products.filter((p) => p.category_id === categories.find((c) => c.slug === active)?.id) : [];

  if (loading) {
    return (
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display max-w-[12ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
          New arrivals
        </h2>
        <div className="mt-8 flex gap-6 border-b border-line" role="tablist" aria-label="New arrivals">
          {categories.map((cat) => {
            const selected = cat.slug === active;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(cat.slug)}
                className={`-mb-px border-b-2 pb-3 text-sm tracking-wide ${
                  selected ? "border-accent text-fg" : "border-transparent text-muted"
                }`}
              >
                {cat.name}
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
