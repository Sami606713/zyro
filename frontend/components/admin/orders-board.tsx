"use client";

import { OrderTable } from "@/components/admin/order-table";
import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type ApiOrder = {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  user: { email: string; first_name: string; last_name: string };
  items?: { quantity: number; product_name: string }[];
};

type DeskOrder = {
  id: string;
  name: string;
  city: string;
  total: number;
  status: string;
  pieces: string;
  placed: string;
};

const filters = ["All", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function mapOrder(order: ApiOrder): DeskOrder {
  const pieces = order.items
    ? order.items.map((item) => `${item.quantity}× ${item.product_name}`).join(", ")
    : `${order.user?.first_name ?? ""} ${order.user?.last_name ?? ""}`.trim();

  return {
    id: `#${order.id}`,
    name: `${order.user?.first_name ?? ""} ${order.user?.last_name ?? ""}`.trim() || (order.user?.email ?? "Unknown"),
    city: "",
    total: order.total_amount,
    status: order.status,
    pieces,
    placed: new Date(order.created_at).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

export function OrdersBoard() {
  const { token } = useAdminAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [orders, setOrders] = useState<DeskOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .get<ApiOrder[]>(`/admin/orders?status=${filter === "All" ? "" : filter}`, token)
      .then((data) => setOrders(data.map(mapOrder)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, filter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm capitalize transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
              filter === item ? "bg-accent text-ink" : "bg-white/5 text-muted hover:text-fg",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-[1.4rem] bg-white/5 p-1.5">
        <div className="overflow-hidden rounded-[1.15rem] bg-surface">
          {loading ? (
            <p className="px-6 py-16 text-sm text-muted">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="px-6 py-16 text-sm text-muted">No orders in this state.</p>
          ) : (
            <OrderTable orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}
