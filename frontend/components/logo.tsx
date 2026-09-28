type MarkProps = {
  className?: string;
};

export function Mark({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M11 17H51L13 47H53"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M14 20H48L18 44"
        stroke="#ff4d2e"
        strokeWidth="1.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-fg ${className ?? ""}`}>
      <Mark className="h-7 w-7 shrink-0" />
      <span className="font-display text-[1.35rem] leading-none font-semibold tracking-[-0.06em]">
        ZYRO
      </span>
    </span>
  );
}
