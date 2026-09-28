import Image from "next/image";

export function Cloth() {
  return (
    <section id="cloth" className="scroll-mt-20 bg-surface">
      <div className="media relative aspect-[16/9] max-h-[720px] w-full overflow-hidden">
        <Image
          src="/looks/cloth.jpg"
          alt="Close view of charcoal cotton twill with a fold catching the light."
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <h2 className="font-display max-w-[16ch] pb-1 text-4xl leading-[1.1] font-semibold tracking-[-0.04em] md:text-6xl">
          Cloth that keeps its line.
        </h2>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted md:text-lg">
          Plain weaves, a firm hand, and cuts that still look right after a full day out.
        </p>
      </div>
    </section>
  );
}
