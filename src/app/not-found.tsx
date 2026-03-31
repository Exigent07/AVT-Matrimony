import type { Metadata } from "next";
import { NotFoundStatusView } from "@/components/shared/SystemStatusViews";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you requested could not be found.",
};

export default function NotFound() {
  return <NotFoundStatusView />;
}
