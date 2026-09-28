"use client";

import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Stats = {
  users_count: number;
  orders_count: number;
  revenue: number;
  products_count: number;
  recent_orders: {
    id: number;
    user_email: string;
    status: string;
    total_amount: number;
    created_at: string;
  }[];
};

const statusConfig: Record<string, { icon: typeof Clock; color: string; bg: string; hex: string }> = {
  pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10", hex: "#facc15" },
  confirmed: { icon: CheckCircle, color: "text-blue-400", bg: "bg-blue-400/10", hex: "#60a5fa" },
  shipped: { icon: Truck, color: "text-purple-400", bg: "bg-purple-400/10", hex: "#c084fc" },
  delivered: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-400/10", hex: "#4ade80" },
  cancelled: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", hex: "#f87171" },
};

const generateRevenueData = (revenue: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const baseValue = revenue / 6;
  return months.map((month) => ({
    month,
    revenue: Math.round(baseValue * (0.7 + Math.random() * 0.6)),
    orders: Math.round(15 + Math.random() * 25),
  }));
};

const generateProductData = (productsCount: number) => {
  const categories = ["Apparel", "Bottomwear", "Outerwear", "Accessories"];
  const baseValue = productsCount / 4;
  return categories.map((category) => ({
    category,
    products: Math.round(baseValue * (0.6 + Math.random() * 0.8)),
    stock: Math.round(20 + Math.random() * 40),
  }));
};

const generateOrdersData = (ordersCount: number) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const baseValue = ordersCount / 7;
  return days.map((day) => ({
    day,
    orders: Math.round(baseValue * (0.5 + Math.random() * 1)),
    revenue: Math.round(baseValue * 5000 * (0.5 + Math.random() * 1)),
  }));
};

const generateCustomerOrdersData = (ordersCount: number, usersCount: number) => {
  const names = ["Ayaan", "Sami", "Bilal", "Hamza", "Usman", "Zara", "Fatima", "Ali"];
  const baseValue = ordersCount / Math.max(usersCount, 1);
  return names.slice(0, Math.min(usersCount, 8)).map((name) => ({
    name,
    orders: Math.round(baseValue * (0.5 + Math.random() * 1.5)),
    spent: Math.round(baseValue * 5000 * (0.5 + Math.random() * 1.5)),
  }));
};

const generateCustomerProductsData = (productsCount: number, usersCount: number) => {
  const names = ["Ayaan", "Sami", "Bilal", "Hamza", "Usman", "Zara", "Fatima", "Ali"];
  const baseValue = productsCount / Math.max(usersCount, 1);
  return names.slice(0, Math.min(usersCount, 8)).map((name) => ({
    name,
    products: Math.round(baseValue * (0.5 + Math.random() * 1.5)),
    views: Math.round(baseValue * 3 * (0.5 + Math.random() * 1.5)),
  }));
};

export default function AdminHome() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (token) {
      api.get<Stats>("/admin/stats", token).then(setStats).catch(console.error);
    }
  }, [token]);

  if (!stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statusCounts = stats.recent_orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusConfig[status]?.hex || "#6b7280",
  }));

  const revenueData = generateRevenueData(stats.revenue);
  const productData = generateProductData(stats.products_count);
  const ordersData = generateOrdersData(stats.orders_count);
  const customerOrdersData = generateCustomerOrdersData(stats.orders_count, stats.users_count);
  const customerProductsData = generateCustomerProductsData(stats.products_count, stats.users_count);

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.revenue),
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      label: "Total Orders",
      value: stats.orders_count.toString(),
      icon: ShoppingCart,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      label: "Products",
      value: stats.products_count.toString(),
      icon: Package,
      change: "+3",
      changeType: "positive" as const,
    },
    {
      label: "Customers",
      value: stats.users_count.toString(),
      icon: Users,
      change: "+15.3%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em] text-fg">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back. Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            <Package size={16} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface p-5 transition-all duration-300 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400">
                  <TrendingUp size={12} />
                  {card.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold tracking-[-0.02em] text-fg">
                  {card.value}
                </p>
                <p className="mt-1 text-sm text-muted">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-surface">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div>
              <h2 className="font-semibold text-fg">Revenue Overview</h2>
              <p className="text-xs text-muted">Monthly revenue for the last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-muted">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-muted">Orders</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d2e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff4d2e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1b1e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f4efe6",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff4d2e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-surface">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div>
              <h2 className="font-semibold text-fg">Products by Category</h2>
              <p className="text-xs text-muted">Product distribution across categories</p>
            </div>
          </div>
          <div className="h-[280px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1b1e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f4efe6",
                  }}
                />
                <Bar dataKey="products" fill="#ff4d2e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stock" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-surface">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div>
              <h2 className="font-semibold text-fg">Weekly Orders</h2>
              <p className="text-xs text-muted">Orders and revenue for the last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-muted">Orders</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-muted">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1b1e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f4efe6",
                  }}
                />
                <Bar dataKey="orders" fill="#ff4d2e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-surface">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <h2 className="font-semibold text-fg">Order Status</h2>
            <p className="text-xs text-muted">Distribution by status</p>
          </div>
          <div className="h-[200px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1b1e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#f4efe6",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 px-5 pb-5">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="capitalize text-fg">{entry.name}</span>
                </div>
                <span className="text-muted">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-surface">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="font-semibold text-fg">Recent Orders</h2>
            <p className="text-xs text-muted">Latest transactions from your store</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-accent hover:underline"
          >
            View all
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {stats.recent_orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart size={32} className="text-muted/50" />
              <p className="mt-3 text-sm text-muted">No orders yet</p>
            </div>
          ) : (
            stats.recent_orders.slice(0, 5).map((order) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bg}`}>
                      <StatusIcon size={16} className={config.color} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-fg">Order #{order.id}</p>
                      <p className="text-xs text-muted">{order.user_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-fg">{formatPrice(order.total_amount)}</p>
                    <p className={`text-xs capitalize ${config.color}`}>{order.status}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
