"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
import type { InterestStatus, ProfileDetail, SessionViewer } from "@/types/domain";

interface ProfileViewProps {
  viewer: SessionViewer;
  profile: ProfileDetail;
  isOwnProfile: boolean;
  interestStatus: InterestStatus | null;
  canSendInterest: boolean;
}

function getProfileTone(status: ProfileDetail["profileStatus"]) {
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  return "warning";
}

function getInterestTone(status: InterestStatus) {
  if (status === "CONTACT_SHARED") return "success";
  if (status === "DECLINED") return "danger";
  if (status === "ACCEPTED") return "warning";
  return "brand";
}

function getInterestStatusMessage(status: InterestStatus) {
  if (status === "CONTACT_SHARED") return "Contact details are now available to both members.";
  if (status === "DECLINED") return "Your previous interest request to this member was declined.";
  if (status === "ACCEPTED") return "The recipient has accepted. Contact details will be shared after administrator review.";
  return "An interest request already exists between both members.";
}

export function ProfileView({
  viewer, profile, isOwnProfile, interestStatus, canSendInterest,
}: ProfileViewProps) {
  const router = useRouter();
  const isMemberViewer = viewer.role === "MEMBER";
  const canReportProfile = isMemberViewer && !isOwnProfile;
  const canShowInterest = canSendInterest && isMemberViewer && viewer.profileComplete;
  const backTo = viewer.role === "ADMIN" ? "/admin/dashboard" : isOwnProfile ? "/dashboard" : "/search";
  const backLabel = viewer.role === "ADMIN" ? "Admin Dashboard" : isOwnProfile ? "Dashboard" : "Search";
  const interestButtonLabel = !viewer.profileComplete
    ? "Complete profile to continue"
    : canSendInterest ? "Show Interest" : "Interest unavailable";
  const [heartBurstKey, setHeartBurstKey] = useState<number | null>(null);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);

  async function handleShowInterest() {
    setHeartBurstKey(Date.now());
    setIsSubmittingInterest(true);
    try {
      await requestJson("/api/interests", { method: "POST", body: JSON.stringify({ targetUserId: profile.userId }) });
      toast.success("Interest request sent.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send interest.");
    } finally {
      setIsSubmittingInterest(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell">
        <AuthHeader viewer={viewer} backTo={backTo} backLabel={backLabel} />

        <div className="section-shell-narrow section-block pt-4 md:pt-6">
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <div className="panel-surface overflow-hidden">
                <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#FBF7F0] to-[#F5EFE0]">
                  {profile.profilePhotoUrl ? (
                    <Image
                      src={profile.profilePhotoUrl}
                      alt={profile.fullName}
                      width={960}
                      height={960}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-[#B91C1C] shadow-sm">
                      <UserRound className="h-12 w-12" />
                    </div>
                  )}
                </div>
              </div>

              {!isOwnProfile ? (
                <div className="panel-surface p-5">
                  {interestStatus ? (
                    <div className="space-y-2.5">
                      <StatusBadge label={interestStatus.replace("_", " ")} tone={getInterestTone(interestStatus)} />
                      <p className="text-sm leading-relaxed text-slate-500">{getInterestStatusMessage(interestStatus)}</p>
                    </div>
                  ) : isMemberViewer ? (
                    <>
                      <button
                        onClick={handleShowInterest}
                        disabled={!canShowInterest || isSubmittingInterest}
                        className="btn-primary w-full"
                      >
                        <AnimatedHeartIcon
                          className="h-4 w-4"
                          active
                          animateKey={heartBurstKey}
                        />
                        <span>{isSubmittingInterest ? "Sending..." : interestButtonLabel}</span>
                      </button>
                      {!canSendInterest && viewer.profileComplete ? (
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">Interest requests are not currently available for this profile.</p>
                      ) : null}
                    </>
                  ) : (
                    <div className="space-y-2.5">
                      <StatusBadge label="admin review" tone="brand" />
                      <p className="text-sm leading-relaxed text-slate-500">Administrators can review full member details here, but only members can send interest requests.</p>
                    </div>
                  )}

                  {!interestStatus && isMemberViewer && !viewer.profileComplete ? (
                    <div className="mt-3 space-y-2.5">
                      <p className="text-sm leading-relaxed text-slate-500">Complete your own profile before reaching out to other members.</p>
                      <button onClick={() => router.push("/edit-profile")} className="btn-ghost text-xs">Complete Profile</button>
                    </div>
                  ) : null}

                  {canReportProfile ? (
                    <button
                      onClick={() => router.push(`/help?tab=report&profileId=${encodeURIComponent(profile.userId)}`)}
                      className="btn-ghost mt-3 w-full text-xs"
                    >
                      Report Profile
                    </button>
                  ) : null}
                </div>
              ) : null}

              <div className="panel-surface p-5">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#B91C1C]" />
                  <h2 className="text-xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Contact visibility</h2>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
                  Contact information is only released after an accepted interest request has been reviewed and shared by the administrator.
                </p>
                <div className="mt-4 space-y-2.5 text-sm">
                  <DetailRow icon={Mail} label="Email" value={profile.canViewContact ? profile.email ?? "Not provided" : "Hidden until contact release"} />
                  <DetailRow icon={Phone} label="Phone" value={profile.canViewContact ? profile.phone ?? "Not provided" : "Hidden until contact release"} />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="hero-surface p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className="section-label">Member profile</span>
                    <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{profile.fullName}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{profile.age} years</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{profile.gender}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{profile.maritalStatus}</span>
                    </div>
                  </div>
                  <StatusBadge label={profile.profileStatus.toLowerCase()} tone={getProfileTone(profile.profileStatus)} />
                </div>

                <div className="mt-7 grid gap-3 md:grid-cols-2">
                  <DetailRow icon={MapPin} label="Location" value={`${profile.city}, ${profile.state}`} />
                  <DetailRow icon={Briefcase} label="Occupation" value={profile.occupation} />
                  <DetailRow icon={GraduationCap} label="Education" value={profile.education} />
                  <DetailRow icon={ShieldCheck} label="Community" value={profile.community} />
                </div>

                <div className="mt-7">
                  <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>About</h2>
                  <p className="mt-2.5 text-sm leading-7 text-slate-500">{profile.about}</p>
                </div>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Profile details</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <MetaCard label="Height" value={profile.height} />
                  <MetaCard label="Caste" value={profile.caste} />
                  <MetaCard label="Religion" value={profile.religion} />
                  <MetaCard label="Star" value={profile.star} />
                  <MetaCard label="Raasi" value={profile.raasi} />
                  <MetaCard label="Family status" value={profile.familyStatus} />
                  <MetaCard label="Family type" value={profile.familyType} />
                  <MetaCard label="Annual income" value={profile.annualIncome} />
                  <MetaCard label="Residency" value={profile.residencyStatus} />
                </div>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Interests and preferences</h2>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {profile.interests.length === 0 ? (
                    <span className="text-sm text-slate-400">No interests listed.</span>
                  ) : (
                    profile.interests.map((interest) => (
                      <span key={interest} className="tag-pill">
                        {interest}
                      </span>
                    ))
                  )}
                </div>

                <div className="panel-muted mt-7 p-5">
                  <div className="text-[13px] font-semibold text-slate-600">
                    What {isOwnProfile ? "you are" : `${profile.fullName.split(" ")[0]} is`} looking for
                  </div>
                  <p className="mt-2.5 text-sm leading-7 text-slate-500">{profile.partnerExpectations}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

function DetailRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#B91C1C]/[0.06] text-[#B91C1C]">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="mt-0.5 text-sm font-medium text-slate-700">{value}</div>
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-muted p-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-700">{value}</div>
    </div>
  );
}
