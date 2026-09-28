"use client";

import { DeskHeading } from "@/components/admin/desk-heading";
import { StatusPill } from "@/components/admin/status-pill";
import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  category_id: number;
  is_active: boolean;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
  variants: { id: number; size: string; color: string; sku: string; stock_quantity: number }[];
};

export default function AdminProductsPage() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.get<Product[]>("/admin/products?limit=100", token)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some((v) => v.sku.toLowerCase().includes(search.toLowerCase()));
    if (filter === "active") return matchesSearch && p.is_active;
    if (filter === "inactive") return matchesSearch && !p.is_active;
    return matchesSearch;
  });

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product? This will also delete all variants and images.")) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/products/${id}`, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <DeskHeading
          kicker="Products"
          title="Product catalog."
          detail="All products from your backend. Add, edit, or remove items."
        />
        <Link
          href="/admin/products/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full bg-white/5 px-4 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm capitalize transition-colors",
                filter === f ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-20 text-center text-muted">Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-muted">No products found.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
            return (
              <article key={product.id} className="rounded-[1.5rem] bg-white/5 p-1">
                <div className="overflow-hidden rounded-[1.25rem] bg-[#121316]">
                  {primaryImage ? (
                    <div className="relative aspect-[4/5] bg-[#121316]">
                      <Image
                        src={primaryImage.image_url}
                        alt={primaryImage.alt_text || product.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-[#121316]" />
                  )}
                  <div className="flex items-start justify-between gap-3 px-4 py-4">
                    <div>
                      <h2 className="font-display text-xl font-semibold tracking-[-0.03em]">{product.name}</h2>
                      <p className="mt-1 text-sm">{formatPrice(product.base_price)}</p>
                      <p className="mt-1 text-xs text-muted">
                        {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <StatusPill status={product.is_active ? "Active" : "Inactive"} />
                  </div>
                  <div className="flex gap-2 px-4 pb-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex-1 rounded-full bg-white/5 px-3 py-2 text-center text-xs text-muted hover:text-fg transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      disabled={deleting === product.id}
                      className="flex-1 rounded-full bg-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {deleting === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
