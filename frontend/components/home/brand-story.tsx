import { Reveal } from "@/components/reveal";
import Image from "next/image";
import Link from "next/link";

export function BrandStory() {
  return (
    <section className="px-4 py-24 md:px-8 md:py-32">
      <Reveal>
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display max-w-[14ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
          A floor in Haripur.
        </h2>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
          Zyro sells men&apos;s apparel, bottomwear, and accessories. New pieces show on Instagram first, then go out on the rail.
        </p>
        <div className="relative mt-10 aspect-[16/9] max-h-[520px] overflow-hidden bg-surface">
          <Image src="/looks/cloth.jpg" alt="Close view of charcoal cotton cloth." fill sizes="100vw" className="object-cover" />
        </div>
        <Link href="/about" className="mt-6 inline-block text-sm text-accent">
          About the brand
        </Link>
      </div>
      </Reveal>
    </section>
  );
}
