import type { Metadata } from "next";
import { requireAdminViewer } from "@/server/auth";
import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { getAdminDashboardData } from "@/server/services/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function Page() {
  const viewer = await requireAdminViewer();
  const data = await getAdminDashboardData(viewer.id);

  return <AdminDashboard data={data} />;
}
