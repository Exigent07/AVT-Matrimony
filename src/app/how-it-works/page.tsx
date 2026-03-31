import type { Metadata } from "next";
import { getCurrentViewer } from "@/server/auth";
import { HowItWorks } from "@/features/marketing/HowItWorks";

export const metadata: Metadata = {
  title: "How It Works",
};

export default async function Page() {
  const viewer = await getCurrentViewer();
  return <HowItWorks viewer={viewer} />;
}
