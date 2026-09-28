"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Variant = {
  size: string;
  color: string;
  sku: string;
  stock_quantity: number;
  price_override: string;
};

const emptyVariant: Variant = {
  size: "",
  color: "",
  sku: "",
  stock_quantity: 0,
  price_override: "",
};

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [variants, setVariants] = useState<Variant[]>([{ ...emptyVariant }]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;
    api.get<Category[]>("/admin/categories", token)
      .then(setCategories)
      .catch(console.error);
  }, [token]);

  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addVariant = () => setVariants([...variants, { ...emptyVariant }]);

  const removeVariant = (index: number) => {
    if (variants.length > 1) setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const productRes = await fetch(`${apiUrl}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          base_price: parseFloat(basePrice),
          category_id: parseInt(categoryId),
        }),
      });

      if (!productRes.ok) {
        const err = await productRes.json().catch(() => ({ detail: "Failed to create product" }));
        throw new Error(err.detail || "Failed to create product");
      }

      const product = await productRes.json();

      for (const variant of variants) {
        if (!variant.size || !variant.color) continue;
        await fetch(`${apiUrl}/admin/products/${product.id}/variants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            size: variant.size,
            color: variant.color,
            sku: variant.sku || `${product.slug}-${variant.size}-${variant.color}`.toLowerCase(),
            stock_quantity: variant.stock_quantity,
            price_override: variant.price_override ? parseFloat(variant.price_override) : null,
          }),
        });
      }

      for (let i = 0; i < images.length; i++) {
        const formData = new FormData();
        formData.append("file", images[i]);
        await fetch(`${apiUrl}/admin/products/${product.id}/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Add product</h1>
      <p className="mt-1 text-sm text-muted">Create a new product with variants and images.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Basic info</h2>
          <div>
            <label className="mb-1 block text-sm text-muted">Product name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Night Crew"
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
              placeholder="night-crew"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Describe the product..."
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Pricing</h2>
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
                placeholder="4999"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Compare-at price (optional)</label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="6999"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Category</h2>
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
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-muted hover:text-fg transition-colors"
            >
              + Add variant
            </button>
          </div>
          {variants.map((variant, index) => (
            <div key={index} className="rounded-xl bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">Variant {index + 1}</p>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs text-muted">Size</label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                    placeholder="M"
                    className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Color</label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                    placeholder="Black"
                    className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">SKU</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                    placeholder="Auto-generate"
                    className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted">Stock</label>
                  <input
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) => handleVariantChange(index, "stock_quantity", parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs text-muted">Price override (optional)</label>
                <input
                  type="number"
                  value={variant.price_override}
                  onChange={(e) => handleVariantChange(index, "price_override", e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Leave empty to use base price"
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Images</h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
                <img src={preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 text-muted hover:border-accent hover:text-accent transition-colors">
              <span className="text-2xl">+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create product"}
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
