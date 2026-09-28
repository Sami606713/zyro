"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type OrderItem = {
  id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant: { size: string; color: string; sku: string };
};

type Order = {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  user: { email: string; first_name: string; last_name: string; phone: string | null };
  shipping_address: { address_line1: string; city: string; state: string; postal_code: string; country: string };
  billing_address: { address_line1: string; city: string; state: string; postal_code: string; country: string };
  items: OrderItem[];
};

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { token } = useAdminAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api.get<Order>(`/admin/orders/${id}`, token)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, id]);

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    setError("");

    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus }, token);
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading order...</p>;
  }

  if (!order) {
    return <p className="py-20 text-center text-muted">Order not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/admin/orders")}
        className="mb-4 text-sm text-muted hover:text-fg transition-colors"
      >
        ← Back to orders
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-muted">
            Placed {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={updating}
          className="rounded-full bg-white/5 px-4 py-2 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        >
          {statuses.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Customer</h2>
          <p className="mt-2 font-medium">{order.user.first_name} {order.user.last_name}</p>
          <p className="text-sm text-muted">{order.user.email}</p>
          {order.user.phone && <p className="text-sm text-muted">{order.user.phone}</p>}
        </div>

        <div className="rounded-xl bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Shipping address</h2>
          <p className="mt-2 text-sm">{order.shipping_address.address_line1}</p>
          <p className="text-sm text-muted">
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
          </p>
          <p className="text-sm text-muted">{order.shipping_address.country}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Items</h2>
        <div className="mt-3 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.variant.color} / {item.variant.size}</p>
                <p className="text-sm text-muted">SKU: {item.variant.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{item.quantity} × {formatPrice(item.unit_price)}</p>
                <p className="text-sm font-medium">{formatPrice(item.total_price)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Total</p>
            <p className="font-display text-xl font-semibold">{formatPrice(order.total_amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
