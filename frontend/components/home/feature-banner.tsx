import Image from "next/image";
import Link from "next/link";

export function FeatureBanner() {
  return (
    <section className="relative min-h-[460px] md:min-h-[560px]">
      <Image
        src="/looks/portrait.jpg"
        alt="Man in a charcoal overshirt standing in a concrete studio."
        fill
        sizes="100vw"
        className="object-cover object-[center_20%]"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex min-h-[460px] flex-col items-center justify-center px-4 text-center md:min-h-[560px]">
        <h2 className="font-display text-5xl tracking-[-0.04em] text-white md:text-7xl">The floor</h2>
        <Link href="/edit" className="btn btn-primary mt-8">
          The edit
        </Link>
      </div>
    </section>
  );
}
