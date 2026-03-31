import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentViewer } from "@/server/auth";
import { Register } from "@/features/auth/Register";

export const metadata: Metadata = {
  title: "Register",
};

export default async function Page() {
  const viewer = await getCurrentViewer();

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
  }

  return <Register />;
}
