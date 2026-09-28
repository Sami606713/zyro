"use client";

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

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.get<Category[]>(`/admin/categories`, token),
    ])
      .then(([cats]) => {
        setCategories(cats);
        const cat = cats.find((c) => c.id === parseInt(params.id));
        if (cat) {
          setCategory(cat);
          setName(cat.name);
          setSlug(cat.slug);
          setDescription(cat.description || "");
          setParentId(cat.parent_id?.toString() || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.put(`/admin/categories/${params.id}`, {
        name,
        slug,
        description: description || null,
        parent_id: parentId ? parseInt(parentId) : null,
      }, token);
      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading category...</p>;
  }

  if (!category) {
    return <p className="py-20 text-center text-muted">Category not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Edit category</h1>
      <p className="mt-1 text-sm text-muted">Update category details.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="mb-1 block text-sm text-muted">Category name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Parent category (optional)</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">None (top level)</option>
            {categories.filter((c) => c.id !== category.id).map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-muted hover:text-fg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
