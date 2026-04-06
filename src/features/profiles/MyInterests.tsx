"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Heart, Phone, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { MemberResumeTracker } from "@/components/shared/MemberResumeTracker";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
import type { MemberResumeEntry } from "@/lib/member-resume";
import { translateDisplayValue } from "@/lib/translate-display";
import { useLanguage } from "@/providers/LanguageProvider";
import type { InterestItem, SessionViewer } from "@/types/domain";

interface MyInterestsProps {
  viewer: SessionViewer;
  interests: InterestItem[];
}

export function MyInterests({ viewer, interests }: MyInterestsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"sent" | "received">(
    requestedTab === "received" ? "received" : "sent",
  );
  const [processingId, setProcessingId] = useState<string | null>(null);

  const sentInterests = interests.filter((interest) => interest.direction === "sent");
  const receivedInterests = interests.filter((interest) => interest.direction === "received");
  const sharedContacts = interests.filter((interest) => interest.status === "CONTACT_SHARED");
  const resumeEntry = useMemo<MemberResumeEntry>(
    () => ({
      href: `/interests?tab=${activeTab}`,
      icon: "heart",
      title:
        activeTab === "received"
          ? {
              en: "Received interests",
              ta: "பெற்ற ஆர்வங்கள்",
            }
          : {
              en: "Sent interests",
              ta: "அனுப்பிய ஆர்வங்கள்",
            },
      detail:
        activeTab === "received"
          ? {
              en: `${receivedInterests.length} received, ${sharedContacts.length} contacts shared`,
              ta: `${receivedInterests.length} பெறப்பட்டது, ${sharedContacts.length} தொடர்புகள் பகிரப்பட்டது`,
            }
          : {
              en: `${sentInterests.length} sent requests in progress`,
              ta: `${sentInterests.length} அனுப்பிய கோரிக்கைகள் நடைமுறையில் உள்ளன`,
            },
      updatedAt: new Date().toISOString(),
    }),
    [activeTab, receivedInterests.length, sentInterests.length, sharedContacts.length],
  );

  useEffect(() => {
    if (requestedTab === "received" || requestedTab === "sent") {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  async function handleAction(interestId: string, action: "accept" | "decline" | "withdraw") {
    setProcessingId(interestId);

    try {
      await requestJson("/api/interests", {
        method: "PATCH",
        body: JSON.stringify({ interestId, action }),
      });
      toast.success(
        action === "accept"
          ? language === "ta" ? "ஆர்வம் ஏற்கப்பட்டது." : "Interest accepted."
          : action === "decline"
            ? language === "ta" ? "ஆர்வம் நிராகரிக்கப்பட்டது." : "Interest declined."
            : language === "ta" ? "ஆர்வம் திரும்பப் பெறப்பட்டது." : "Interest withdrawn.",
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : language === "ta" ? "ஆர்வக் கோரிக்கையை புதுப்பிக்க முடியவில்லை." : "Unable to update interest request.");
    } finally {
      setProcessingId(null);
    }
  }

  const currentList = activeTab === "sent" ? sentInterests : receivedInterests;

  return (
    <PageTransition>
      <div className="page-shell">
        <MemberResumeTracker viewerId={viewer.id} entry={resumeEntry} />
        <AppHeader mode="member" activeLink="interests" viewer={viewer} />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">{language === "ta" ? "இணைப்பு நடைமுறை" : "Connection workflow"}</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              {language === "ta" ? "எனது ஆர்வங்கள்" : "My interests"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              {language === "ta"
                ? "வரும் மற்றும் செல்லும் ஆர்வக் கோரிக்கைகளை கண்காணித்து, நிர்வாகி வெளியிட்டபின் பகிரப்பட்ட தொடர்பு விவரங்களைப் பார்வையிடுங்கள்."
                : "Track incoming and outgoing interest requests, then review shared contact details once the administrator releases them."}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Metric title={language === "ta" ? "அனுப்பியது" : "Sent"} value={sentInterests.length} />
              <Metric title={language === "ta" ? "பெற்றது" : "Received"} value={receivedInterests.length} />
              <Metric title={language === "ta" ? "பகிரப்பட்ட தொடர்புகள்" : "Contacts shared"} value={sharedContacts.length} />
            </div>
          </section>

          <section className="panel-surface mt-6 p-6 md:p-8">
            <div className="tab-shelf">
              <button
                onClick={() => setActiveTab("sent")}
                className="tab-chip"
                data-active={activeTab === "sent"}
              >
                {language === "ta" ? `அனுப்பியது (${sentInterests.length})` : `Sent (${sentInterests.length})`}
              </button>
              <button
                onClick={() => setActiveTab("received")}
                className="tab-chip"
                data-active={activeTab === "received"}
              >
                {language === "ta" ? `பெற்றது (${receivedInterests.length})` : `Received (${receivedInterests.length})`}
              </button>
            </div>

            <div className="mt-6">
              {currentList.length === 0 ? (
                <EmptyState
                  title={activeTab === "sent"
                    ? language === "ta" ? "இன்னும் அனுப்பிய ஆர்வங்கள் இல்லை" : "No sent interests yet"
                    : language === "ta" ? "இன்னும் பெற்ற ஆர்வங்கள் இல்லை" : "No received interests yet"}
                  description={
                    activeTab === "sent"
                      ? language === "ta" ? "சரிபார்க்கப்பட்ட உறுப்பினர் சுயவிவரங்களைப் பார்வையிட்டு உங்கள் முதல் ஆர்வக் கோரிக்கையை அனுப்புங்கள்." : "Browse verified member profiles and send your first interest request."
                      : language === "ta" ? "மற்றொரு சரிபார்க்கப்பட்ட உறுப்பினர் தொடர்புகொண்டதும் வரவான கோரிக்கைகள் இங்கே தோன்றும்." : "Incoming requests will appear here once another verified member reaches out."
                  }
                  icon={Heart}
                  action={
                    activeTab === "sent" ? (
                      <button
                        onClick={() => router.push("/search")}
                        className="btn-primary"
                      >
                        {language === "ta" ? "சுயவிவரங்கள் தேடவும்" : "Search Profiles"}
                      </button>
                    ) : undefined
                  }
                />
              ) : (
                <div className="space-y-3">
                  {currentList.map((interest) => (
                    <div
                      key={interest.id}
                      className="panel-muted rounded-[1.4rem] p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
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
                          <p className="mt-1.5 text-sm text-slate-500">
                            {interest.counterpart.age} {language === "ta" ? "வயது" : "yrs"} &middot;{" "}
                            {translateDisplayValue(interest.counterpart.city, language)} &middot;{" "}
                            {translateDisplayValue(interest.counterpart.occupation, language)}
                          </p>
                          {interest.contactDetails ? (
                            <div className="mt-3.5 flex flex-wrap gap-2">
                              <span className="contact-chip">
                                <Phone className="h-3.5 w-3.5" />
                                {interest.contactDetails.phone ?? (language === "ta" ? "தொலைபேசி இல்லை" : "No phone")}
                              </span>
                              <span className="contact-chip">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {interest.contactDetails.email ?? (language === "ta" ? "மின்னஞ்சல் இல்லை" : "No email")}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-shrink-0 flex-wrap gap-2">
                          <button
                            onClick={() => router.push(`/profile/${interest.counterpart.userId}`)}
                            className="btn-secondary px-3 py-2 text-xs"
                          >
                            {language === "ta" ? "சுயவிவரத்தை காண்க" : "View Profile"}
                          </button>

                          {interest.direction === "received" && interest.status === "PENDING" ? (
                            <>
                              <button
                                onClick={() => handleAction(interest.id, "accept")}
                                disabled={processingId === interest.id}
                                className="btn-success px-3 py-2 text-xs"
                              >
                                {language === "ta" ? "ஏற்கவும்" : "Accept"}
                              </button>
                              <button
                                onClick={() => handleAction(interest.id, "decline")}
                                disabled={processingId === interest.id}
                                className="btn-caution px-3 py-2 text-xs"
                              >
                                {language === "ta" ? "நிராகரி" : "Decline"}
                              </button>
                            </>
                          ) : null}

                          {interest.direction === "sent" && interest.status === "PENDING" ? (
                            <button
                              onClick={() => handleAction(interest.id, "withdraw")}
                              disabled={processingId === interest.id}
                              className="btn-caution px-3 py-2 text-xs"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>{language === "ta" ? "திரும்பப் பெறு" : "Withdraw"}</span>
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
    <div className="stat-surface elevated-card px-4 py-3.5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">{title}</div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
    </div>
  );
}
