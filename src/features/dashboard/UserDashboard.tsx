"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  FilePenLine,
  Heart,
  ListChecks,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { EmptyState } from "@/components/shared/EmptyState";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getProfileCompletionChecklist } from "@/lib/profile-completion";
import { buildProfileCompletionState } from "@/lib/profile-utils";
import { useLanguage } from "@/providers/LanguageProvider";
import { translateDisplayValue, translateInterestLabel } from "@/lib/translate-display";
import type { DashboardData } from "@/types/domain";

interface UserDashboardProps {
  data: DashboardData;
}

function getProfileTone(status: DashboardData["viewer"]["profileStatus"]) {
  if (status === "APPROVED") {
    return "success";
  }

  if (status === "REJECTED") {
    return "danger";
  }

  return "warning";
}

export function UserDashboard({ data }: UserDashboardProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const completionState = useMemo(
    () =>
      buildProfileCompletionState({
        fullName: data.profile.fullName,
        gender: data.profile.gender,
        dateOfBirth: data.profile.dateOfBirth,
        height: data.profile.height,
        maritalStatus: data.profile.maritalStatus,
        profilePhotoUrl: data.profile.profilePhotoUrl,
        community: data.profile.community,
        religion: data.profile.religion,
        caste: data.profile.caste,
        city: data.profile.city,
        state: data.profile.state,
        education: data.profile.education,
        occupation: data.profile.occupation,
        annualIncome: data.profile.annualIncome,
        about: data.profile.about,
        hobbies: data.profile.hobbies,
        selectedInterests: data.profile.interests,
        partnerExpectations: data.profile.partnerExpectations,
        email: data.viewer.email,
        phone: data.viewer.phone,
        horoscopeImageUrl: data.profile.horoscopeImageUrl,
      }),
    [data.profile, data.viewer.email, data.viewer.phone],
  );
  const completionChecklist = useMemo(
    () =>
      getProfileCompletionChecklist(completionState, language, {
        requiredOnly: true,
        limit: 4,
      }),
    [completionState, language],
  );
  const copy =
    language === "ta"
      ? {
          sectionLabel: "உறுப்பினர் பலகை",
          description: "உங்கள் சுயவிவரத்தை நிர்வகித்து, உறுப்பினர் செயல்பாட்டைப் பார்வையிட்டு, உங்கள் பொருத்தப் பயணத்தை ஒரே இடத்தில் முன்னேற்றுங்கள்.",
          quickActionsTitle: "விரைவு செயல்கள்",
          quickActionsDescription: "உங்கள் சுயவிவரத்திற்கும் பொருத்தப் பயணத்திற்கும் அடுத்த படிக்கு செல்லுங்கள்.",
          viewAll: "அனைத்தையும் காண்க",
          incomingTitle: "உங்களில் ஆர்வம் கொண்டவர்கள்",
          incomingDescription: "உள்ளார்ந்த ஆர்வக் கோரிக்கைகளை மதிப்பாய்வு செய்து நல்ல உரையாடல்களை முன்னேற்றுங்கள்.",
          noIncomingTitle: "இன்னும் வரவான ஆர்வக் கோரிக்கைகள் இல்லை",
          noIncomingDescription: "உங்கள் சுயவிவரத்தை முழுமையாகவும் அழகாகவும் வைத்தால் உறுப்பினர் பட்டியலில் உங்கள் காட்சியளிப்பு மேம்படும்.",
          summaryTitle: "சுயவிவரச் சுருக்கம்",
          selectedInterests: "தேர்ந்தெடுத்த விருப்பங்கள்",
          noInterests: "இன்னும் எந்த விருப்பமும் சேர்க்கப்படவில்லை.",
          recentTitle: "சமீபத்திய இருதரப்பு பொருத்தங்கள்",
          recentDescription: "ஏற்கப்பட்ட ஆர்வக் கோரிக்கைகள் மற்றும் அடுத்த படிக்குத் தயாரான உறுப்பினர் இணைப்புகள்.",
          noMatches: "நீங்களும் மற்றொரு உறுப்பினரும் ஆர்வக் கோரிக்கையை ஏற்றுக்கொண்டவுடன், பொருத்தம் இங்கே தோன்றும்.",
          completionTitle: "சுயவிவர நிறைவு",
          completionDescription:
            "முழு உறுப்பினர் அனுபவத்தைத் திறக்க அத்தியாவசிய விவரங்கள், கதை, மற்றும் ஆவணங்களைச் சேர்க்கவும்.",
          completionCta: "சுயவிவரம் முடிக்கவும்",
          completionDone: "உங்கள் அத்தியாவசிய சுயவிவர விவரங்கள் முடிந்துவிட்டன.",
          completionDoneHint:
            "இப்போது உங்கள் சுயவிவரம் ஆர்வக் கோரிக்கைகளுக்குத் தயாராக உள்ளது. மேலதிக விவரங்களைச் சேர்த்து அதை இன்னும் வலுப்படுத்தலாம்.",
          requiredDone: "தேவையான புலங்கள் நிறைவு",
          remainingTitle: "அடுத்ததாக நிரப்ப வேண்டியது",
        }
      : {
          sectionLabel: "Member Dashboard",
          description: "Manage your profile, review member activity, and keep your match journey moving from one place.",
          quickActionsTitle: "Quick actions",
          quickActionsDescription: "Jump into the next step of your profile or match workflow.",
          viewAll: "View all",
          incomingTitle: "Members interested in you",
          incomingDescription: "Review incoming interest requests and move promising conversations forward.",
          noIncomingTitle: "No incoming interest requests yet",
          noIncomingDescription: "Keep your profile complete and polished to improve visibility across the member directory.",
          summaryTitle: "Profile summary",
          selectedInterests: "Selected interests",
          noInterests: "No interests added yet.",
          recentTitle: "Recent mutual matches",
          recentDescription: "Accepted interest requests and member connections ready for the next step.",
          noMatches: "Once you and another member accept an interest request, the match will appear here.",
          completionTitle: "Profile completion",
          completionDescription:
            "Add the remaining essentials, story, and assets to unlock the full member workflow.",
          completionCta: "Finish profile",
          completionDone: "Your essential profile setup is complete.",
          completionDoneHint:
            "Your profile is now ready for interest requests. You can still strengthen it with richer details and media.",
          requiredDone: "Required profile fields complete",
          remainingTitle: "Next details to add",
        };

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="member" activeLink="dashboard" viewer={data.viewer} />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-label">{copy.sectionLabel}</span>
                <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                  {data.viewer.fullName}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {copy.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={data.viewer.profileStatus ?? "PENDING"}
                  tone={getProfileTone(data.viewer.profileStatus)}
                />
                <StatusBadge
                  label={
                    data.viewer.profileComplete
                      ? language === "ta"
                        ? "சுயவிவரம் தயார்"
                        : "Profile ready"
                      : language === "ta"
                        ? `${completionState.percentage}% முடிந்தது`
                        : `${completionState.percentage}% complete`
                  }
                  tone={data.viewer.profileComplete ? "success" : "warning"}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title={t("dashboard.interests.sent")}
                value={data.counts.interestsSent}
                icon={Heart}
                accent="brand"
              />
              <MetricCard
                title={t("dashboard.interests.received")}
                value={data.counts.interestsReceived}
                icon={Users}
                accent="gold"
              />
              <MetricCard
                title={language === "ta" ? "இருதரப்பு பொருத்தங்கள்" : "Mutual Matches"}
                value={data.counts.mutualMatches}
                icon={CheckCircle2}
                accent="emerald"
              />
              <MetricCard
                title={language === "ta" ? "சுயவிவர பரிசீலனை வரிசை" : "Profile Review Queue"}
                value={data.counts.pendingProfileReview}
                icon={ShieldCheck}
                accent="slate"
              />
            </div>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.quickActionsTitle}</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  {copy.quickActionsDescription}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: t("dashboard.view.profile"), icon: UserRound, href: "/profile/me" },
                    { label: t("dashboard.edit.profile"), icon: FilePenLine, href: "/edit-profile" },
                    { label: t("dashboard.search.profiles"), icon: Search, href: "/search" },
                    { label: t("dashboard.my.interests"), icon: Heart, href: "/interests", iconType: "heart" as const },
                  ].map((action) => (
                    <button
                      key={action.href}
                      onClick={() => router.push(action.href)}
                      className="panel-muted flex items-center gap-3.5 p-4 text-left transition-all duration-200 hover:border-[#B91C1C]/18 hover:bg-white"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                        {action.iconType === "heart" ? (
                          <AnimatedHeartIcon className="h-[18px] w-[18px]" active interactive />
                        ) : (
                          <action.icon className="h-[18px] w-[18px]" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.incomingTitle}</h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                      {copy.incomingDescription}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/interests")}
                    className="flex-shrink-0 text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                  >
                    {copy.viewAll}
                  </button>
                </div>

                <div className="mt-5">
                  {data.interestedInYou.length === 0 ? (
                    <EmptyState
                      title={copy.noIncomingTitle}
                      description={copy.noIncomingDescription}
                      icon={Users}
                    />
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {data.interestedInYou.map((interest) => (
                        <button
                          key={interest.id}
                          onClick={() => router.push(`/profile/${interest.counterpart.userId}`)}
                          className="panel-muted p-4 text-left transition-all duration-200 hover:border-[#B91C1C]/18 hover:bg-white"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-base font-medium text-slate-900 truncate">
                                {interest.counterpart.fullName}
                              </div>
                              <div className="mt-1 text-sm text-slate-500">
                                {interest.counterpart.age} {language === "ta" ? "வயது" : "yrs"} &middot;{" "}
                                {translateDisplayValue(interest.counterpart.city, language)} &middot;{" "}
                                {translateDisplayValue(interest.counterpart.occupation, language)}
                              </div>
                            </div>
                            <StatusBadge label={interest.status.replace("_", " ")} tone="brand" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="panel-surface p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                      {copy.completionTitle}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                      {copy.completionDescription}
                    </p>
                  </div>
                  <div className="rounded-full border border-[#B91C1C]/12 bg-[#B91C1C]/[0.05] px-3 py-1.5 text-sm font-semibold text-[#B91C1C]">
                    {completionState.percentage}%
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[13px] font-medium text-slate-500">
                    <span>{copy.requiredDone}</span>
                    <span>
                      {completionState.requiredCompletedCount}/{completionState.requiredCount}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#B91C1C] transition-[width] duration-300"
                      style={{ width: `${completionState.percentage}%` }}
                    />
                  </div>
                </div>

                {completionChecklist.length === 0 ? (
                  <div className="panel-muted mt-5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{copy.completionDone}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {copy.completionDoneHint}
                    </p>
                  </div>
                ) : (
                  <div className="panel-muted mt-5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <ListChecks className="h-4 w-4 text-[#B91C1C]" />
                      <span>{copy.remainingTitle}</span>
                    </div>
                    <div className="mt-3 space-y-2.5">
                      {completionChecklist.map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="tag-pill">{item.sectionLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => router.push("/edit-profile")}
                  className="btn-secondary mt-5 w-full justify-between"
                >
                  <span>{copy.completionCta}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.summaryTitle}</h2>
                  <button
                    onClick={() => router.push("/edit-profile")}
                    className="flex-shrink-0 text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                  >
                    {t("common.edit")}
                  </button>
                </div>

                <dl className="mt-5 space-y-0">
                  <SummaryRow
                    label={t("profile.location")}
                    value={`${translateDisplayValue(data.profile.city, language)}, ${translateDisplayValue(data.profile.state, language)}`}
                  />
                  <SummaryRow label={t("profile.education")} value={data.profile.education} />
                  <SummaryRow label={t("profile.occupation")} value={data.profile.occupation} />
                  <SummaryRow label={t("profile.income")} value={data.profile.annualIncome} />
                  <SummaryRow label={t("register.community")} value={data.profile.community} last />
                </dl>

                <div className="mt-5">
                  <div className="text-[13px] font-medium text-slate-500">{copy.selectedInterests}</div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {data.profile.interests.length === 0 ? (
                      <span className="text-sm text-slate-400">{copy.noInterests}</span>
                    ) : (
                      data.profile.interests.map((interest) => (
                        <span key={interest} className="tag-pill">
                          {translateInterestLabel(interest, language)}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.recentTitle}</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  {copy.recentDescription}
                </p>

                {data.recentMatches.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-7 text-center text-sm text-slate-400">
                    {copy.noMatches}
                  </div>
                ) : (
                  <div className="mt-5 space-y-2.5">
                    {data.recentMatches.map((match) => (
                      <button
                        key={match.userId}
                        onClick={() => router.push(`/profile/${match.userId}`)}
                        className="panel-muted flex w-full items-center justify-between px-4 py-3.5 text-left transition-all duration-200 hover:border-[#B91C1C]/18 hover:bg-white"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">{match.fullName}</div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {translateDisplayValue(match.city, language)} &middot;{" "}
                            {translateDisplayValue(match.occupation, language)}
                          </div>
                        </div>
                        <StatusBadge label="Mutual match" tone="success" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { language } = useLanguage();

  return (
    <div className={`flex flex-col gap-1 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${last ? "" : "border-b border-slate-100"}`}>
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-left font-medium text-slate-700 sm:text-right">
        {translateDisplayValue(value, language)}
      </dd>
    </div>
  );
}
