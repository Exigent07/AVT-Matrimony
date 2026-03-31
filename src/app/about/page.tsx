import type { Metadata } from "next";
import { getCurrentViewer } from "@/server/auth";
import { About } from "@/features/marketing/About";

export const metadata: Metadata = {
  title: "About",
};

export default async function Page() {
  const viewer = await getCurrentViewer();
  return <About viewer={viewer} />;
}
