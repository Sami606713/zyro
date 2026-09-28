import { ProductCard } from "@/components/product-card";
import { categories, productsIn, type CategorySlug } from "@/lib/catalog";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const slugs = categories.map((category) => category.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  return { title: category ? `${category.title} | Zyro` : "Zyro" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const items = productsIn(slug as CategorySlug);
  const pieces = items.length === 1 ? "1 piece on the floor." : `${items.length} pieces on the floor.`;

  return (
    <main>
      <div className="relative min-h-[42vh] bg-[#121316]">
        <Image
          src={category.image}
          alt={category.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-black/25" />
        <div className="relative z-10 flex min-h-[42vh] items-end px-4 pt-10 pb-8 md:px-8 md:pb-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Link href="/collections" className="text-sm text-fg/75 hover:text-fg">
              Collections
            </Link>
            <h1 className="font-display mt-3 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{category.title}</h1>
            <p className="mt-3 text-sm text-fg/80">{pieces}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
        <nav className="flex flex-wrap gap-2" aria-label="Collections">
          {categories.map((item) => {
            const current = item.slug === category.slug;
            return (
              <Link
                key={item.slug}
                href={`/collections/${item.slug}`}
                aria-current={current ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm ${
                  current ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
