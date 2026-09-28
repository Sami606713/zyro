export function DeskHeading({
  kicker,
  title,
  detail,
}: {
  kicker: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-medium tracking-[0.22em] text-accent uppercase">{kicker}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{title}</h1>
      </div>
      <p className="max-w-xs text-sm leading-6 text-muted">{detail}</p>
    </div>
  );
}
