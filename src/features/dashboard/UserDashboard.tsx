"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FilePenLine,
  Heart,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { EmptyState } from "@/components/shared/EmptyState";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
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

  return (
    <PageTransition>
      <div className="page-shell">
        <AuthHeader
          viewer={data.viewer}
          rightContent={
            <button
              onClick={() => router.push("/search")}
              className="hidden rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-[13px] font-semibold text-gray-200 hover:bg-white/[0.09] md:inline-flex"
            >
              Search Profiles
            </button>
          }
        />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-label">Member Dashboard</span>
                <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                  {data.viewer.fullName}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Manage your profile, review member activity, and keep your match journey moving
                  from one place.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={`Profile ${data.viewer.profileStatus?.toLowerCase() ?? "pending"}`}
                  tone={getProfileTone(data.viewer.profileStatus)}
                />
                <StatusBadge
                  label={data.viewer.profileComplete ? "Profile complete" : "Needs attention"}
                  tone={data.viewer.profileComplete ? "success" : "warning"}
                />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Interests Sent"
                value={data.counts.interestsSent}
                icon={Heart}
                accent="brand"
              />
              <MetricCard
                title="Interests Received"
                value={data.counts.interestsReceived}
                icon={Users}
                accent="gold"
              />
              <MetricCard
                title="Mutual Matches"
                value={data.counts.mutualMatches}
                icon={CheckCircle2}
                accent="emerald"
              />
              <MetricCard
                title="Profile Review Queue"
                value={data.counts.pendingProfileReview}
                icon={ShieldCheck}
                accent="slate"
              />
            </div>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Quick actions</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Jump into the next step of your profile or match workflow.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "View My Profile", icon: UserRound, href: "/profile/me" },
                    { label: "Edit Profile", icon: FilePenLine, href: "/edit-profile" },
                    { label: "Search Profiles", icon: Search, href: "/search" },
                    { label: "My Interests", icon: Heart, href: "/interests", iconType: "heart" as const },
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
                    <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Members interested in you</h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                      Review incoming interest requests and move promising conversations forward.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/interests")}
                    className="flex-shrink-0 text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                  >
                    View all
                  </button>
                </div>

                <div className="mt-5">
                  {data.interestedInYou.length === 0 ? (
                    <EmptyState
                      title="No incoming interest requests yet"
                      description="Keep your profile complete and polished to improve visibility across the member directory."
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
                                {interest.counterpart.age} yrs &middot; {interest.counterpart.city} &middot;{" "}
                                {interest.counterpart.occupation}
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
                  <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Profile summary</h2>
                  <button
                    onClick={() => router.push("/edit-profile")}
                    className="flex-shrink-0 text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                  >
                    Edit
                  </button>
                </div>

                <dl className="mt-5 space-y-0">
                  <SummaryRow label="Location" value={`${data.profile.city}, ${data.profile.state}`} />
                  <SummaryRow label="Education" value={data.profile.education} />
                  <SummaryRow label="Occupation" value={data.profile.occupation} />
                  <SummaryRow label="Annual income" value={data.profile.annualIncome} />
                  <SummaryRow label="Community" value={data.profile.community} last />
                </dl>

                <div className="mt-5">
                  <div className="text-[13px] font-medium text-slate-500">Selected interests</div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {data.profile.interests.length === 0 ? (
                      <span className="text-sm text-slate-400">No interests added yet.</span>
                    ) : (
                      data.profile.interests.map((interest) => (
                        <span key={interest} className="tag-pill">
                          {interest}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Recent mutual matches</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Accepted interest requests and member connections ready for the next step.
                </p>

                {data.recentMatches.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-7 text-center text-sm text-slate-400">
                    Once you and another member accept an interest request, the match will appear here.
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
                            {match.city} &middot; {match.occupation}
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
  return (
    <div className={`flex flex-col gap-1 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${last ? "" : "border-b border-slate-100"}`}>
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-left font-medium text-slate-700 sm:text-right">{value}</dd>
    </div>
  );
}
