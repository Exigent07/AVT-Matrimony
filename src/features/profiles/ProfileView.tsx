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
import { AppHeader } from "@/components/layout/AppHeader";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  translateDisplayValue,
  translateInterestLabel,
  translateUiTerm,
} from "@/lib/translate-display";
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

function getInterestStatusMessage(status: InterestStatus, language: "en" | "ta") {
  if (status === "CONTACT_SHARED") {
    return language === "ta"
      ? "இரு உறுப்பினர்களுக்கும் தொடர்பு விவரங்கள் இப்போது கிடைக்கின்றன."
      : "Contact details are now available to both members.";
  }
  if (status === "DECLINED") {
    return language === "ta"
      ? "இந்த உறுப்பினருக்கான உங்கள் முந்தைய ஆர்வக் கோரிக்கை நிராகரிக்கப்பட்டது."
      : "Your previous interest request to this member was declined.";
  }
  if (status === "ACCEPTED") {
    return language === "ta"
      ? "பெறுநர் ஏற்றுக்கொண்டார். நிர்வாகி பரிசீலித்த பின் தொடர்பு விவரங்கள் பகிரப்படும்."
      : "The recipient has accepted. Contact details will be shared after administrator review.";
  }
  return language === "ta"
    ? "இரு உறுப்பினர்களுக்கும் இடையில் ஏற்கனவே ஒரு ஆர்வக் கோரிக்கை உள்ளது."
    : "An interest request already exists between both members.";
}

