import Image from "next/image";

const facts = [
  { label: "Place", value: "Haripur" },
  { label: "Carry", value: "Apparel, bottomwear, accessories" },
  { label: "First look", value: "@zyrostore1" },
];

export function Visit() {
  return (
    <section id="visit" className="scroll-mt-20 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <h2 className="font-display max-w-[12ch] text-4xl leading-[1.1] font-semibold tracking-[-0.04em] md:text-6xl">
            On the floor in Haripur.
          </h2>
          <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted md:text-lg">
            New arrivals land on the shop account before they reach the rail.
          </p>
          <dl className="mt-10 grid gap-6">
            {facts.map((fact) => (
              <div key={fact.label} className="border-t border-line pt-4">
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="font-display mt-1 text-2xl tracking-[-0.03em]">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <a
            className="btn btn-primary mt-10"
            href="https://www.instagram.com/zyrostore1/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
        <div className="media relative aspect-[2/3] overflow-hidden bg-surface">
          <Image
            src="/looks/portrait.jpg"
            alt="Man in a charcoal overshirt and black trousers standing in a concrete studio."
            fill
            sizes="(min-width: 768px) 48vw, 100vw"
            className="object-cover object-[center_20%]"
          />
        </div>
      </div>
    </section>
  );
}
