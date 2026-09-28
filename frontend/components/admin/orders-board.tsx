"use client";

import { OrderTable } from "@/components/admin/order-table";
import { sampleOrders } from "@/lib/admin-sample";
import { cn } from "@/lib/utils";
import { useState } from "react";

const filters = ["All", "New", "Confirmed", "Done"] as const;

export function OrdersBoard() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const rows = filter === "All" ? sampleOrders : sampleOrders.filter((order) => order.status === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
              filter === item ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-[1.4rem] bg-white/5 p-1.5">
        <div className="overflow-hidden rounded-[1.15rem] bg-surface">
          {rows.length === 0 ? (
            <p className="px-6 py-16 text-sm text-muted">No sample orders in this state.</p>
          ) : (
            <OrderTable orders={rows} />
          )}
        </div>
      </div>
    </div>
  );
}
