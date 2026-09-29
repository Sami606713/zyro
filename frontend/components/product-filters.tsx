"use client";

import { useState } from "react";

type Filters = {
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  sort_by?: string;
  sort_order?: string;
};

export function ProductFilters({ onFilter }: { onFilter: (filters: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters };
    if (value) {
      (newFilters as any)[key] = key.includes("price") ? Number(value) : value;
    } else {
      delete (newFilters as any)[key];
    }
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm"
      >
        Filters
        {Object.keys(filters).length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-ink">
            {Object.keys(filters).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-4 grid gap-4 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs text-muted">Min Price</label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => handleChange("min_price", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg bg-bg px-3 text-sm outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Max Price</label>
            <input
              type="number"
              placeholder="10000"
              onChange={(e) => handleChange("max_price", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg bg-bg px-3 text-sm outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Size</label>
            <select
              onChange={(e) => handleChange("size", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg bg-bg px-3 text-sm outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">All</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Sort By</label>
            <select
              onChange={(e) => handleChange("sort_by", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg bg-bg px-3 text-sm outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Newest</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted">Order</label>
            <select
              onChange={(e) => handleChange("sort_order", e.target.value)}
              className="mt-1 h-10 w-full rounded-lg bg-bg px-3 text-sm outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="h-10 rounded-lg border border-white/20 px-4 text-sm hover:border-fg"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
