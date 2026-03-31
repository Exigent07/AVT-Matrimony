"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Heart, Phone, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
import type { InterestItem, SessionViewer } from "@/types/domain";

interface MyInterestsProps {
  viewer: SessionViewer;
  interests: InterestItem[];
}

export function MyInterests({ viewer, interests }: MyInterestsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const sentInterests = interests.filter((interest) => interest.direction === "sent");
  const receivedInterests = interests.filter((interest) => interest.direction === "received");
  const sharedContacts = interests.filter((interest) => interest.status === "CONTACT_SHARED");

  async function handleAction(interestId: string, action: "accept" | "decline" | "withdraw") {
    setProcessingId(interestId);

    try {
      await requestJson("/api/interests", {
        method: "PATCH",
        body: JSON.stringify({ interestId, action }),
      });
      toast.success(
        action === "accept"
          ? "Interest accepted."
          : action === "decline"
            ? "Interest declined."
            : "Interest withdrawn.",
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update interest request.");
    } finally {
      setProcessingId(null);
    }
  }

  const currentList = activeTab === "sent" ? sentInterests : receivedInterests;

  return (
    <PageTransition>
      <div className="page-shell">
        <AuthHeader viewer={viewer} backTo="/dashboard" backLabel="Dashboard" />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">Connection workflow</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>My interests</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Track incoming and outgoing interest requests, then review shared contact details
              once the administrator releases them.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Metric title="Sent" value={sentInterests.length} />
              <Metric title="Received" value={receivedInterests.length} />
              <Metric title="Contacts shared" value={sharedContacts.length} />
            </div>
          </section>

          <section className="panel-surface mt-6 p-6 md:p-8">
            <div className="toolbar-surface inline-flex flex-wrap gap-1 p-1">
              <button
                onClick={() => setActiveTab("sent")}
                className="tab-chip"
                data-active={activeTab === "sent"}
              >
                Sent ({sentInterests.length})
              </button>
              <button
                onClick={() => setActiveTab("received")}
                className="tab-chip"
                data-active={activeTab === "received"}
              >
                Received ({receivedInterests.length})
              </button>
            </div>

            <div className="mt-6">
              {currentList.length === 0 ? (
                <EmptyState
                  title={activeTab === "sent" ? "No sent interests yet" : "No received interests yet"}
                  description={
                    activeTab === "sent"
                      ? "Browse verified member profiles and send your first interest request."
                      : "Incoming requests will appear here once another verified member reaches out."
                  }
                  icon={Heart}
                  action={
                    activeTab === "sent" ? (
                      <button
                        onClick={() => router.push("/search")}
                        className="btn-primary"
                      >
                        Search Profiles
                      </button>
                    ) : undefined
                  }
                />
              ) : (
                <div className="space-y-4">
                  {currentList.map((interest) => (
                    <div
                      key={interest.id}
                      className="panel-muted p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-base font-semibold text-slate-900">
                              {interest.counterpart.fullName}
                            </h2>
                            <StatusBadge
                              label={interest.status.replace("_", " ")}
                              tone={
                                interest.status === "CONTACT_SHARED"
                                  ? "success"
                                  : interest.status === "DECLINED"
                                    ? "danger"
                                    : "brand"
                              }
                            />
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {interest.counterpart.age} years • {interest.counterpart.city} •{" "}
                            {interest.counterpart.occupation}
                          </p>
                          {interest.contactDetails ? (
                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                                <Phone className="h-4 w-4 text-emerald-600" />
                                {interest.contactDetails.phone ?? "No phone"}
                              </span>
                              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                {interest.contactDetails.email ?? "No email"}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => router.push(`/profile/${interest.counterpart.userId}`)}
                            className="btn-secondary px-3 py-2 text-xs"
                          >
                            View Profile
                          </button>

                          {interest.direction === "received" && interest.status === "PENDING" ? (
                            <>
                              <button
                                onClick={() => handleAction(interest.id, "accept")}
                                disabled={processingId === interest.id}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleAction(interest.id, "decline")}
                                disabled={processingId === interest.id}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-900 disabled:opacity-60"
                              >
                                Decline
                              </button>
                            </>
                          ) : null}

                          {interest.direction === "sent" && interest.status === "PENDING" ? (
                            <button
                              onClick={() => handleAction(interest.id, "withdraw")}
                              disabled={processingId === interest.id}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-900 disabled:opacity-60"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Withdraw</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
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

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="stat-surface px-4 py-3.5">
      <div className="text-[13px] font-medium text-slate-500">{title}</div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
    </div>
  );
}
