"use client";

import { Mark } from "@/components/logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_active: boolean;
  is_verified: boolean;
  addresses: { id: number; city: string; country: string; is_default: boolean }[];
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("zyro-token");
    if (!token) {
      router.push("/login");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    fetch(`${apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("zyro-token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("zyro-token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-dvh bg-bg px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mark className="h-8 w-8" />
            <span className="font-display text-lg font-semibold tracking-[-0.05em]">ZYRO</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-white/5 px-4 py-2 text-sm text-muted hover:text-fg transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="rounded-[1.6rem] bg-white/5 p-6 md:p-8">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">My account</h1>
          <p className="mt-1 text-sm text-muted">Your profile and addresses</p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Name</p>
              <p className="mt-1 text-lg font-medium">{user.first_name} {user.last_name}</p>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Email</p>
              <p className="mt-1 text-lg font-medium">{user.email}</p>
            </div>

            {user.phone && (
              <div>
                <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Phone</p>
                <p className="mt-1 text-lg font-medium">{user.phone}</p>
              </div>
            )}
          </div>

          {user.addresses && user.addresses.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Addresses</p>
              <div className="mt-3 space-y-3">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="rounded-xl bg-white/5 p-4">
                    <p className="font-medium">{addr.city}, {addr.country}</p>
                    {addr.is_default && (
                      <span className="mt-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
