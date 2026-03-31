import type { Metadata } from "next";
import { requireViewer } from "@/server/auth";
import { ProfileView } from "@/features/profiles/ProfileView";
import { getProfileDetailById } from "@/server/services/profiles";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await requireViewer();
  const { id } = await params;
  const data = await getProfileDetailById(viewer.id, id);

  return (
    <ProfileView
      viewer={data.viewer}
      profile={data.profile}
      isOwnProfile={data.isOwnProfile}
      interestStatus={data.interestStatus}
      canSendInterest={data.canSendInterest}
    />
  );
}
