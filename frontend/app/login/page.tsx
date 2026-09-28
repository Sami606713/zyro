"use client";

import { Mark } from "@/components/logo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Login failed" }));
        throw new Error(err.detail || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("zyro-token", data.access_token);

      const payload = JSON.parse(atob(data.access_token.split(".")[1]));
      const roles: string[] = payload.roles || [];

      if (roles.includes("admin")) {
        localStorage.setItem("zyro-admin-token", data.access_token);
        localStorage.setItem("zyro-admin-user", JSON.stringify({ email, first_name: "Admin", last_name: "" }));
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh bg-bg">
      <div className="hidden flex-1 items-center justify-center bg-[#101114] lg:flex">
        <div className="relative flex flex-col items-center">
          <div className="absolute h-64 w-64 animate-pulse rounded-full bg-accent/20 blur-3xl" />
          <Mark className="relative h-32 w-32 animate-bounce text-accent" />
          <h1 className="relative mt-8 font-display text-5xl font-semibold tracking-[-0.06em] text-fg">
            ZYRO
          </h1>
          <p className="relative mt-2 text-sm tracking-[0.2em] text-muted uppercase">
            Premium clothing
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <Mark className="h-12 w-12" />
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-[-0.05em]">Welcome back</h1>
            <p className="mt-1 text-sm text-muted">Sign in to your Zyro account</p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.05em]">Welcome back</h1>
            <p className="mt-1 text-sm text-muted">Sign in to your Zyro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-muted">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-full bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-muted">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-full bg-white/5 px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-accent hover:underline">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
