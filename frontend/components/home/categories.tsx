import { categories } from "@/lib/catalog";
import Image from "next/image";
import Link from "next/link";

export function Categories() {
  return (
    <section className="px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display max-w-[14ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-5xl">
          Featured categories
        </h2>
        <div className="mt-8 flex flex-col gap-4 md:h-[68vh] md:flex-row md:gap-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="group flex min-w-0 flex-1 flex-col transition-[flex-grow] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:hover:flex-[2.6]"
            >
              <div className="relative h-64 overflow-hidden rounded-[1.6rem] bg-surface ring-1 ring-white/10 md:h-full">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                />
              </div>
              <span className="mt-3 text-lg">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
