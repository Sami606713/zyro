const items = [
  {
    q: "Where is the shop?",
    a: "Haripur, Khyber Pakhtunkhwa. A street number is not published. Ask @zyrostore1.",
  },
  {
    q: "How do I order?",
    a: "Pick a piece, then message the shop with the name and your size. They confirm stock before you pay.",
  },
  {
    q: "Can I return it?",
    a: "Unworn pieces with tags can be exchanged within 7 days.",
  },
  {
    q: "Do you deliver?",
    a: "Ask on Instagram. The site does not run its own courier tracker.",
  },
];

export function FaqSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[800px]">
        <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-[-0.04em] md:text-6xl">FAQ</h2>
        <div className="mt-8 border-t border-line">
          {items.map((item) => (
            <details key={item.q} className="border-b border-line py-4">
              <summary className="cursor-pointer text-lg">{item.q}</summary>
              <p className="mt-3 max-w-[55ch] text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
