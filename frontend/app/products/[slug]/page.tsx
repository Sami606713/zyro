import type { Metadata } from "next";
import { ProductPageContent } from "./page-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/products/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Not found");
    const product = await res.json();
    return {
      title: product.meta_title || `${product.name} | Zyro`,
      description: product.meta_description || product.description || `Buy ${product.name} at Zyro`,
      openGraph: {
        title: product.meta_title || `${product.name} | Zyro`,
        description: product.meta_description || product.description || "",
        images: product.images?.[0]?.image_url ? [product.images[0].image_url] : [],
        type: "website",
      },
    };
  } catch {
    return { title: "Product | Zyro" };
  }
}

export default function ProductPage({ params }: Props) {
  return <ProductPageContent params={params} />;
}
