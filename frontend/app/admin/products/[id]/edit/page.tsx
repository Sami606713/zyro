"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type ProductImage = {
  id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductVariant = {
  id: number;
  size: string;
  color: string;
  sku: string;
  stock_quantity: number;
  price_override: number | null;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  category_id: number;
  is_active: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { token } = useAdminAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.get<Product>(`/admin/products/${id}`, token),
      api.get<Category[]>("/admin/categories", token),
    ])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
        setName(prod.name);
        setSlug(prod.slug);
        setDescription(prod.description || "");
        setBasePrice(prod.base_price.toString());
        setCategoryId(prod.category_id.toString());
        setIsActive(prod.is_active);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.put(`/admin/products/${id}`, {
        name,
        slug,
        description,
        base_price: parseFloat(basePrice),
        category_id: parseInt(categoryId),
        is_active: isActive,
      }, token);

      for (let i = 0; i < newImages.length; i++) {
        const formData = new FormData();
        formData.append("file", newImages[i]);
        await api.upload(`/admin/products/${id}/images`, formData, token);
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    try {
      await api.put(`/admin/products/${id}/status`, { is_active: !isActive }, token);
      setIsActive(!isActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const deleteImage = async (imageId: number) => {
    try {
      await api.delete(`/admin/images/${imageId}`, token);
      setProduct((prev) => prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading product...</p>;
  }

  if (!product) {
    return <p className="py-20 text-center text-muted">Product not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Edit product</h1>
          <p className="mt-1 text-sm text-muted">Update product details, variants, and images.</p>
        </div>
        <button
          onClick={toggleStatus}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Basic info</h2>
          <div>
            <label className="mb-1 block text-sm text-muted">Product name</label>
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
              rows={4}
              className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Pricing & category</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-muted">Base price (PKR)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Current images</h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
            {product.images.map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
                <img src={image.image_url} alt={image.alt_text || ""} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => deleteImage(image.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  ✕
                </button>
                {image.is_primary && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-accent px-2 py-0.5 text-xs text-ink">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Add new images</h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
            {newImagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
                <img src={preview} alt={`New ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 text-muted hover:border-accent hover:text-accent transition-colors">
              <span className="text-2xl">+</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Variants ({product.variants.length})</h2>
          <div className="space-y-3">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                <div>
                  <p className="font-medium">{variant.color} / {variant.size}</p>
                  <p className="text-sm text-muted">SKU: {variant.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{variant.stock_quantity} in stock</p>
                  {variant.price_override && (
                    <p className="text-xs text-muted">Rs. {variant.price_override}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

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
            onClick={() => router.push("/admin/products")}
            className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-muted hover:text-fg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
