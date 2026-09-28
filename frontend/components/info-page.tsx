export function InfoPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 py-14 md:px-8 md:py-20">
      <article className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl tracking-[-0.04em] md:text-5xl">{title}</h1>
        <div className="mt-8 space-y-4 text-base leading-7 text-muted">{children}</div>
      </article>
    </main>
  );
}
