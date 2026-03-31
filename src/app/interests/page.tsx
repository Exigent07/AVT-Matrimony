import type { Metadata } from "next";
import { requireMemberViewer } from "@/server/auth";
import { MyInterests } from "@/features/profiles/MyInterests";
import { getInterestItems } from "@/server/services/profiles";

export const metadata: Metadata = {
  title: "My Interests",
};

export default async function Page() {
  const viewer = await requireMemberViewer();
  const interests = await getInterestItems(viewer.id);

  return <MyInterests viewer={viewer} interests={interests} />;
}
