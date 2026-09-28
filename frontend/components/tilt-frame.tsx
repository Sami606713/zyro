"use client";

import { useRef } from "react";

export function TiltFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={`[perspective:1100px] ${className}`}>
      <div
        ref={ref}
        className="stage h-full"
        onPointerMove={(event) => {
          const node = ref.current;
          if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const box = node.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width - 0.5;
          const y = (event.clientY - box.top) / box.height - 0.5;
          node.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
        }}
        onPointerLeave={() => {
          if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
        }}
      >
        {children}
      </div>
    </div>
  );
}
