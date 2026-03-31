import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentViewer } from "@/server/auth";
import { AdminLogin } from "@/features/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default async function Page() {
  const viewer = await getCurrentViewer();

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
  }

  return <AdminLogin />;
}
