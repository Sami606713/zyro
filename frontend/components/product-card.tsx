import { TiltFrame } from "@/components/tilt-frame";
import { formatPrice, type Product } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <Link href={`/products/${product.slug}`} className="group block">
        <TiltFrame>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] bg-surface p-1.5 ring-1 ring-white/10">
            <div className="relative h-full overflow-hidden rounded-[1.1rem]">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 80vw"
                className="object-cover transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
              />
            </div>
          </div>
        </TiltFrame>
        <p className="mt-3 text-xs tracking-[0.08em] text-muted uppercase">{product.fabric}</p>
        <h3 className="font-display mt-1 text-lg tracking-[-0.02em]">{product.name}</h3>
        <p className="text-sm text-muted">{product.category}</p>
        <p className="mt-1 text-sm">
          {product.compareAt ? (
            <span className="mr-2 text-muted line-through">{formatPrice(product.compareAt)}</span>
          ) : null}
          {formatPrice(product.price)}
        </p>
      </Link>
    </article>
  );
}
