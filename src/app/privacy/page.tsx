import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";
import { getCurrentViewer } from "@/server/auth";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections = [
  {
    title: "What we collect",
    body: [
      "We collect the profile details you choose to provide, including name, contact information, community details, preferences, and any support or safety reports you submit.",
      "We also store operational data needed to run the service, such as secure session records, profile review status, support ticket history, and interest request activity.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "Your information is used to create and maintain your account, power profile discovery, review member submissions, and support safe introductions between members.",
      "Contact details are not exposed publicly. They are only made visible when an interest request has been accepted and an administrator releases contact access.",
    ],
  },
  {
    title: "Safety and moderation",
    body: [
      "Profile edits, support tickets, and safety reports may be reviewed by administrators so the member directory remains accurate, respectful, and trustworthy.",
      "If an account is blocked, rejected, or reported for abuse, related data may be retained for moderation, compliance, and audit purposes.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can update your profile details at any time from the member dashboard. Major edits may return the profile to the review queue before it is shown to other members again.",
      "If you need account help, contact support through the Help Center so an administrator can assist with profile or access requests.",
    ],
  },
];

export default async function Page() {
  const viewer = await getCurrentViewer();

  return (
    <LegalPage
      badge="Privacy Policy"
      title="How AV Tamil Matrimony handles member data"
      introduction="This local product build is designed to keep member information private, reviewable, and intentionally shared. The policy below explains how profile, support, and moderation data are handled inside the application."
      sections={sections}
      viewer={viewer}
    />
  );
}
