import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";
import { getCurrentViewer } from "@/server/auth";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default async function Page() {
  const viewer = await getCurrentViewer();

  return (
    <LegalPage
      variant="terms"
      viewer={viewer}
    />
  );
}
