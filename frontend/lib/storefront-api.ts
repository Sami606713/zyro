const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

type ProductImage = {
  id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
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
  images: ProductImage[];
  variants: ProductVariant[];
  category: { id: number; name: string; slug: string };
};

export async function fetchProducts(params?: { category_id?: number; search?: string; limit?: number }): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (params?.category_id) searchParams.set("category_id", params.category_id.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const res = await fetch(`${API_BASE}/products?${searchParams}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json() as Promise<Product[]>;
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
