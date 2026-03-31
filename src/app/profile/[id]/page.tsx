import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireViewer } from "@/server/auth";
import { ProfileView } from "@/features/profiles/ProfileView";
import { AppError } from "@/server/errors";
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
  let data;

  try {
    data = await getProfileDetailById(viewer.id, id);
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }

    throw error;
  }

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
