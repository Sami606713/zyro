import { Reveal } from "@/components/reveal";

const points = [
  { title: "Cloth you can check", text: "The pieces are on a floor in Haripur, not only in a photo." },
  { title: "Stock is confirmed", text: "Message the shop before you pay. If a size is gone, they say so." },
  { title: "Seven-day exchange", text: "Unworn items with tags can come back within a week." },
  { title: "One public line", text: "Orders and questions go through @zyrostore1." },
];

export function Benefits() {
  return (
    <section className="border-y border-line px-4 py-24 md:px-8 md:py-32">
      <Reveal>
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display max-w-[12ch] text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">
          Why this floor
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          {points.map((point) => (
            <li key={point.title} className="border-t border-line pt-4">
              <h3 className="font-display text-2xl tracking-[-0.03em]">{point.title}</h3>
              <p className="mt-2 max-w-[40ch] text-muted">{point.text}</p>
            </li>
          ))}
        </ol>
      </div>
      </Reveal>
    </section>
  );
}
