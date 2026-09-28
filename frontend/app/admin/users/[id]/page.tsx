"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserDetail = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  addresses: { id: number; address_line1: string; city: string; state: string; postal_code: string; country: string; is_default: boolean }[];
  orders: { id: number; status: string; total_amount: number; created_at: string }[];
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!token) return;
    api.get<UserDetail>(`/admin/users/${params.id}`, token)
      .then((u) => {
        setUser(u);
        setFirstName(u.first_name);
        setLastName(u.last_name);
        setPhone(u.phone || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, params.id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await api.put(`/admin/users/${params.id}`, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
      }, token);
      setUser((prev) => prev ? { ...prev, first_name: firstName, last_name: lastName, phone: phone || null } : null);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async () => {
    if (!user) return;
    try {
      await api.put(`/admin/users/${params.id}`, { is_active: !user.is_active }, token);
      setUser({ ...user, is_active: !user.is_active });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading user...</p>;
  }

  if (!user) {
    return <p className="py-20 text-center text-muted">User not found.</p>;
  }

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/admin/users")}
        className="mb-4 text-sm text-muted hover:text-fg transition-colors"
      >
        ← Back to users
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">
            {user.first_name} {user.last_name}
          </h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <button
          onClick={toggleActive}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            user.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {user.is_active ? "Active" : "Inactive"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Profile</h2>
          {editing ? (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-muted hover:text-fg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-sm"><span className="text-muted">Name:</span> {user.first_name} {user.last_name}</p>
              <p className="text-sm"><span className="text-muted">Email:</span> {user.email}</p>
              <p className="text-sm"><span className="text-muted">Phone:</span> {user.phone || "—"}</p>
              <p className="text-sm"><span className="text-muted">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 text-sm text-accent hover:underline"
              >
                Edit profile
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Stats</h2>
          <div className="mt-3 space-y-2">
            <p className="text-sm"><span className="text-muted">Total orders:</span> {user.orders.length}</p>
            <p className="text-sm"><span className="text-muted">Total spent:</span> {formatPrice(totalSpent)}</p>
            <p className="text-sm"><span className="text-muted">Addresses:</span> {user.addresses.length}</p>
          </div>
        </div>
      </div>

      {user.addresses.length > 0 && (
        <div className="mt-4 rounded-xl bg-white/5 p-4">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Addresses</h2>
          <div className="mt-3 space-y-3">
            {user.addresses.map((addr) => (
              <div key={addr.id} className="rounded-lg bg-white/5 p-3">
                <p className="text-sm font-medium">{addr.address_line1}</p>
                <p className="text-sm text-muted">{addr.city}, {addr.state} {addr.postal_code}, {addr.country}</p>
                {addr.is_default && (
                  <span className="mt-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">Default</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-xl bg-white/5 p-4">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">Order history</h2>
        {user.orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {user.orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <div>
                  <p className="text-sm font-medium">Order #{order.id}</p>
                  <p className="text-xs text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.total_amount)}</p>
                  <p className="text-xs text-muted capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
