"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  total,
  skip,
  limit,
  onPageChange,
}: {
  total: number;
  skip: number;
  limit: number;
  onPageChange: (skip: number) => void;
}) {
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(0, skip - limit))}
        disabled={skip === 0}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-sm text-muted">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(skip + limit)}
        disabled={skip + limit >= total}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
