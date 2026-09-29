export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface ${className}`} />;
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] animate-pulse rounded-[1.6rem] bg-surface" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-surface" />
          <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}
