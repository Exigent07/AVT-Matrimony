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
import { AdminHeader } from "@/components/layout/AdminHeader";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
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
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [memberPendingDelete, setMemberPendingDelete] = useState<AdminUserItem | null>(null);

  async function updateMember(userId: string, payload: Record<string, string>) {
    setProcessingId(userId);
    try {
      await requestJson(`/api/admin/users/${userId}`, { method: "PATCH", body: JSON.stringify(payload) });
      toast.success("Member updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update member.");
    } finally {
      setProcessingId(null);
    }
  }

  async function deleteMember(userId: string) {
    setProcessingId(userId);
    try {
      await requestJson(`/api/admin/users/${userId}`, { method: "DELETE" });
      toast.success("Member deleted.");
      setMemberPendingDelete(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete member.");
    } finally {
      setProcessingId(null);
    }
  }

  async function shareContact(interestId: string) {
    setProcessingId(interestId);
    try {
      await requestJson(`/api/admin/interests/${interestId}`, { method: "PATCH", body: JSON.stringify({}) });
      toast.success("Contact details released.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to release contact details.");
    } finally {
      setProcessingId(null);
    }
  }

  async function updateTicket(ticketId: string, status: "OPEN" | "IN_PROGRESS" | "CLOSED") {
    setProcessingId(ticketId);
    try {
      await requestJson(`/api/admin/tickets/${ticketId}`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success("Ticket updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update ticket.");
    } finally {
      setProcessingId(null);
    }
  }

  async function updateReport(reportId: string, status: "OPEN" | "REVIEWED" | "RESOLVED") {
    setProcessingId(reportId);
    try {
      await requestJson(`/api/admin/reports/${reportId}`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success("Report updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update report.");
    } finally {
      setProcessingId(null);
    }
  }

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "members" as const, label: "Members" },
    { id: "interests" as const, label: "Interests" },
    { id: "tickets" as const, label: "Support" },
    { id: "reports" as const, label: "Reports" },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <AdminHeader adminName={data.viewer.fullName} viewer={data.viewer} />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">Administration</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Operations dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Review new member profiles, manage the interest workflow, and keep support and safety
              queues moving with server-backed actions.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard title="Total Members" value={data.stats.totalUsers} icon={Users} />
              <MetricCard title="Pending Profiles" value={data.stats.pendingProfiles} icon={FileText} accent="gold" />
              <MetricCard title="Pending Interests" value={data.stats.pendingInterests} icon={HeartHandshake} accent="slate" />
              <MetricCard title="Shared Contacts" value={data.stats.sharedContacts} icon={CheckCircle2} accent="emerald" />
              <MetricCard title="Open Support Tickets" value={data.stats.openTickets} icon={LifeBuoy} accent="gold" />
              <MetricCard title="Open Reports" value={data.stats.openReports} icon={ShieldAlert} accent="brand" />
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
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Member moderation</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Approve profiles, block problematic accounts, or remove members entirely when needed.
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
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Interest workflow</h2>
              <div className="mt-5 space-y-3">
                {data.interests.map((interest) => (
                  <InterestRow key={interest.id} interest={interest} loading={processingId === interest.id} onShare={() => shareContact(interest.id)} />
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "tickets" ? (
            <section className="panel-surface mt-6 p-6 md:p-8">
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Support queue</h2>
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
                            {status.replace("_", " ")}
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
              <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Safety reports</h2>
              <div className="mt-5 space-y-3">
                {data.reports.map((report) => (
                  <div key={report.id} className="panel-muted p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-slate-900">{report.reason.replaceAll("_", " ")}</h3>
                          <StatusBadge label={report.status.toLowerCase()} tone={getReportTone(report.status)} />
                        </div>
                        <p className="mt-1.5 text-sm text-slate-500">
                          Reporter: {report.reporterName}
                          {report.reportedName ? ` \u00B7 Reported: ${report.reportedName}` : ""}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Ref: {report.reportedProfileReference}</p>
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
                            {status.replace("_", " ")}
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
          title={
            memberPendingDelete
              ? `Delete ${memberPendingDelete.fullName}?`
              : "Delete member?"
          }
          description="This will permanently remove the member account, profile data, and related records. This action cannot be undone."
          confirmLabel="Delete member"
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
  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-2">
      <div className="panel-surface p-6 md:p-8">
        <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Profiles awaiting action</h2>
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
                  <div className="mt-0.5 text-xs text-slate-500">{member.city} &middot; {member.occupation}</div>
                </div>
                <StatusBadge label="pending" tone="warning" />
              </div>
            ))}
          {data.users.every((member) => member.profileStatus !== "PENDING") ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center text-sm text-slate-400">
              No member profiles are waiting for moderation right now.
            </div>
          ) : null}
        </div>
      </div>

      <div className="panel-surface p-6 md:p-8">
        <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Interest requests awaiting release</h2>
        <div className="mt-4 space-y-2.5">
          {data.interests
            .filter((interest) => interest.status === "ACCEPTED")
            .slice(0, 5)
            .map((interest) => (
              <div key={interest.id} className="panel-muted px-4 py-3.5">
                <div className="text-sm font-medium text-slate-900">{interest.fromUser.name} to {interest.toUser.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">Recipient accepted. Contact details can now be released.</div>
              </div>
            ))}
          {data.interests.every((interest) => interest.status !== "ACCEPTED") ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-7 text-center text-sm text-slate-400">
              No accepted interest requests are waiting for contact release.
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
  return (
    <div className="panel-muted p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-slate-900">{member.fullName}</h3>
            <StatusBadge label={member.profileStatus.toLowerCase()} tone={getProfileTone(member.profileStatus)} />
            <StatusBadge label={member.accountStatus.toLowerCase()} tone={member.accountStatus === "ACTIVE" ? "success" : "danger"} />
          </div>
          <p className="mt-1.5 text-sm text-slate-500">{member.email} &middot; {member.city} &middot; {member.occupation}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onView} disabled={loading} className="btn-secondary px-3 py-2 text-xs">
            View Profile
          </button>
          <button
            onClick={onApprove}
            disabled={loading || member.profileStatus === "APPROVED"}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Approve
          </button>
          <button
            onClick={onReject}
            disabled={loading || member.profileStatus === "REJECTED"}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-900 disabled:opacity-60"
          >
            <UserX className="h-3.5 w-3.5" />
            Reject
          </button>
          <button onClick={onBlock} disabled={loading} className="btn-ghost px-3 py-2 text-xs">
            {member.accountStatus === "BLOCKED" ? "Activate" : "Block"}
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
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
  return (
    <div className="panel-muted p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-slate-900">{interest.fromUser.name} to {interest.toUser.name}</h3>
            <StatusBadge label={interest.status.toLowerCase()} tone={getInterestTone(interest.status)} />
          </div>
          <p className="mt-1.5 text-sm text-slate-500">Sender: {interest.fromUser.email} &middot; Recipient: {interest.toUser.email}</p>
        </div>
        <button
          onClick={onShare}
          disabled={interest.status !== "ACCEPTED" || loading}
          className="btn-primary flex-shrink-0 px-4 py-2.5 text-xs"
        >
          Release Contact Details
        </button>
      </div>
    </div>
  );
}
