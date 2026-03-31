import { getCurrentViewer } from "@/server/auth";
import { Home } from "@/features/marketing/Home";

export default async function Page() {
  const viewer = await getCurrentViewer();
  return <Home viewer={viewer} />;
}
