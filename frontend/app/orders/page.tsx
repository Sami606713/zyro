"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  status: string;
  total_amount: number;
  created_at: string;
  items: Array<{
    id: number;
    variant_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
};

export default function OrdersPage() {
  const auth = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.token) return;
    api.get<Order[]>("/orders", auth.token)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth.token]);

  if (!auth.token) {
    return (
      <div className="px-4 py-16 md:px-12">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Orders</h1>
        <p className="mt-4 text-muted">
          Please <Link href="/login" className="text-accent">login</Link> to view your orders.
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="px-4 py-16 text-muted">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="px-4 py-16 md:px-12">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Orders</h1>
        <p className="mt-4 text-muted">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 md:px-12">
      <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">Your Orders</h1>
      <ul className="mt-8 space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg">{formatPrice(order.total_amount)}</p>
                <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-sm text-muted">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
