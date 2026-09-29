import { TiltFrame } from "@/components/tilt-frame";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  images: { id: number; image_url: string; alt_text: string | null; is_primary: boolean }[];
  category?: { id: number; name: string; slug: string };
};

type Product = {
  slug: string;
  name: string;
  image: string;
  alt: string;
  category: string;
  price: number;
};

function mapProduct(product: ApiProduct): Product {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  return {
    slug: product.slug,
    name: product.name,
    image: primaryImage?.image_url || "",
    alt: primaryImage?.alt_text || product.name,
    category: product.category?.name || "",
    price: product.base_price,
  };
}

export function ProductCard({ product }: { product: ApiProduct }) {
  const mapped = mapProduct(product);

  return (
    <article>
      <Link
        href={`/products/${mapped.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        aria-label={`View ${mapped.name}`}
      >
        <TiltFrame>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] bg-surface p-1.5 ring-1 ring-white/10">
            <div className="relative h-full overflow-hidden rounded-[1.1rem]">
              <Image
                src={mapped.image}
                alt={mapped.alt}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 80vw"
                className="object-cover transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%231a1a1a'/%3E%3C/svg%3E"
              />
            </div>
          </div>
        </TiltFrame>
        <p className="mt-3 text-xs tracking-[0.08em] text-muted uppercase">{mapped.category}</p>
        <h3 className="font-display mt-1 text-lg tracking-[-0.02em]">{mapped.name}</h3>
        <p className="mt-1 text-sm">
          {formatPrice(mapped.price)}
        </p>
      </Link>
    </article>
  );
}
