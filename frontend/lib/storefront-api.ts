import { api } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
};

export type ProductVariant = {
  id: number;
  product_id: number;
  size: string;
  color: string;
  sku: string;
  stock_quantity: number;
  price_override: number | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  category_id: number | null;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category: { id: number; name: string; slug: string } | null;
  average_rating: number | null;
  review_count: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
};

export type Review = {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user?: { id: number; first_name: string; last_name: string };
};

export async function fetchProducts(params?: {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  sort_by?: string;
  sort_order?: string;
  skip?: number;
  limit?: number;
}): Promise<PaginatedResponse<Product>> {
  const searchParams = new URLSearchParams();
  if (params?.category_id) searchParams.set("category_id", params.category_id.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.min_price) searchParams.set("min_price", params.min_price.toString());
  if (params?.max_price) searchParams.set("max_price", params.max_price.toString());
  if (params?.size) searchParams.set("size", params.size);
  if (params?.color) searchParams.set("color", params.color);
  if (params?.sort_by) searchParams.set("sort_by", params.sort_by);
  if (params?.sort_order) searchParams.set("sort_order", params.sort_order);
  if (params?.skip !== undefined) searchParams.set("skip", params.skip.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const res = await fetch(`${API_BASE}/products?${searchParams}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Failed to fetch products");
  }
  return res.json() as Promise<PaginatedResponse<Product>>;
}

export async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json() as Promise<Product>;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json() as Promise<Category[]>;
}

export async function fetchCategory(slug: string): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json() as Promise<Category>;
}

export async function fetchProductReviews(slug: string, skip = 0, limit = 20): Promise<PaginatedResponse<Review>> {
  const searchParams = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
  const res = await fetch(`${API_BASE}/products/${slug}/reviews?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json() as Promise<PaginatedResponse<Review>>;
}

export async function fetchRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/${slug}/related?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch related products");
  return res.json() as Promise<Product[]>;
}

export async function fetchSizeGuide(): Promise<{ sizes: Array<{ size: string; chest: string; waist: string; hips: string }> }> {
  const res = await fetch(`${API_BASE}/size-guide`);
  if (!res.ok) throw new Error("Failed to fetch size guide");
  return res.json();
}
