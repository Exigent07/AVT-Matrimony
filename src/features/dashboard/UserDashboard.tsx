"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
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
import { readMemberResume, type MemberResumeEntry } from "@/lib/member-resume";
import { getProfileCompletionChecklist } from "@/lib/profile-completion";
import { buildProfileCompletionState } from "@/lib/profile-utils";
import { useLanguage } from "@/providers/LanguageProvider";
import { translateDisplayValue, translateInterestLabel } from "@/lib/translate-display";
import type { DashboardData } from "@/types/domain";
import type { ProfileCompletionSectionKey } from "@/lib/profile-utils";

interface UserDashboardProps {
  data: DashboardData;
}

function getProfileTone(status: DashboardData["viewer"]["profileStatus"]) {
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  return "warning";
}

export function UserDashboard({ data }: UserDashboardProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [storedResume, setStoredResume] = useState<MemberResumeEntry | null>(null);
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
        familyStatus: data.profile.familyStatus,
        familyType: data.profile.familyType,
        about: data.profile.about,
        hobbies: data.profile.hobbies,
        selectedInterests: data.profile.interests,
        partnerLocation: data.profile.partnerLocation,
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
  const sectionIdByCompletionSection = useMemo<Record<ProfileCompletionSectionKey, string>>(
    () => ({
      identity: "personal",
      background: "community",
      career: "professional",
      story: "lifestyle",
      partner: "partner",
      interests: "interests",
      contact: "contact",
    }),
    [],
  );

  const isComplete = completionChecklist.length === 0;

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
          completionDescription: "முழு உறுப்பினர் அனுபவத்தைத் திறக்க அத்தியாவசிய விவரங்கள், கதை, மற்றும் ஆவணங்களைச் சேர்க்கவும்.",
          completionCta: "சுயவிவரம் முடிக்கவும்",
          completionDoneCta: "சுயவிவரத்தை வலுப்படுத்தவும்",
          quickActionsResumeCta: "நிறுத்திய இடத்திலிருந்து தொடரவும்",
          quickActionsResumeLabel: "நீங்கள் நிறுத்திய இடம்",
          quickActionsResumeFieldLabel: "அடுத்த விவரம்",
          resumeReceivedTitle: "பெற்ற ஆர்வங்கள்",
          resumeMatchesTitle: "சமீபத்திய பொருத்தங்கள்",
          resumeSearchTitle: "சுயவிவர தேடல்",
          nextMovePriority: "முன்னுரிமை",
          nextMoveReady: "செயல்பட தயாராக உள்ளது",
          nextMoveCompletionTitle: "மீதமுள்ள அத்தியாவசிய சுயவிவர விவரங்களை முடிக்கவும்",
          nextMoveCompletionDescription: "முழுமையான சுயவிவரம் அதிக காட்சியளிப்பை பெறும்.",
          nextMoveCompletionCta: "சுயவிவரம் தொடரவும்",
          nextMoveInterestsTitle: "வரவான ஆர்வக் கோரிக்கைகளை மதிப்பாய்வு செய்யவும்",
          nextMoveInterestsDescription: "உங்கள் சுயவிவரம் கவனத்தை ஈர்த்துவிட்டது.",
          nextMoveInterestsCta: "ஆர்வங்களை பார்க்கவும்",
          nextMoveSearchTitle: "புதிய சுயவிவரங்களைத் தேடத் தொடங்குங்கள்",
          nextMoveSearchDescription: "உங்கள் அடிப்படை அமைப்பு தயாராக உள்ளது.",
          nextMoveSearchCta: "தேடலைத் தொடங்கவும்",
          nextMoveMatchesTitle: "சமீபத்திய பொருத்தங்களைத் தொடர்ந்து முன்னேற்றுங்கள்",
          nextMoveMatchesDescription: "உங்கள் புதிய பொருத்தங்களை திறந்து அடுத்த படிக்குத் தயாரான தொடர்புகளை முன்னேற்றுங்கள்.",
          nextMoveMatchesCta: "பொருத்தங்களை பார்க்கவும்",
          completionDone: "உங்கள் அத்தியாவசிய சுயவிவர விவரங்கள் முடிந்துவிட்டன.",
          completionDoneHint: "இப்போது உங்கள் சுயவிவரம் ஆர்வக் கோரிக்கைகளுக்குத் தயாராக உள்ளது.",
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
          completionDescription: "Add the remaining essentials, story, and assets to unlock the full member workflow.",
          completionCta: "Finish profile",
          completionDoneCta: "Strengthen profile",
          quickActionsResumeCta: "Continue where you left off",
          quickActionsResumeLabel: "You left off at",
          quickActionsResumeFieldLabel: "Next detail",
          resumeReceivedTitle: "Received interests",
          resumeMatchesTitle: "Recent matches",
          resumeSearchTitle: "Profile search",
          nextMovePriority: "Priority",
          nextMoveReady: "Ready now",
          nextMoveCompletionTitle: "Complete the remaining essential profile details",
          nextMoveCompletionDescription: "A fuller profile gets more visibility.",
          nextMoveCompletionCta: "Continue profile",
          nextMoveInterestsTitle: "Review the interest requests waiting for you",
          nextMoveInterestsDescription: "Your profile is already drawing attention.",
          nextMoveInterestsCta: "View interests",
          nextMoveSearchTitle: "Start exploring new profiles",
          nextMoveSearchDescription: "Your essentials are in place. Browse verified members.",
          nextMoveSearchCta: "Start searching",
          nextMoveMatchesTitle: "Follow up on your newest matches",
          nextMoveMatchesDescription: "You already have mutual interest. Keep that connection moving.",
          nextMoveMatchesCta: "Open matches",
          completionDone: "Your essential profile setup is complete.",
          completionDoneHint: "Your profile is now ready for interest requests. You can still strengthen it with richer details and media.",
          requiredDone: "Required profile fields complete",
          remainingTitle: "Next details to add",
        };

  const fallbackValue = language === "ta" ? "குறிப்பிடப்படவில்லை" : "Not specified";
  const profileLocation =
    [data.profile.city, data.profile.state]
      .map((v) => v?.trim())
      .filter(Boolean)
      .join(", ") || fallbackValue;

  const summaryItems = [
    { label: t("profile.location"), value: profileLocation },
    { label: t("profile.education"), value: data.profile.education || fallbackValue },
    { label: t("profile.occupation"), value: data.profile.occupation || fallbackValue },
    { label: t("profile.income"), value: data.profile.annualIncome || fallbackValue },
    { label: t("register.community"), value: data.profile.community || fallbackValue },
  ];

  const dashboardActions = [
    { label: t("dashboard.view.profile"), icon: UserRound, href: "/profile/me" },
    { label: t("dashboard.edit.profile"), icon: FilePenLine, href: "/edit-profile" },
    { label: t("dashboard.search.profiles"), icon: Search, href: "/search" },
    { label: t("dashboard.my.interests"), icon: Heart, href: "/interests", iconType: "heart" as const },
  ];
  const resumeIconMap = useMemo(
    () => ({
      search: Search,
      user: UserRound,
      heart: Heart,
      file: FilePenLine,
      help: CircleHelp,
    }),
    [],
  );

  const quickActionSupport = useMemo(() => {
    if (completionChecklist.length > 0) {
      const firstMissingItem = completionChecklist[0];
      const firstMissingSectionId = sectionIdByCompletionSection[firstMissingItem.section];
      return {
        cta: copy.nextMoveCompletionCta,
        href: `/edit-profile#${firstMissingSectionId}`,
        resumeTitle: firstMissingItem.sectionLabel,
        resumeDetail: firstMissingItem.label,
        badge: copy.nextMovePriority,
        icon: ListChecks,
      };
    }
    if (data.interestedInYou.length > 0) {
      return {
        cta: copy.nextMoveInterestsCta,
        href: "/interests?tab=received",
        resumeTitle: copy.resumeReceivedTitle,
        resumeDetail: language === "ta"
          ? `${data.interestedInYou.length} புதிய கோரிக்கைகள் காத்திருக்கின்றன`
          : `${data.interestedInYou.length} new requests waiting`,
        badge: copy.nextMoveReady,
        icon: Users,
      };
    }
    if (data.recentMatches.length > 0) {
      return {
        cta: copy.nextMoveMatchesCta,
        href: "/interests?tab=sent",
        resumeTitle: copy.resumeMatchesTitle,
        resumeDetail: language === "ta"
          ? `${data.recentMatches.length} தொடர்புகள் அடுத்த படிக்குத் தயாராக உள்ளன`
          : `${data.recentMatches.length} connections ready for the next step`,
        badge: copy.nextMoveReady,
        icon: CheckCircle2,
      };
    }
    return {
      cta: copy.nextMoveSearchCta,
      href: "/search",
      resumeTitle: copy.resumeSearchTitle,
      resumeDetail: language === "ta"
        ? "சரிபார்க்கப்பட்ட உறுப்பினர்களை பார்க்க உங்கள் சுயவிவரம் தயாராக உள்ளது"
        : "Your profile is ready to browse verified members",
      badge: copy.nextMoveReady,
      icon: Search,
      showFieldLabel: false,
    };
  }, [
    completionChecklist,
    copy.nextMoveCompletionCta, copy.nextMoveInterestsCta, copy.nextMoveMatchesCta,
    copy.nextMoveSearchCta, copy.nextMovePriority, copy.nextMoveReady,
    copy.resumeReceivedTitle, copy.resumeMatchesTitle, copy.resumeSearchTitle,
    data.interestedInYou.length, data.recentMatches.length,
    language, sectionIdByCompletionSection,
  ]);
  const resolvedResume = useMemo(() => {
    if (!storedResume) {
      return quickActionSupport;
    }

    return {
      ...quickActionSupport,
      href: storedResume.href,
      icon: resumeIconMap[storedResume.icon] ?? quickActionSupport.icon,
      resumeTitle: storedResume.title[language],
      resumeDetail: storedResume.detail?.[language] ?? storedResume.title[language],
      showFieldLabel: false,
    };
  }, [language, quickActionSupport, resumeIconMap, storedResume]);

  useEffect(() => {
    setStoredResume(readMemberResume(data.viewer.id));
  }, [data.viewer.id]);

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="member" activeLink="dashboard" viewer={data.viewer} />

        <div className="section-shell section-block pt-4 md:pt-6">

          {/* ── Hero header ── */}
          <section className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-label">{copy.sectionLabel}</span>
                <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">
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
                      ? language === "ta" ? "சுயவிவரம் தயார்" : "Profile ready"
                      : language === "ta"
                        ? `${completionState.percentage}% முடிந்தது`
                        : `${completionState.percentage}% complete`
                  }
                  tone={data.viewer.profileComplete ? "success" : "warning"}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title={t("dashboard.interests.sent")} value={data.counts.interestsSent} icon={Heart} accent="brand" />
              <MetricCard title={t("dashboard.interests.received")} value={data.counts.interestsReceived} icon={Users} accent="gold" />
              <MetricCard title={language === "ta" ? "இருதரப்பு பொருத்தங்கள்" : "Mutual Matches"} value={data.counts.mutualMatches} icon={CheckCircle2} accent="emerald" />
              <MetricCard title={language === "ta" ? "சுயவிவர பரிசீலனை வரிசை" : "Profile Review Queue"} value={data.counts.pendingProfileReview} icon={ShieldCheck} accent="slate" />
            </div>
          </section>

          {/* ── Row 1: Quick actions | Profile completion ── */}
          <section className="mt-5 grid gap-5 xl:grid-cols-12">
            <div className="panel-surface flex flex-col p-6 md:p-8 xl:col-span-5">
              <h2 className="font-display text-2xl text-slate-900">{copy.quickActionsTitle}</h2>
              <p className="mt-1.5 text-sm text-slate-500">{copy.quickActionsDescription}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {dashboardActions.map((action) => (
                  <button
                    key={action.href}
                    onClick={() => router.push(action.href)}
                    className="interactive-row flex items-center gap-3.5 text-left"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                      {action.iconType === "heart" ? (
                        <AnimatedHeartIcon className="h-[17px] w-[17px]" active interactive />
                      ) : (
                        <action.icon className="h-[17px] w-[17px]" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Resume card — pushed to bottom */}
              <div className="panel-muted mt-5 flex flex-col gap-1.5 p-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {copy.quickActionsResumeLabel}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <resolvedResume.icon className="h-4 w-4 shrink-0 text-[#B91C1C]" />
                    <span>{resolvedResume.resumeTitle}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {resolvedResume.showFieldLabel !== false ? (
                      <>
                        <span className="font-medium text-slate-700">{copy.quickActionsResumeFieldLabel}:</span>{" "}
                        {resolvedResume.resumeDetail}
                      </>
                    ) : (
                      resolvedResume.resumeDetail
                    )}
                  </p>
                </div>
                <button
                  onClick={() => router.push(resolvedResume.href)}
                  className="btn-secondary w-full justify-between"
                >
                  <span>{copy.quickActionsResumeCta}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="panel-surface flex flex-col p-6 md:p-8 xl:col-span-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-slate-900">{copy.completionTitle}</h2>
                  <p className="mt-1.5 text-sm text-slate-500">{copy.completionDescription}</p>
                </div>
                <div className="shrink-0 rounded-full border border-[#B91C1C]/12 bg-[#B91C1C]/[0.05] px-3 py-1.5 text-sm font-semibold text-[#B91C1C]">
                  {completionState.percentage}%
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[13px] font-medium text-slate-500">
                  <span>{copy.requiredDone}</span>
                  <span className="tabular-nums">
                    {completionState.requiredCompletedCount}/{completionState.requiredCount}
                  </span>
                </div>
                <div className="progress-track mt-2">
                  <div
                    className={`progress-fill ${completionState.percentage >= 100 ? "progress-fill--success" : ""}`}
                    style={{ width: `${completionState.percentage}%` }}
                  />
                </div>
              </div>

              {/* Checklist or done state — grows to fill available space */}
              <div className="mt-5 flex-1">
                {isComplete ? (
                  <div className="panel-muted p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{copy.completionDone}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {copy.completionDoneHint}
                    </p>
                  </div>
                ) : (
                  <div className="panel-muted p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <ListChecks className="h-4 w-4 text-[#B91C1C]" />
                      <span>{copy.remainingTitle}</span>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {completionChecklist.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#B91C1C]/10 bg-white/80 px-3 py-2.5 text-sm"
                        >
                          <span className="text-slate-600">{item.label}</span>
                          <span className="tag-pill">{item.sectionLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA pinned to bottom */}
              <button
                onClick={() => router.push("/edit-profile")}
                className="btn-secondary mt-5 w-full justify-between"
              >
                <span>{isComplete ? copy.completionDoneCta : copy.completionCta}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* ── Row 2: Incoming interests | Profile summary ── */}
          <section className="mt-5 grid gap-5 xl:grid-cols-12">
            <div className="panel-surface flex flex-col p-6 md:p-8 xl:col-span-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-slate-900">{copy.incomingTitle}</h2>
                  <p className="mt-1.5 text-sm text-slate-500">{copy.incomingDescription}</p>
                </div>
                <button
                  onClick={() => router.push("/interests")}
                  className="shrink-0 text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                >
                  {copy.viewAll}
                </button>
              </div>

              <div className="mt-5 flex-1 h-full">
                {data.interestedInYou.length === 0 ? (
                  <EmptyState
                    title={copy.noIncomingTitle}
                    description={copy.noIncomingDescription}
                    icon={Users}
                  />
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {data.interestedInYou.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => router.push(`/profile/${interest.counterpart.userId}`)}
                        className="interactive-row text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">
                              {interest.counterpart.fullName}
                            </div>
                            <div className="mt-0.5 text-xs leading-relaxed text-slate-500">
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

            <div className="panel-surface flex flex-col p-6 md:p-8 xl:col-span-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-2xl text-slate-900">{copy.summaryTitle}</h2>
                <button
                  onClick={() => router.push("/edit-profile")}
                  className="shrink-0 text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                >
                  {t("common.edit")}
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {summaryItems.map((item) => (
                  <ProfileFactCard key={item.label} label={item.label} value={item.value} />
                ))}
              </div>

              <div className="panel-muted mt-4 p-4">
                <div className="text-[13px] font-medium text-slate-500">{copy.selectedInterests}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
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
          </section>

          {/* ── Row 3: Recent matches (full width) ── */}
          <section className="mt-5">
            <div className="panel-surface p-6 md:p-8">
              <h2 className="font-display text-2xl text-slate-900">{copy.recentTitle}</h2>
              <p className="mt-1.5 text-sm text-slate-500">{copy.recentDescription}</p>

              {data.recentMatches.length === 0 ? (
                <div className="mt-5">
                  <EmptyState
                    title={copy.recentTitle}
                    description={copy.noMatches}
                    icon={CheckCircle2}
                  />
                </div>
              ) : (
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {data.recentMatches.map((match) => (
                    <button
                      key={match.userId}
                      onClick={() => router.push(`/profile/${match.userId}`)}
                      className="interactive-row flex w-full items-center justify-between gap-4 text-left"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">{match.fullName}</div>
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
          </section>

        </div>
      </div>
    </PageTransition>
  );
}

function ProfileFactCard({ label, value }: { label: string; value: string }) {
  const { language } = useLanguage();
  return (
    <div className="panel-muted min-w-0 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold leading-relaxed text-slate-700">
        {translateDisplayValue(value, language)}
      </div>
    </div>
  );
}
