"use client";

import { DeskHeading } from "@/components/admin/desk-heading";
import { StatusPill } from "@/components/admin/status-pill";
import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  user: { email: string; first_name: string; last_name: string };
};

const filters = ["All", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    api.get<Order[]>(`/admin/orders?status=${filter === "All" ? "" : filter}`, token)
      .then(setOrders)
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, [token, filter]);

  return (
    <div>
      <DeskHeading
        kicker="Orders"
        title="Order book."
        detail="Live orders from your store. Filter by status and update order states."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm capitalize transition-colors",
              filter === item ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-[1.4rem] bg-white/5 p-1.5">
        <div className="overflow-hidden rounded-[1.15rem] bg-surface">
          {loading ? (
            <p className="px-6 py-16 text-sm text-muted">Loading orders...</p>
          ) : !error && orders.length === 0 ? (
            <p className="px-6 py-16 text-sm text-muted">No orders found.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between px-4 py-4">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted">
                      {order.user?.first_name} {order.user?.last_name} · {order.user?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{formatPrice(order.total_amount)}</span>
                    <StatusPill status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
