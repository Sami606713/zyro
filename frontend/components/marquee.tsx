const words = ["Apparel", "Bottomwear", "Accessories", "New arrivals", "Haripur"];

export function Marquee() {
  const row = [...words, ...words];

  return (
    <section className="overflow-hidden border-y border-line bg-surface" aria-label="What Zyro carries">
      <div className="ticker-track flex w-max py-4">
        {row.map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center">
            <span className="font-display px-6 text-sm tracking-[0.14em] text-fg uppercase">
              {word}
            </span>
            <span className="text-accent" aria-hidden="true">
              /
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
