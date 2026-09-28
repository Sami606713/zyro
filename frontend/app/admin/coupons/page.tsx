"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Coupon = {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
};

export default function CouponsPage() {
  const { token } = useAdminAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [endsAt, setEndsAt] = useState("");

  useEffect(() => {
    if (!token) return;
    api.get<Coupon[]>("/admin/coupons", token)
      .then(setCoupons)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/coupons", {
        code: code.toUpperCase(),
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
        min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        usage_limit: usageLimit ? parseInt(usageLimit) : null,
        ends_at: endsAt || null,
        is_active: true,
      }, token);
      setShowForm(false);
      setCode("");
      setDiscountValue("");
      setMinOrderAmount("");
      setUsageLimit("");
      setEndsAt("");
      const updated = await api.get<Coupon[]>("/admin/coupons", token);
      setCoupons(updated);
    } catch (err) {
      console.error("Failed to create coupon:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await api.put(`/admin/coupons/${coupon.id}`, { is_active: !coupon.is_active }, token);
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c)));
    } catch (err) {
      console.error("Failed to update coupon:", err);
    }
  };

  if (loading) {
    return <p className="py-20 text-center text-muted">Loading coupons...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Coupons</h1>
          <p className="mt-1 text-sm text-muted">Create and manage discount codes.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink"
        >
          {showForm ? "Cancel" : "+ New coupon"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-white/5 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-muted">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="SUMMER2025"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Discount type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed amount (PKR)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Discount value</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder={discountType === "percentage" ? "10" : "500"}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Min order amount (optional)</label>
              <input
                type="number"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">Usage limit (optional)</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                min="0"
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted">End date (optional)</label>
              <input
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-ink disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create coupon"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {coupons.length === 0 ? (
          <p className="py-20 text-center text-muted">No coupons yet.</p>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
              <div>
                <p className="font-medium">{coupon.code}</p>
                <p className="text-sm text-muted">
                  {coupon.discount_type === "percentage" ? `${coupon.discount_value}% off` : `Rs. ${coupon.discount_value} off`}
                  {coupon.min_order_amount && ` · Min order Rs. ${coupon.min_order_amount}`}
                </p>
                <p className="text-xs text-muted">
                  Used {coupon.used_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""} times
                </p>
              </div>
              <button
                onClick={() => toggleActive(coupon)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  coupon.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
                )}
              >
                {coupon.is_active ? "Active" : "Inactive"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
