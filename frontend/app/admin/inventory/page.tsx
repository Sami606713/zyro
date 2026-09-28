"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  is_active: boolean;
  variants: { id: number; size: string; color: string; sku: string; stock_quantity: number }[];
};

export default function InventoryPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [editingStock, setEditingStock] = useState<{ variantId: number; value: number } | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get<Product[]>("/admin/products?limit=500", token)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()));
    if (filter === "low") return matchesSearch && p.variants.some((v) => v.stock_quantity > 0 && v.stock_quantity < 5);
    if (filter === "out") return matchesSearch && p.variants.some((v) => v.stock_quantity === 0);
    return matchesSearch;
  });

  const updateStock = async (variantId: number, newStock: number) => {
    try {
      await api.put(`/admin/variants/${variantId}`, { stock_quantity: newStock }, token);
      setProducts((prev) =>
        prev.map((p) => ({
          ...p,
          variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock_quantity: newStock } : v)),
        }))
      );
      setEditingStock(null);
    } catch (err) {
      console.error("Failed to update stock:", err);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading inventory...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Inventory</h1>
      <p className="mt-1 text-sm text-muted">Manage stock levels for all product variants.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <div className="flex gap-2">
          {(["all", "low", "out"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm capitalize transition-colors",
                filter === f ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg",
              )}
            >
              {f === "all" ? "All" : f === "low" ? "Low stock" : "Out of stock"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted">No products found.</p>
        ) : (
          filtered.map((product) => (
            <div key={product.id} className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted">{formatPrice(product.base_price)}</p>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-xs",
                  product.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
                )}>
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{variant.color} / {variant.size}</p>
                      <p className="text-xs text-muted">SKU: {variant.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingStock?.variantId === variant.id ? (
                        <>
                          <input
                            type="number"
                            value={editingStock.value}
                            onChange={(e) => setEditingStock({ variantId: variant.id, value: parseInt(e.target.value) || 0 })}
                            className="w-20 rounded-lg bg-white/5 px-2 py-1 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-accent"
                            min="0"
                          />
                          <button
                            onClick={() => updateStock(variant.id, editingStock.value)}
                            className="rounded-full bg-accent px-3 py-1 text-xs text-ink"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStock(null)}
                            className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span className={cn(
                            "text-sm font-medium",
                            variant.stock_quantity === 0 ? "text-red-400" :
                            variant.stock_quantity < 5 ? "text-yellow-400" : "text-green-400",
                          )}>
                            {variant.stock_quantity} in stock
                          </span>
                          <button
                            onClick={() => setEditingStock({ variantId: variant.id, value: variant.stock_quantity })}
                            className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted hover:text-fg"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
