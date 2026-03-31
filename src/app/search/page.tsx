import type { Metadata } from "next";
import { requireMemberViewer } from "@/server/auth";
import { ProfileSearch } from "@/features/profiles/ProfileSearch";
import { getSearchProfiles } from "@/server/services/profiles";

export const metadata: Metadata = {
  title: "Search Profiles",
};

export default async function Page() {
  const viewer = await requireMemberViewer();
  const data = await getSearchProfiles(viewer.id);

  return (
    <ProfileSearch
      viewer={data.viewer}
      profiles={data.profiles}
      requestStatusByUserId={Object.fromEntries(data.requestStatusByUserId.entries())}
      directoryMode={data.directoryMode}
    />
  );
}
