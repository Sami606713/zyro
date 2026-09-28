import Image from "next/image";

const shots = [
  { src: "/looks/portrait.jpg", alt: "Studio portrait in a charcoal overshirt." },
  { src: "/looks/shirt.jpg", alt: "Charcoal overshirt." },
  { src: "/looks/jacket.jpg", alt: "Field jacket." },
  { src: "/looks/trousers.jpg", alt: "Stone trousers." },
  { src: "/looks/oxford.jpg", alt: "Oxford shirt." },
  { src: "/looks/belt.jpg", alt: "Leather belt." },
];

export function Instagram() {
  return (
    <section className="px-4 pt-4 pb-16 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display max-w-[14ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
          On Instagram
        </h2>
        <a
          href="https://www.instagram.com/zyrostore1/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 block text-sm text-muted hover:text-accent"
        >
          @zyrostore1
        </a>
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-3">
          {shots.map((shot) => (
            <a
              key={shot.src}
              href="https://www.instagram.com/zyrostore1/"
              target="_blank"
              rel="noreferrer"
              className="relative block aspect-square overflow-hidden bg-surface"
            >
              <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 768px) 16vw, 50vw" className="object-cover" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
