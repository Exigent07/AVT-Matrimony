import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";
import { getCurrentViewer } from "@/server/auth";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const sections = [
  {
    title: "Using the service",
    body: [
      "Members are expected to provide accurate profile information and use the platform only for legitimate matrimonial introductions.",
      "Administrator actions such as profile approval, rejection, blocking, and contact release are part of the product workflow and are used to preserve trust across the directory.",
    ],
  },
  {
    title: "Account responsibilities",
    body: [
      "You are responsible for keeping your login credentials private and for ensuring the information in your account remains current and truthful.",
      "Accounts that contain misleading information, abusive content, harassment, or fraudulent activity may be suspended or removed without notice.",
    ],
  },
  {
    title: "Interest and contact workflow",
    body: [
      "Sending an interest request does not guarantee contact access. Contact information is shared only after the recipient accepts the request and an administrator releases the connection.",
      "Attempts to bypass moderation, misuse contact details, or pressure other members are grounds for account action.",
    ],
  },
  {
    title: "Support and reporting",
    body: [
      "Members can use the Help Center to contact support or report suspicious profiles. Reports are reviewed through the administrator safety workflow inside the product.",
      "By using the service, you agree that moderation decisions may be made to protect member safety and product integrity.",
    ],
  },
];

export default async function Page() {
  const viewer = await getCurrentViewer();

  return (
    <LegalPage
      badge="Terms of Service"
      title="Member expectations for using the platform"
      introduction="These terms govern how members and administrators use the application. They are written to match the current product behavior, including verification, moderation, support, and controlled contact sharing."
      sections={sections}
      viewer={viewer}
    />
  );
}
