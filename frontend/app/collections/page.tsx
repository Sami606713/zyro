import { categories, productsIn } from "@/lib/catalog";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collections | Zyro",
};

const notes: Record<string, string> = {
  apparel: "Overshirts, an oxford, and the night crew.",
  bottomwear: "Stone and black, cut straight.",
  outerwear: "The field jacket.",
  accessories: "The matte belt.",
};

export default function CollectionsPage() {
  const [lead, ...rest] = categories;

  return (
    <main className="px-4 pt-8 pb-16 md:px-8 md:pt-10 md:pb-24">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-medium tracking-[0.22em] text-accent uppercase">Haripur</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Collections</h1>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Four floors from the shop. Apparel, bottomwear, outerwear, and accessories.
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-2 lg:items-stretch">
          <CollectionPanel category={lead} featured />
          <div className="flex flex-col gap-3">
            {rest.map((category) => (
              <CollectionPanel key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function CollectionPanel({
  category,
  featured = false,
}: {
  category: (typeof categories)[number];
  featured?: boolean;
}) {
  const count = productsIn(category.slug).length;
  const pieces = count === 1 ? "1 piece" : `${count} pieces`;

  return (
    <Link
      href={`/collections/${category.slug}`}
      className={`group relative block overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-white/10 ${
        featured ? "min-h-[42vh] lg:min-h-[48vh]" : "min-h-48 flex-1"
      }`}
    >
      <Image
        src={category.image}
        alt={category.alt}
        fill
        priority={featured}
        sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
        className="object-cover transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <p className="text-[11px] tracking-[0.18em] text-fg/70 uppercase">{pieces}</p>
        <h2 className={`font-display mt-1 font-semibold tracking-[-0.04em] ${featured ? "text-4xl md:text-6xl" : "text-3xl"}`}>
          {category.title}
        </h2>
        <p className="mt-2 max-w-[28ch] text-sm text-fg/80">{notes[category.slug]}</p>
      </div>
    </Link>
  );
}
