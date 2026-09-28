"use client";

import { DeskHeading } from "@/components/admin/desk-heading";
import { useAdminAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
};

export default function AdminUsersPage() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.get<User[]>(`/admin/users?search=${search}&limit=100`, token)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, search]);

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? This will also delete their addresses and cart.")) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/users/${id}`, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <DeskHeading
        kicker="Users"
        title="Customer list."
        detail="All registered users. Search by name or email."
      />

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full bg-white/5 px-4 py-2 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {loading ? (
        <p className="py-20 text-center text-muted">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="py-20 text-center text-muted">No users found.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[1.4rem] bg-white/5 p-1.5">
          <div className="overflow-hidden rounded-[1.15rem] bg-surface">
            <ul className="divide-y divide-white/10">
              {users.map((user) => (
                <li key={user.id} className="flex items-center justify-between px-4 py-4">
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs",
                        user.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
                      )}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-muted hover:text-fg transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={deleting === user.id}
                      className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                    >
                      {deleting === user.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
