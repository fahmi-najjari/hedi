import { AdminShell } from "@/app/admin/(dashboard)/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminShell
      adminName={admin.name || admin.email}
      adminEmail={admin.email}
    >
      {children}
    </AdminShell>
  );
}
