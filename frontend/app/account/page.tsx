"use client";

import { Mark } from "@/components/logo";
import { useAppSelector } from "@/lib/store/hooks";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  addresses: {
    id: number;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string | null;
    is_default: boolean;
  }[];
};

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

export default function AccountPage() {
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.token || localStorage.getItem("zyro-token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      api.get<UserProfile>("/users/me", token),
      api.get<Order[]>("/orders", token),
    ])
      .then(([profile, orders]) => {
        setUser(profile);
        setOrders(orders);
      })
      .catch(() => {
        localStorage.removeItem("zyro-token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [auth.token, router]);

  const handleLogout = () => {
    localStorage.removeItem("zyro-token");
    localStorage.removeItem("zyro-refresh-token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrders = orders.length;
  const memberSince = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "confirmed": return "bg-blue-500/20 text-blue-400";
      case "shipped": return "bg-purple-500/20 text-purple-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-muted";
    }
  };

  return (
    <div className="min-h-dvh bg-bg px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mark className="h-8 w-8" />
            <span className="font-display text-lg font-semibold tracking-[-0.05em]">ZYRO</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted hover:border-white/20 hover:text-fg transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-[1.6rem] bg-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-ink">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <div>
                  <h1 className="font-display text-xl font-semibold tracking-[-0.03em]">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-sm text-muted">{user.email}</p>
                  {user.is_verified && (
                    <span className="mt-1 inline-block rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-2xl font-semibold text-accent">{totalOrders}</p>
                  <p className="text-xs text-muted">Orders</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-2xl font-semibold text-accent">{formatPrice(totalSpent)}</p>
                  <p className="text-xs text-muted">Total Spent</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white/5 p-3">
                <p className="text-xs text-muted">Member since</p>
                <p className="text-sm font-medium">{memberSince}</p>
              </div>
            </div>

            <div className="rounded-[1.6rem] bg-white/5 p-6">
              <h2 className="text-sm font-medium tracking-wide">Account</h2>
              <nav className="mt-3 space-y-1">
                <Link href="/orders" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg transition-colors">
                  My Orders
                </Link>
                <Link href="/wishlist" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg transition-colors">
                  Wishlist
                </Link>
                <Link href="/pages/track-order" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg transition-colors">
                  Track Order
                </Link>
                <Link href="/pages/returns" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-fg transition-colors">
                  Returns
                </Link>
              </nav>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="rounded-[1.6rem] bg-white/5 p-6">
              <h2 className="font-display text-lg font-semibold tracking-[-0.03em]">Profile Information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted">First Name</p>
                  <p className="mt-1 font-medium">{user.first_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Last Name</p>
                  <p className="mt-1 font-medium">{user.last_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <p className="mt-1 font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Phone</p>
                  <p className="mt-1 font-medium">{user.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.6rem] bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold tracking-[-0.03em]">Order History</h2>
                <Link href="/orders" className="text-sm text-accent hover:underline">
                  View all
                </Link>
              </div>
              {orders.length === 0 ? (
                <div className="mt-6 text-center">
                  <p className="text-muted">No orders yet.</p>
                  <Link href="/shop" className="btn btn-primary mt-4 inline-block">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="rounded-xl bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-xs text-muted">
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.total_amount)}</p>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                        <p className="text-xs text-muted">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </p>
                        <Link href={`/orders/${order.id}`} className="text-xs text-accent hover:underline">
                          View details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[1.6rem] bg-white/5 p-6">
              <h2 className="font-display text-lg font-semibold tracking-[-0.03em]">Saved Addresses</h2>
              {(!user.addresses || user.addresses.length === 0) ? (
                <p className="mt-4 text-sm text-muted">No saved addresses.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="rounded-xl bg-white/5 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{addr.address_line1}</p>
                          {addr.address_line2 && <p className="text-sm text-muted">{addr.address_line2}</p>}
                          <p className="mt-1 text-sm text-muted">
                            {addr.city}, {addr.state} {addr.postal_code}
                          </p>
                          <p className="text-sm text-muted">{addr.country}</p>
                          {addr.phone && <p className="mt-1 text-xs text-muted">{addr.phone}</p>}
                        </div>
                        {addr.is_default && (
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
