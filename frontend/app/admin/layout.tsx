import { AdminAuthProvider } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Zyro",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
