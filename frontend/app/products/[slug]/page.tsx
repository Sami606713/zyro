import { ProductPurchase } from "@/components/product-purchase";
import { formatPrice, getProduct, products, productsIn } from "@/lib/catalog";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? `${product.name} | Zyro` : "Zyro" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = productsIn(product.categorySlug).filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <main>
      <div className="lg:grid lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="relative min-h-[52vh] bg-[#121316] lg:sticky lg:top-24 lg:h-[calc(100dvh-7rem)] lg:min-h-0">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-contain object-center"
          />
        </div>
        <div className="flex flex-col justify-center bg-surface px-5 py-10 md:px-10 lg:px-12 lg:py-14">
          <Link href={`/collections/${product.categorySlug}`} className="text-sm text-muted hover:text-fg">
            {product.category}
          </Link>
          <h1 className="font-display mt-3 max-w-[12ch] pb-1 text-5xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-medium text-accent">{formatPrice(product.price)}</span>
            {product.compareAt ? (
              <span className="text-lg text-muted line-through">{formatPrice(product.compareAt)}</span>
            ) : null}
          </p>
          <dl className="mt-8 max-w-md divide-y divide-line border-y border-line">
            <div className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-muted">Fabric</dt>
              <dd>{product.fabric}</dd>
            </div>
            <div className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-muted">Cut</dt>
              <dd>Daily wear</dd>
            </div>
            <div className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-muted">Floor</dt>
              <dd>Haripur</dd>
            </div>
          </dl>
          <ProductPurchase product={product} />
        </div>
      </div>
      {others.length > 0 ? (
        <section className="border-t border-line px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="font-display text-3xl tracking-[-0.03em]">More in {product.category}</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {others.map((item) => (
                <Link key={item.slug} href={`/products/${item.slug}`} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-white/10">
                    <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 30vw, 50vw" className="object-cover" />
                  </div>
                  <span className="mt-3 block text-lg">{item.name}</span>
                  <span className="text-sm text-muted">{formatPrice(item.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
