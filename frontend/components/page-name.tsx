export function PageName({ title }: { title: string }) {
  return (
    <main className="px-4 py-16 md:px-8 md:py-24">
      <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{title}</h1>
    </main>
  );
}
