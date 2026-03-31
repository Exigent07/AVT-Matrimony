import { getCurrentViewer } from "@/server/auth";
import { Home } from "@/features/marketing/Home";
import { redirect } from "next/navigation";

export default async function Page() {
  const viewer = await getCurrentViewer();

  if (viewer) {
    redirect(viewer.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
  }

  return <Home viewer={viewer} />;
}
