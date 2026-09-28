import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";

const slugs = ["charcoal-overshirt", "stone-trouser", "matte-belt"];

export function ShopTheLook() {
  const pieces = slugs.map((slug) => getProduct(slug)).filter((item) => item !== undefined);

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src="/looks/portrait.jpg"
            alt="Man in a charcoal overshirt and black trousers."
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-[center_20%]"
          />
        </div>
        <div>
          <h2 className="font-display max-w-[10ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
            Shop the look
          </h2>
          <p className="mt-4 max-w-[36ch] text-muted">The overshirt, the trouser, and the belt worn together.</p>
          <ol className="mt-8 divide-y divide-line">
            {pieces.map((piece, index) => (
              <li key={piece.slug}>
                <Link href={`/products/${piece.slug}`} className="flex items-center gap-4 py-4">
                  <span className="w-6 text-sm text-muted">{index + 1}</span>
                  <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-surface">
                    <Image src={piece.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg">{piece.name}</span>
                    <span className="text-sm text-muted">{formatPrice(piece.price)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
