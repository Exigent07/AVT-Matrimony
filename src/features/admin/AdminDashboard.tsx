"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  HeartHandshake,
  LifeBuoy,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
import { useLanguage } from "@/providers/LanguageProvider";
import { translateDisplayValue, translateUiTerm } from "@/lib/translate-display";
import type { AdminDashboardData, AdminInterestItem, AdminUserItem } from "@/types/domain";

interface AdminDashboardProps {
  data: AdminDashboardData;
}

type TabId = "overview" | "members" | "interests" | "tickets" | "reports";

function getProfileTone(status: AdminUserItem["profileStatus"]) {
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  return "warning";
}

function getInterestTone(status: AdminInterestItem["status"]) {
  if (status === "CONTACT_SHARED") return "success";
  if (status === "DECLINED") return "danger";
  if (status === "ACCEPTED") return "warning";
  return "brand";
}

function getTicketTone(status: AdminDashboardData["tickets"][number]["status"]) {
  if (status === "CLOSED") return "success";
  if (status === "IN_PROGRESS") return "warning";
  return "brand";
}

function getReportTone(status: AdminDashboardData["reports"][number]["status"]) {
  if (status === "RESOLVED") return "success";
  if (status === "REVIEWED") return "warning";
  return "danger";
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [memberPendingDelete, setMemberPendingDelete] = useState<AdminUserItem | null>(null);
  const copy = language === "ta"
    ? {
        memberUpdated: "உறுப்பினர் புதுப்பிக்கப்பட்டார்.",
        memberDeleted: "உறுப்பினர் நீக்கப்பட்டார்.",
        contactReleased: "தொடர்பு விவரங்கள் வெளியிடப்பட்டன.",
        ticketUpdated: "டிக்கெட் புதுப்பிக்கப்பட்டது.",
        reportUpdated: "புகார் புதுப்பிக்கப்பட்டது.",
        updateMemberError: "உறுப்பினரை புதுப்பிக்க முடியவில்லை.",
        deleteMemberError: "உறுப்பினரை நீக்க முடியவில்லை.",
        releaseError: "தொடர்பு விவரங்களை வெளியிட முடியவில்லை.",
        ticketError: "டிக்கெட்டை புதுப்பிக்க முடியவில்லை.",
        reportError: "புகாரை புதுப்பிக்க முடியவில்லை.",
        tabs: { overview: "மேலோட்டம்", members: "உறுப்பினர்கள்", interests: "ஆர்வங்கள்", tickets: "ஆதரவு", reports: "புகார்கள்" },
        sectionLabel: "நிர்வாகம்",
        heroTitle: "செயல்பாட்டு பலகை",
        heroDescription: "புதிய உறுப்பினர் சுயவிவரங்களை மதிப்பாய்வு செய்து, ஆர்வ நடைமுறையை நிர்வகித்து, ஆதரவு மற்றும் பாதுகாப்பு வரிசைகளை சேவையகச் செயல்களுடன் நகர்த்துங்கள்.",
        totalMembers: "மொத்த உறுப்பினர்கள்",
        pendingProfiles: "நிலுவை சுயவிவரங்கள்",
        pendingInterests: "நிலுவை ஆர்வங்கள்",
        sharedContacts: "பகிரப்பட்ட தொடர்புகள்",
        openTickets: "திறந்த ஆதரவு டிக்கெட்டுகள்",
        openReports: "திறந்த புகார்கள்",
        moderationTitle: "உறுப்பினர் பரிசீலனை",
        moderationDescription: "சுயவிவரங்களை அங்கீகரிக்கவும், சிக்கலான கணக்குகளைத் தடுக்கவும், அல்லது தேவையானால் உறுப்பினர்களை முழுமையாக நீக்கவும்.",
        interestsTitle: "ஆர்வ நடைமுறை",
        supportTitle: "ஆதரவு வரிசை",
        reportsTitle: "பாதுகாப்பு புகார்கள்",
        deleteTitle: memberPendingDelete ? `${memberPendingDelete.fullName} ஐ நீக்கவா?` : "உறுப்பினரை நீக்கவா?",
        deleteDescription: "இது உறுப்பினர் கணக்கு, சுயவிவர தரவு, மற்றும் தொடர்புடைய பதிவுகளை நிரந்தரமாக நீக்கும். இதை திரும்பப் பெற முடியாது.",
        deleteLabel: "உறுப்பினரை நீக்கு",
      }
    : {
        memberUpdated: "Member updated.",
        memberDeleted: "Member deleted.",
        contactReleased: "Contact details released.",
        ticketUpdated: "Ticket updated.",
        reportUpdated: "Report updated.",
        updateMemberError: "Unable to update member.",
        deleteMemberError: "Unable to delete member.",
        releaseError: "Unable to release contact details.",
        ticketError: "Unable to update ticket.",
        reportError: "Unable to update report.",
        tabs: { overview: "Overview", members: "Members", interests: "Interests", tickets: "Support", reports: "Reports" },
        sectionLabel: "Administration",
        heroTitle: "Operations dashboard",
        heroDescription: "Review new member profiles, manage the interest workflow, and keep support and safety queues moving with server-backed actions.",
        totalMembers: "Total Members",
        pendingProfiles: "Pending Profiles",
        pendingInterests: "Pending Interests",
        sharedContacts: "Shared Contacts",
        openTickets: "Open Support Tickets",
        openReports: "Open Reports",
        moderationTitle: "Member moderation",
        moderationDescription: "Approve profiles, block problematic accounts, or remove members entirely when needed.",
        interestsTitle: "Interest workflow",
        supportTitle: "Support queue",
        reportsTitle: "Safety reports",
        deleteTitle: memberPendingDelete ? `Delete ${memberPendingDelete.fullName}?` : "Delete member?",
        deleteDescription: "This will permanently remove the member account, profile data, and related records. This action cannot be undone.",
        deleteLabel: "Delete member",
      };

  async function updateMember(userId: string, payload: Record<string, string>) {
    setProcessingId(userId);
    try {
      await requestJson(`/api/admin/users/${userId}`, { method: "PATCH", body: JSON.stringify(payload) });
      toast.success(copy.memberUpdated);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.updateMemberError);
    } finally {
      setProcessingId(null);
    }
  }

  async function deleteMember(userId: string) {
    setProcessingId(userId);
    try {
      await requestJson(`/api/admin/users/${userId}`, { method: "DELETE" });
      toast.success(copy.memberDeleted);
      setMemberPendingDelete(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.deleteMemberError);
    } finally {
      setProcessingId(null);
    }
  }

  async function shareContact(interestId: string) {
    setProcessingId(interestId);
    try {
      await requestJson(`/api/admin/interests/${interestId}`, { method: "PATCH", body: JSON.stringify({}) });
      toast.success(copy.contactReleased);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.releaseError);
    } finally {
      setProcessingId(null);
    }
  }

  async function updateTicket(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "CLOSED") {
    setProcessingId(ticketId);
    try {
      await requestJson(`/api/admin/tickets/${ticketId}`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success(copy.ticketUpdated);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.ticketError);
    } finally {
      setProcessingId(null);
    }
  }

  async function updateReport(reportId: string, status: "OPEN" | "REVIEWED" | "RESOLVED") {
    setProcessingId(reportId);
    try {
      await requestJson(`/api/admin/reports/${reportId}`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success(copy.reportUpdated);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.reportError);
    } finally {
      setProcessingId(null);
    }
  }

  const tabs = [
    { id: "overview" as const, label: copy.tabs.overview },
    { id: "members" as const, label: copy.tabs.members },
    { id: "interests" as const, label: copy.tabs.interests },
    { id: "tickets" as const, label: copy.tabs.tickets },
    { id: "reports" as const, label: copy.tabs.reports },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader
          mode="admin"
          activeLink="admin-dashboard"
          adminName={data.viewer.fullName}
          viewer={data.viewer}
        />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">{copy.sectionLabel}</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{copy.heroTitle}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              {copy.heroDescription}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard title={copy.totalMembers} value={data.stats.totalUsers} icon={Users} />
              <MetricCard title={copy.pendingProfiles} value={data.stats.pendingProfiles} icon={FileText} accent="gold" />
              <MetricCard title={copy.pendingInterests} value={data.stats.pendingInterests} icon={HeartHandshake} accent="slate" />
              <MetricCard title={copy.sharedContacts} value={data.stats.sharedContacts} icon={CheckCircle2} accent="emerald" />
              <MetricCard title={copy.openTickets} value={data.stats.openTickets} icon={LifeBuoy} accent="gold" />
              <MetricCard title={copy.openReports} value={data.stats.openReports} icon={ShieldAlert} accent="brand" />
            </div>
          </section>

          <section className="toolbar-surface mt-6 p-1.5">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="tab-chip"
                  data-active={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {activeTab === "overview" ? <OverviewPanel data={data} /> : null}

          {activeTab === "members" ? (
            <section className="panel-surface mt-6 p-6 md:p-8">
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.moderationTitle}</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                {copy.moderationDescription}
              </p>
              <div className="mt-5 space-y-3">
                {data.users.map((member) => (
                  <MemberRow
                    key={member.userId}
                    member={member}
                    loading={processingId === member.userId}
                    onView={() => router.push(`/profile/${member.userId}`)}
                    onApprove={() => updateMember(member.userId, { profileStatus: "APPROVED" })}
                    onReject={() => updateMember(member.userId, { profileStatus: "REJECTED" })}
                    onBlock={() => updateMember(member.userId, { accountStatus: member.accountStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED" })}
                    onDelete={() => setMemberPendingDelete(member)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "interests" ? (
            <section className="panel-surface mt-6 p-6 md:p-8">
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.interestsTitle}</h2>
              <div className="mt-5 space-y-3">
                {data.interests.map((interest) => (
                  <InterestRow key={interest.id} interest={interest} loading={processingId === interest.id} onShare={() => shareContact(interest.id)} />
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "tickets" ? (
            <section className="panel-surface mt-6 p-6 md:p-8">
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.supportTitle}</h2>
              <div className="mt-5 space-y-3">
                {data.tickets.map((ticket) => (
                  <div key={ticket.id} className="panel-muted p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-slate-900">{ticket.subject}</h3>
                          <StatusBadge label={ticket.status.toLowerCase()} tone={getTicketTone(ticket.status)} />
                        </div>
                        <p className="mt-1.5 text-sm text-slate-500">{ticket.name} &middot; {ticket.email}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{ticket.message}</p>
                      </div>
                      <div className="flex flex-shrink-0 flex-wrap gap-2">
                        {(["OPEN", "IN_PROGRESS", "CLOSED"] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateTicket(ticket.id, status)}
                            disabled={processingId === ticket.id}
                            className="btn-ghost px-3 py-2 text-xs"
                          >
                            {translateUiTerm(status, language)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "reports" ? (
            <section className="panel-surface mt-6 p-6 md:p-8">
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{copy.reportsTitle}</h2>
              <div className="mt-5 space-y-3">
                {data.reports.map((report) => (
                  <div key={report.id} className="panel-muted p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-slate-900">{translateUiTerm(report.reason, language)}</h3>
                          <StatusBadge label={report.status.toLowerCase()} tone={getReportTone(report.status)} />
                        </div>
                        <p className="mt-1.5 text-sm text-slate-500">
                          {language === "ta" ? `புகாரளித்தவர்: ${report.reporterName}` : `Reporter: ${report.reporterName}`}
                          {report.reportedName ? language === "ta" ? ` \u00B7 புகாரிடப்பட்டவர்: ${report.reportedName}` : ` \u00B7 Reported: ${report.reportedName}` : ""}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{language === "ta" ? "குறிப்பு" : "Ref"}: {report.reportedProfileReference}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{report.details}</p>
                      </div>
                      <div className="flex flex-shrink-0 flex-wrap gap-2">
                        {(["OPEN", "REVIEWED", "RESOLVED"] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateReport(report.id, status)}
                            disabled={processingId === report.id}
                            className="btn-ghost px-3 py-2 text-xs"
                          >
                            {translateUiTerm(status, language)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <ConfirmationDialog
          open={Boolean(memberPendingDelete)}
          title={copy.deleteTitle}
          description={copy.deleteDescription}
          confirmLabel={copy.deleteLabel}
          loading={processingId === memberPendingDelete?.userId}
          onCancel={() => {
            if (!processingId) {
              setMemberPendingDelete(null);
            }
          }}
          onConfirm={() => {
            if (memberPendingDelete) {
              void deleteMember(memberPendingDelete.userId);
            }
          }}
        />
      </div>
    </PageTransition>
  );
}

function OverviewPanel({ data }: { data: AdminDashboardData }) {
  const { language } = useLanguage();
  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-2">
      <div className="panel-surface p-6 md:p-8">
        <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          {language === "ta" ? "நடவடிக்கைக்காக காத்திருக்கும் சுயவிவரங்கள்" : "Profiles awaiting action"}
        </h2>
        <div className="mt-4 space-y-2.5">
          {data.users
            .filter((member) => member.profileStatus === "PENDING")
            .slice(0, 5)
            .map((member) => (
              <div
                key={member.userId}
                className="panel-muted flex items-center justify-between px-4 py-3.5"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{member.fullName}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {translateDisplayValue(member.city, language)} &middot;{" "}
                    {translateDisplayValue(member.occupation, language)}
                  </div>
                </div>
                <StatusBadge label="pending" tone="warning" />
              </div>
            ))}
          {data.users.every((member) => member.profileStatus !== "PENDING") ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center text-sm text-slate-400">
              {language === "ta" ? "தற்போது பரிசீலனைக்காக காத்திருக்கும் உறுப்பினர் சுயவிவரங்கள் இல்லை." : "No member profiles are waiting for moderation right now."}
            </div>
          ) : null}
        </div>
      </div>

      <div className="panel-surface p-6 md:p-8">
        <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          {language === "ta" ? "வெளியீட்டுக்காக காத்திருக்கும் ஆர்வக் கோரிக்கைகள்" : "Interest requests awaiting release"}
        </h2>
        <div className="mt-4 space-y-2.5">
          {data.interests
            .filter((interest) => interest.status === "ACCEPTED")
            .slice(0, 5)
            .map((interest) => (
              <div key={interest.id} className="panel-muted px-4 py-3.5">
                <div className="text-sm font-medium text-slate-900">
                  {language === "ta" ? `${interest.fromUser.name} இருந்து ${interest.toUser.name} வரை` : `${interest.fromUser.name} to ${interest.toUser.name}`}
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {language === "ta" ? "பெறுநர் ஏற்றுக்கொண்டார். தொடர்பு விவரங்களை இப்போது வெளியிடலாம்." : "Recipient accepted. Contact details can now be released."}
                </div>
              </div>
            ))}
          {data.interests.every((interest) => interest.status !== "ACCEPTED") ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center text-sm text-slate-400">
              {language === "ta" ? "தொடர்பு பகிர்வுக்காக காத்திருக்கும் ஏற்றுக்கொள்ளப்பட்ட ஆர்வக் கோரிக்கைகள் இல்லை." : "No accepted interest requests are waiting for contact release."}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function MemberRow({
  member, loading, onView, onApprove, onReject, onBlock, onDelete,
}: {
  member: AdminUserItem; loading: boolean;
  onView: () => void; onApprove: () => void; onReject: () => void; onBlock: () => void; onDelete: () => void;
}) {
  const { language } = useLanguage();
  return (
    <div className="panel-muted p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-slate-900">{member.fullName}</h3>
            <StatusBadge label={member.profileStatus.toLowerCase()} tone={getProfileTone(member.profileStatus)} />
            <StatusBadge label={member.accountStatus.toLowerCase()} tone={member.accountStatus === "ACTIVE" ? "success" : "danger"} />
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            {member.email} &middot; {translateDisplayValue(member.city, language)} &middot;{" "}
            {translateDisplayValue(member.occupation, language)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onView} disabled={loading} className="btn-secondary px-3 py-2 text-xs">
            {language === "ta" ? "சுயவிவரத்தை காண்க" : "View Profile"}
          </button>
          <button
            onClick={onApprove}
            disabled={loading || member.profileStatus === "APPROVED"}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            <UserCheck className="h-3.5 w-3.5" />
            {language === "ta" ? "அங்கீகரி" : "Approve"}
          </button>
          <button
            onClick={onReject}
            disabled={loading || member.profileStatus === "REJECTED"}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-900 disabled:opacity-60"
          >
            <UserX className="h-3.5 w-3.5" />
            {language === "ta" ? "நிராகரி" : "Reject"}
          </button>
          <button onClick={onBlock} disabled={loading} className="btn-ghost px-3 py-2 text-xs">
            {member.accountStatus === "BLOCKED"
              ? language === "ta" ? "செயல்படுத்து" : "Activate"
              : language === "ta" ? "தடைசெய்" : "Block"}
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {language === "ta" ? "நீக்கு" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InterestRow({
  interest, loading, onShare,
}: {
  interest: AdminInterestItem; loading: boolean; onShare: () => void;
}) {
  const { language } = useLanguage();
  return (
    <div className="panel-muted p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-slate-900">
              {language === "ta" ? `${interest.fromUser.name} இருந்து ${interest.toUser.name} வரை` : `${interest.fromUser.name} to ${interest.toUser.name}`}
            </h3>
            <StatusBadge label={interest.status.toLowerCase()} tone={getInterestTone(interest.status)} />
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            {language === "ta" ? `அனுப்புநர்: ${interest.fromUser.email} · பெறுநர்: ${interest.toUser.email}` : `Sender: ${interest.fromUser.email} · Recipient: ${interest.toUser.email}`}
          </p>
        </div>
        <button
          onClick={onShare}
          disabled={interest.status !== "ACCEPTED" || loading}
          className="btn-primary flex-shrink-0 px-4 py-2.5 text-xs"
        >
          {language === "ta" ? "தொடர்பு விவரங்களை வெளியிடு" : "Release Contact Details"}
        </button>
      </div>
    </div>
  );
}
