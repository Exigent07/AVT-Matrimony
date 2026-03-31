import type { Metadata } from "next";
import { requireMemberViewer } from "@/server/auth";
import { UserDashboard } from "@/features/dashboard/UserDashboard";
import { getDashboardData } from "@/server/services/profiles";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const viewer = await requireMemberViewer();
  const data = await getDashboardData(viewer.id);

  return <UserDashboard data={data} />;
}