export function ProfileView({
  viewer, profile, isOwnProfile, interestStatus, canSendInterest,
}: ProfileViewProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isMemberViewer = viewer.role === "MEMBER";
  const canReportProfile = isMemberViewer && !isOwnProfile;
  const canShowInterest = canSendInterest && isMemberViewer && viewer.profileComplete;
  const headerMode = viewer.role === "ADMIN" ? "admin" : "member";
  const activeHeaderLink = viewer.role === "ADMIN" ? "admin-dashboard" : isOwnProfile ? "dashboard" : "search";
  const interestButtonLabel = !viewer.profileComplete
    ? language === "ta" ? "தொடர சுயவிவரத்தை முடிக்கவும்" : "Complete profile to continue"
    : canSendInterest
      ? language === "ta" ? "ஆர்வம் தெரிவி" : "Show Interest"
      : language === "ta" ? "ஆர்வம் தற்போது இல்லை" : "Interest unavailable";
  const [heartBurstKey, setHeartBurstKey] = useState<number | null>(null);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);

  async function handleShowInterest() {
    setHeartBurstKey(Date.now());
    setIsSubmittingInterest(true);
    try {
      await requestJson("/api/interests", { method: "POST", body: JSON.stringify({ targetUserId: profile.userId }) });
      toast.success(language === "ta" ? "ஆர்வக் கோரிக்கை அனுப்பப்பட்டது." : "Interest request sent.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : language === "ta" ? "ஆர்வத்தை அனுப்ப முடியவில்லை." : "Unable to send interest.");
    } finally {
      setIsSubmittingInterest(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode={headerMode} activeLink={activeHeaderLink} viewer={viewer} />

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
                      <p className="text-sm leading-relaxed text-slate-500">{getInterestStatusMessage(interestStatus, language)}</p>
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
                        <span>{isSubmittingInterest ? (language === "ta" ? "அனுப்புகிறது..." : "Sending...") : interestButtonLabel}</span>
                      </button>
                      {!canSendInterest && viewer.profileComplete ? (
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
                          {language === "ta" ? "இந்த சுயவிவரத்திற்கு தற்போது ஆர்வக் கோரிக்கைகள் கிடைக்கவில்லை." : "Interest requests are not currently available for this profile."}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <div className="space-y-2.5">
                      <StatusBadge label="admin review" tone="brand" />
                      <p className="text-sm leading-relaxed text-slate-500">
                        {language === "ta" ? "இங்கே நிர்வாகிகள் முழு உறுப்பினர் விவரங்களைப் பார்க்கலாம், ஆனால் உறுப்பினர்களே ஆர்வக் கோரிக்கைகளை அனுப்ப முடியும்." : "Administrators can review full member details here, but only members can send interest requests."}
                      </p>
                    </div>
                  )}

                  {!interestStatus && isMemberViewer && !viewer.profileComplete ? (
                    <div className="mt-3 space-y-2.5">
                      <p className="text-sm leading-relaxed text-slate-500">
                        {language === "ta" ? "மற்ற உறுப்பினர்களை அணுகுவதற்கு முன் உங்கள் சுயவிவரத்தை முடிக்கவும்." : "Complete your own profile before reaching out to other members."}
                      </p>
                      <button onClick={() => router.push("/edit-profile")} className="btn-ghost text-xs">
                        {language === "ta" ? "சுயவிவரம் முழுமையாக்கு" : "Complete Profile"}
                      </button>
                    </div>
                  ) : null}

                  {canReportProfile ? (
                    <button
                      onClick={() => router.push(`/help?tab=report&profileId=${encodeURIComponent(profile.userId)}`)}
                      className="btn-ghost mt-3 w-full text-xs"
                    >
                      {language === "ta" ? "சுயவிவரத்தை புகார் செய்" : "Report Profile"}
                    </button>
                  ) : null}
                </div>
              ) : null}

              <div className="panel-surface p-5">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#B91C1C]" />
                  <h2 className="text-xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                    {language === "ta" ? "தொடர்பு காட்சியளிப்பு" : "Contact visibility"}
                  </h2>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
                  {language === "ta"
                    ? "ஏற்கப்பட்ட ஆர்வக் கோரிக்கை நிர்வாகியால் பரிசீலிக்கப்பட்டு பகிரப்பட்ட பின் மட்டுமே தொடர்பு தகவல் வெளியிடப்படும்."
                    : "Contact information is only released after an accepted interest request has been reviewed and shared by the administrator."}
                </p>
                <div className="mt-4 space-y-2.5 text-sm">
                  <DetailRow icon={Mail} label={language === "ta" ? "மின்னஞ்சல்" : "Email"} value={profile.canViewContact ? profile.email ?? (language === "ta" ? "வழங்கப்படவில்லை" : "Not provided") : language === "ta" ? "தொடர்பு பகிர்வுக்குப் பிறகு தெரியும்" : "Hidden until contact release"} />
                  <DetailRow icon={Phone} label={language === "ta" ? "தொலைபேசி" : "Phone"} value={profile.canViewContact ? profile.phone ?? (language === "ta" ? "வழங்கப்படவில்லை" : "Not provided") : language === "ta" ? "தொடர்பு பகிர்வுக்குப் பிறகு தெரியும்" : "Hidden until contact release"} />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="hero-surface p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span className="section-label">{language === "ta" ? "உறுப்பினர் சுயவிவரம்" : "Member profile"}</span>
                    <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{profile.fullName}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{profile.age} {language === "ta" ? "வயது" : "years"}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{translateUiTerm(profile.gender, language)}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{translateUiTerm(profile.maritalStatus, language)}</span>
                    </div>
                  </div>
                  <StatusBadge label={profile.profileStatus.toLowerCase()} tone={getProfileTone(profile.profileStatus)} />
                </div>

                <div className="mt-7 grid gap-3 md:grid-cols-2">
                  <DetailRow
                    icon={MapPin}
                    label={language === "ta" ? "இடம்" : "Location"}
                    value={`${translateDisplayValue(profile.city, language)}, ${translateDisplayValue(profile.state, language)}`}
                  />
                  <DetailRow
                    icon={Briefcase}
                    label={language === "ta" ? "தொழில்" : "Occupation"}
                    value={translateDisplayValue(profile.occupation, language)}
                  />
                  <DetailRow
                    icon={GraduationCap}
                    label={language === "ta" ? "கல்வி" : "Education"}
                    value={translateDisplayValue(profile.education, language)}
                  />
                  <DetailRow
                    icon={ShieldCheck}
                    label={language === "ta" ? "சமூகம்" : "Community"}
                    value={translateDisplayValue(profile.community, language)}
                  />
                </div>

                <div className="mt-7">
                  <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{language === "ta" ? "பற்றி" : "About"}</h2>
                  <p className="mt-2.5 text-sm leading-7 text-slate-500">{profile.about}</p>
                </div>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{language === "ta" ? "சுயவிவர விவரங்கள்" : "Profile details"}</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <MetaCard label={language === "ta" ? "உயரம்" : "Height"} value={profile.height} />
                  <MetaCard label={language === "ta" ? "சாதி" : "Caste"} value={profile.caste} />
                  <MetaCard label={language === "ta" ? "மதம்" : "Religion"} value={profile.religion} />
                  <MetaCard label={language === "ta" ? "நட்சத்திரம்" : "Star"} value={profile.star} />
                  <MetaCard label={language === "ta" ? "ராசி" : "Raasi"} value={profile.raasi} />
                  <MetaCard label={language === "ta" ? "குடும்ப நிலை" : "Family status"} value={profile.familyStatus} />
                  <MetaCard label={language === "ta" ? "குடும்ப வகை" : "Family type"} value={profile.familyType} />
                  <MetaCard label={language === "ta" ? "வருடாந்திர வருமானம்" : "Annual income"} value={profile.annualIncome} />
                  <MetaCard label={language === "ta" ? "வசிப்பு நிலை" : "Residency"} value={profile.residencyStatus} />
                </div>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{language === "ta" ? "விருப்பங்கள் மற்றும் எதிர்பார்ப்புகள்" : "Interests and preferences"}</h2>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {profile.interests.length === 0 ? (
                    <span className="text-sm text-slate-400">{language === "ta" ? "விருப்பங்கள் சேர்க்கப்படவில்லை." : "No interests listed."}</span>
                  ) : (
                    profile.interests.map((interest) => (
                      <span key={interest} className="tag-pill">
                        {translateInterestLabel(interest, language)}
                      </span>
                    ))
                  )}
                </div>

                <div className="panel-muted mt-7 p-5">
                  <div className="text-[13px] font-semibold text-slate-600">
                    {language === "ta"
                      ? `${isOwnProfile ? "நீங்கள்" : profile.fullName.split(" ")[0]} எதிர்பார்ப்பது`
                      : `What ${isOwnProfile ? "you are" : `${profile.fullName.split(" ")[0]} is`} looking for`}
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
  const { language } = useLanguage();

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#B91C1C]/[0.06] text-[#B91C1C]">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="mt-0.5 text-sm font-medium text-slate-700">
          {translateDisplayValue(value, language)}
        </div>
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  const { language } = useLanguage();

  return (
    <div className="panel-muted p-3.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-700">
        {translateDisplayValue(value, language)}
      </div>
    </div>
  );
}
