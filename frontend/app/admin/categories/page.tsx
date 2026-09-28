"use client";

import { DeskHeading } from "@/components/admin/desk-heading";
import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
};

export default function AdminCategoriesPage() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get<Category[]>("/admin/categories", token)
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const deleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/categories/${id}`, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading categories...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <DeskHeading
          kicker="Categories"
          title="Product categories."
          detail="Organize products into groups and collections."
        />
        <button
          onClick={() => router.push("/admin/categories/new")}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink"
        >
          + Add category
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {categories.length === 0 ? (
          <p className="py-20 text-center text-muted">No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-sm text-muted">/{cat.slug}</p>
                {cat.description && (
                  <p className="mt-1 text-xs text-muted">{cat.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/categories/${cat.id}/edit`)}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-muted hover:text-fg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  disabled={deleting === cat.id}
                  className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                >
                  {deleting === cat.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
