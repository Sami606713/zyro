"use client";

import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { Pagination } from "@/components/pagination";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProductGridSkeleton } from "@/components/loading-spinner";
import { fetchCategories, fetchProducts } from "@/lib/storefront-api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Filters = {
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  sort_by?: string;
  sort_order?: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState<Filters>({});
  const limit = 12;

  const loadProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProducts({ ...filters, skip, limit })
      .then((data) => {
        setProducts(data.items);
        setTotal(data.total);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
      })
      .finally(() => setLoading(false));
  }, [filters, skip, limit]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
    setSkip(0);
  };

  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
  };

  return (
    <main className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Shop</h1>
        <p className="mt-4 max-w-[42ch] text-muted">
          Apparel, bottomwear, outerwear, and accessories from the Haripur floor.
        </p>

        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Shop categories">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="rounded-full border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <ProductFilters onFilter={handleFilter} />

        {error ? (
          <div className="mt-10 rounded-xl bg-red-500/10 p-4 text-red-400" role="alert">
            {error}
          </div>
        ) : loading ? (
          <div className="mt-10">
            <ProductGridSkeleton />
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <Pagination total={total} skip={skip} limit={limit} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </main>
  );
}
