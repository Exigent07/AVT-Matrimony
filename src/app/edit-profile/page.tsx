import type { Metadata } from "next";
import { requireMemberViewer } from "@/server/auth";
import { EditProfile } from "@/features/profiles/EditProfile";
import { getProfileDetailById } from "@/server/services/profiles";

export const metadata: Metadata = {
  title: "Edit Profile",
};

export default async function Page() {
  const viewer = await requireMemberViewer();
  const data = await getProfileDetailById(viewer.id, "me");

  return <EditProfile viewer={data.viewer} profile={data.profile} />;
}
