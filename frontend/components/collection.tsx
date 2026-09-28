import Image from "next/image";

const pieces = [
  {
    src: "/looks/shirt.jpg",
    title: "Overshirt",
    note: "Charcoal cotton for the day.",
    alt: "Charcoal men's overshirt with two chest pockets on a dark studio background.",
    frame: "relative aspect-[2/3] md:aspect-auto md:h-full md:min-h-[640px]",
    cell: "md:col-span-7 md:row-span-2",
  },
  {
    src: "/looks/trousers.jpg",
    title: "Trouser",
    note: "Stone grey, a clean crease.",
    alt: "Stone grey tailored trousers folded on a dark stone block.",
    frame: "relative aspect-[4/3]",
    cell: "md:col-span-5",
  },
  {
    src: "/looks/belt.jpg",
    title: "Belt",
    note: "Black leather, matte buckle.",
    alt: "Coiled black leather belt with a brushed silver buckle.",
    frame: "relative aspect-[4/3]",
    cell: "md:col-span-5",
  },
] as const;

export function Collection() {
  return (
    <section id="edit" className="scroll-mt-20 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display max-w-[14ch] text-4xl leading-[1.1] font-semibold tracking-[-0.04em] md:text-6xl">
          The floor
        </h2>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-muted md:text-lg">
          Shirts and layers, trousers, and the small pieces that finish a fit.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-6">
          {pieces.map((piece) => (
            <figure key={piece.title} className={piece.cell}>
              <div className={`media overflow-hidden bg-surface ${piece.frame}`}>
                <Image
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  sizes={piece.title === "Overshirt" ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 40vw, 100vw"}
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <span className="font-display text-2xl tracking-[-0.03em]">{piece.title}</span>
                <span className="text-sm text-muted">{piece.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
