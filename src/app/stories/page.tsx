import type { Metadata } from "next";
import { getCurrentViewer } from "@/server/auth";
import { Stories } from "@/features/marketing/Stories";

export const metadata: Metadata = {
  title: "Success Stories",
};

export default async function Page() {
  const viewer = await getCurrentViewer();
  return <Stories viewer={viewer} />;
}
