const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchProducts(params?: { category_id?: number; search?: string; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.category_id) searchParams.set("category_id", params.category_id.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const res = await fetch(`${API_BASE}/products?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(slug: string) {
  const res = await fetch(`${API_BASE}/products/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchCategory(slug: string) {
  const res = await fetch(`${API_BASE}/categories/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}
