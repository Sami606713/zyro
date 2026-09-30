"use client";

import { ProductCard } from "@/components/product-card";
import { fetchProducts } from "@/lib/storefront-api";
import { use, useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  description: string | null;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
  category: { id: number; name: string; slug: string } | null;
};

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = use(searchParams);
  const query = (q ?? "").trim().toLowerCase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ limit: 100 })
      .then((data) => setProducts(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const found = query
    ? products.filter((product) =>
        `${product.name} ${product.description || ""} ${product.category?.name || ""}`.toLowerCase().includes(query)
      )
    : products;

  return (
    <main className="px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="font-display text-4xl tracking-[-0.04em] md:text-6xl">Search</h1>
        <p className="mt-3 text-muted">
          {loading ? "Loading..." : query ? `${found.length} matches for "${q}".` : "Every piece currently on the floor."}
        </p>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {found.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
