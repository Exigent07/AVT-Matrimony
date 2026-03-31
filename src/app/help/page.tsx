import type { Metadata } from "next";
import { getCurrentViewer } from "@/server/auth";
import { HelpCenter } from "@/features/help/HelpCenter";

export const metadata: Metadata = {
  title: "Help Center",
};

function getHelpTab(tab?: string) {
  if (tab === "contact" || tab === "report") {
    return tab;
  }

  return "faq";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    profileId?: string;
    subject?: string;
  }>;
}) {
  const viewer = await getCurrentViewer();
  const params = await searchParams;
  const helpTab = getHelpTab(params.tab);

  return (
    <HelpCenter
      initialName={viewer?.fullName ?? ""}
      initialEmail={viewer?.email ?? ""}
      initialTab={helpTab}
      initialProfileId={params.profileId ?? ""}
      initialSubject={params.subject ?? ""}
      viewer={viewer}
    />
  );
}
