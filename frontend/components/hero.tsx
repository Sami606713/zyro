"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/looks/portrait.jpg",
    alt: "Man in a charcoal overshirt and black trousers standing in a concrete studio.",
    kicker: "Haripur",
    title: "Designed to define you.",
    text: "Men's apparel, bottomwear, and accessories from the Zyro floor.",
    href: "/edit",
    cta: "The edit",
    position: "object-[center_20%]",
  },
  {
    src: "/looks/shirt.jpg",
    alt: "Charcoal men's overshirt with two chest pockets on a dark studio background.",
    kicker: "Apparel",
    title: "The overshirt.",
    text: "Charcoal cotton, cut for the day.",
    href: "/edit",
    cta: "The edit",
    position: "object-center",
  },
  {
    src: "/looks/trousers.jpg",
    alt: "Stone grey tailored trousers folded on a dark stone block.",
    kicker: "Bottomwear",
    title: "A clean crease.",
    text: "Stone grey trousers that hold their line.",
    href: "/edit",
    cta: "The edit",
    position: "object-center",
  },
];

const controlClass =
  "inset-y-auto top-1/2 size-11 -translate-y-1/2 border-line bg-bg text-fg hover:bg-accent hover:text-white";

function SlideDots() {
  const { api } = useCarousel();
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setSelected(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className="absolute bottom-6 left-4 z-10 flex gap-2 md:left-16">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === selected}
          onClick={() => api?.scrollTo(index)}
          className={`h-1 w-8 ${index === selected ? "bg-accent" : "bg-fg/35"}`}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const autoplay = useRef(
    Autoplay({ delay: 5200, stopOnMouseEnter: true, stopOnInteraction: false }),
  );

  return (
    <section aria-label="Featured" className="relative min-h-[calc(100dvh-6rem)] overflow-hidden">

      <Carousel
        opts={{ loop: true }}
        plugins={reduce ? undefined : [autoplay.current]}
        className="h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.title} className="pl-0">
              <article className="relative min-h-[calc(100dvh-6.5rem)]">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover ${slide.position}`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(9_10_12/0.2)_0%,rgb(9_10_12/0.35)_40%,rgb(9_10_12/0.88)_100%)] md:bg-[linear-gradient(90deg,#090a0c_0%,rgb(9_10_12/0.72)_34%,rgb(9_10_12/0.15)_68%,transparent_100%)]" />
                <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-6.5rem)] max-w-[1400px] flex-col justify-end px-4 pt-8 pb-20 md:justify-center md:px-12 md:pb-16">
                  {index === 0 ? (
                    <h1 className="font-display max-w-[11ch] pb-1 text-5xl leading-[1.05] font-semibold tracking-[-0.045em] text-fg md:text-6xl">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="font-display max-w-[11ch] pb-1 text-5xl leading-[1.05] font-semibold tracking-[-0.045em] text-fg md:text-6xl">
                      {slide.title}
                    </h2>
                  )}
                  <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-fg/80 md:text-lg">
                    {slide.text}
                  </p>
                  <div className="mt-8">
                    <Link className="btn btn-primary" href={slide.href}>
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`${controlClass} top-auto bottom-8 left-auto right-16 md:top-1/2 md:right-20 md:bottom-auto`} />
        <CarouselNext className={`${controlClass} top-auto right-4 bottom-8 md:top-1/2 md:bottom-auto`} />
        <SlideDots />
      </Carousel>
    </section>
  );
}
