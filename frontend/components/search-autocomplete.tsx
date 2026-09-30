"use client";

import { fetchProducts } from "@/lib/storefront-api";
import { formatPrice } from "@/lib/format";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
};

export function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({ search: query, limit: 5 });
        setResults(data.items);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/products/${slug}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-3">
        <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search products..."
          className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-results"
          role="combobox"
        />
        {loading && (
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          id="search-results"
          className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-bg shadow-xl"
          role="listbox"
        >
          {results.map((product) => {
            const image = product.images.find((img) => img.is_primary) || product.images[0];
            return (
              <li key={product.id} role="option" aria-selected="false">
                <button
                  type="button"
                  onClick={() => handleSelect(product.slug)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface"
                >
                  {image && (
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <Image src={image.image_url} alt="" fill sizes="40px" className="object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted">{formatPrice(product.base_price)}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-2xl border border-line bg-bg p-4 shadow-xl">
          <p className="text-sm text-muted">No products found</p>
        </div>
      )}
    </div>
  );
}
