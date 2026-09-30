"use client";

import { ProductPurchase } from "@/components/product-purchase";
import { WishlistButton } from "@/components/wishlist-button";
import { ReviewForm } from "@/components/review-form";
import { ReviewList } from "@/components/review-list";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { fetchProduct, fetchRelatedProducts } from "@/lib/storefront-api";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  category_id: number | null;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
  variants: { id: number; size: string; color: string; sku: string; stock_quantity: number; price_override: number | null }[];
  category: { id: number; name: string; slug: string } | null;
  average_rating: number | null;
  review_count: number;
};

export function ProductPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [others, setOthers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    fetchProduct(slug)
      .then((prod) => {
        setProduct(prod);
        return fetchRelatedProducts(slug, 4);
      })
      .then(setOthers)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-muted">Product not found.</p>
      </main>
    );
  }

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.image_url),
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: "Zyro" },
    offers: {
      "@type": "Offer",
      price: product.base_price,
      priceCurrency: "PKR",
      availability: product.variants.some((v) => v.stock_quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.average_rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.average_rating,
          reviewCount: product.review_count,
        }
      : undefined,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="lg:grid lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="relative min-h-[52vh] bg-[#121316] lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)] lg:min-h-0">
          {primaryImage && (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-contain object-center"
              placeholder="blur"
              blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23121316'/%3E%3C/svg%3E"
            />
          )}
        </div>
        <div className="flex flex-col justify-center bg-surface px-5 py-10 md:px-10 lg:px-12 lg:py-14">
          <div className="flex items-center justify-between">
            {product.category && (
              <Link href={`/collections/${product.category.slug}`} className="text-sm text-muted hover:text-fg">
                {product.category.name}
              </Link>
            )}
            <WishlistButton productId={product.id} />
          </div>
          <h1 className="font-display mt-3 max-w-[12ch] pb-1 text-5xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
            {product.name}
          </h1>
          {product.average_rating && (
            <p className="mt-2 text-sm text-muted">
              {product.average_rating.toFixed(1)} ({product.review_count} reviews)
            </p>
          )}
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-medium text-accent">{formatPrice(product.base_price)}</span>
          </p>
          {product.description && (
            <p className="mt-6 max-w-md text-sm leading-6 text-muted">{product.description}</p>
          )}
          <ErrorBoundary>
            <ProductPurchase product={product} />
          </ErrorBoundary>
        </div>
      </div>

      <section className="border-t border-line px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-3xl tracking-[-0.03em]">Reviews</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <ReviewForm productSlug={slug} onReviewAdded={() => setRefreshReviews((r) => r + 1)} />
            <ReviewList key={refreshReviews} productSlug={slug} />
          </div>
        </div>
      </section>

      {others.length > 0 ? (
        <section className="border-t border-line px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="font-display text-3xl tracking-[-0.03em]">More products</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {others.map((item) => {
                const itemImage = item.images.find((img) => img.is_primary) || item.images[0];
                return (
                  <Link key={item.slug} href={`/products/${item.slug}`} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-white/10">
                      {itemImage && (
                        <Image
                          src={itemImage.image_url}
                          alt={itemImage.alt_text || item.name}
                          fill
                          sizes="(min-width: 768px) 30vw, 50vw"
                          className="object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <span className="mt-3 block text-lg">{item.name}</span>
                    <span className="text-sm text-muted">{formatPrice(item.base_price)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
