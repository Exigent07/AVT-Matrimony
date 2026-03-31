"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { requestJson } from "@/lib/client-request";
import { SITE_CONFIG } from "@/lib/site-config";
import type { SessionViewer } from "@/types/domain";

type HelpTab = "faq" | "contact" | "report";

const faqs = [
  {
    question: "How do profile approvals work?",
    answer:
      "New member profiles and major profile edits go into a review queue so the member directory stays trustworthy and consistent.",
  },
  {
    question: "When are contact details shared?",
    answer:
      "Contact details are only released after an interest request is accepted by the recipient and then shared by an administrator.",
  },
  {
    question: "How do I improve response quality?",
    answer:
      "Complete your profile, add a thoughtful profile summary, select relevant interests, and keep your location, education, and family details current.",
  },
  {
    question: "What should I do if a profile looks suspicious?",
    answer:
      "Use the report form on this page. Reports go to the administrator review queue and can be tracked internally from the admin dashboard.",
  },
];

interface HelpCenterProps {
  initialName?: string;
  initialEmail?: string;
  initialTab?: HelpTab;
  initialProfileId?: string;
  initialSubject?: string;
  backTo?: string;
  backLabel?: string;
  viewer?: SessionViewer | null;
}

export function HelpCenter({
  initialName = "",
  initialEmail = "",
  initialTab = "faq",
  initialProfileId = "",
  initialSubject = "",
  backTo = "/",
  backLabel = "Home",
  viewer,
}: HelpCenterProps) {
  const [activeTab, setActiveTab] = useState<HelpTab>(initialTab);
  const [contactForm, setContactForm] = useState({
    name: initialName,
    email: initialEmail,
    subject: initialSubject,
    message: "",
  });
  const [reportForm, setReportForm] = useState({
    profileId: initialProfileId,
    reason: "FAKE_PROFILE",
    details: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setContactForm((current) => ({
      ...current,
      name: initialName,
      email: initialEmail,
      subject: current.subject || initialSubject,
    }));
  }, [initialEmail, initialName, initialSubject]);

  useEffect(() => {
    if (!initialProfileId) return;
    setReportForm((current) => ({
      ...current,
      profileId: current.profileId || initialProfileId,
    }));
  }, [initialProfileId]);

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingContact(true);
    try {
      await requestJson("/api/support/tickets", { method: "POST", body: JSON.stringify(contactForm) });
      toast.success("Your support request has been submitted.");
      setContactForm({ name: initialName, email: initialEmail, subject: initialSubject, message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit your message.");
    } finally {
      setIsSubmittingContact(false);
    }
  }

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingReport(true);
    try {
      await requestJson("/api/reports", { method: "POST", body: JSON.stringify(reportForm) });
      toast.success("Your report has been submitted for review.");
      setReportForm({ profileId: initialProfileId, reason: "FAKE_PROFILE", details: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit your report.");
    } finally {
      setIsSubmittingReport(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell">
        <AuthHeader viewer={viewer} backTo={backTo} backLabel={backLabel} />

        <div className="section-shell-narrow section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">Help and safety</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Support center</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Get answers, contact support, or report a suspicious member profile from one place.
            </p>

            <div className="toolbar-surface mt-7 inline-flex flex-wrap gap-1 p-1">
              {[
                { id: "faq" as const, label: "FAQ" },
                { id: "contact" as const, label: "Contact Support" },
                { id: "report" as const, label: "Report a Profile" },
              ].map((tab) => (
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

          {activeTab === "faq" ? (
            <section className="mt-6 grid gap-3">
              {faqs.map((faq) => (
                <article key={faq.question} className="panel-surface p-5 md:p-6">
                  <h2 className="text-xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{faq.question}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{faq.answer}</p>
                </article>
              ))}
            </section>
          ) : null}

          {activeTab === "contact" ? (
            <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="panel-surface p-6 md:p-8">
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Send a support request</h2>
                <form onSubmit={submitContact} className="mt-5 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Your name">
                      <input value={contactForm.name} onChange={(event) => setContactForm((c) => ({ ...c, name: event.target.value }))} className="input-field" required />
                    </Field>
                    <Field label="Email address">
                      <input type="email" value={contactForm.email} onChange={(event) => setContactForm((c) => ({ ...c, email: event.target.value }))} className="input-field" required />
                    </Field>
                  </div>
                  <Field label="Subject">
                    <input value={contactForm.subject} onChange={(event) => setContactForm((c) => ({ ...c, subject: event.target.value }))} className="input-field" required />
                  </Field>
                  <Field label="Message">
                    <textarea value={contactForm.message} onChange={(event) => setContactForm((c) => ({ ...c, message: event.target.value }))} className="input-field min-h-32" required />
                  </Field>
                  <button type="submit" disabled={isSubmittingContact} className="btn-primary">
                    {isSubmittingContact ? "Submitting" : "Submit request"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <SupportCard icon={Mail} title="Email" value={SITE_CONFIG.supportEmail} description="Best for account, moderation, and profile review queries." />
                <SupportCard icon={Phone} title="Phone" value={SITE_CONFIG.supportPhone} description="Available during standard support hours." />
                <SupportCard icon={MessageSquare} title="Support hours" value={SITE_CONFIG.supportHours} description="We typically reply to submitted support tickets within one business day." />
              </div>
            </section>
          ) : null}

          {activeTab === "report" ? (
            <section className="panel-surface mt-6 p-6 md:p-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Report a profile</h2>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-500">
                    Reports go directly into the moderation queue for review. Include the profile or member reference shown on the page you are reporting.
                  </p>
                </div>
              </div>

              <form onSubmit={submitReport} className="mt-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Profile or member ID">
                    <input value={reportForm.profileId} onChange={(event) => setReportForm((c) => ({ ...c, profileId: event.target.value }))} className="input-field" required />
                  </Field>
                  <Field label="Reason">
                    <select value={reportForm.reason} onChange={(event) => setReportForm((c) => ({ ...c, reason: event.target.value }))} className="input-field">
                      <option value="FAKE_PROFILE">Fake profile or false information</option>
                      <option value="INAPPROPRIATE_BEHAVIOR">Inappropriate behaviour</option>
                      <option value="HARASSMENT">Harassment</option>
                      <option value="SCAM">Suspected scam</option>
                      <option value="OTHER">Other concern</option>
                    </select>
                  </Field>
                </div>
                <Field label="Additional details">
                  <textarea value={reportForm.details} onChange={(event) => setReportForm((c) => ({ ...c, details: event.target.value }))} className="input-field min-h-32" required />
                </Field>
                <button type="submit" disabled={isSubmittingReport} className="btn-primary">
                  {isSubmittingReport ? "Submitting" : "Submit report"}
                </button>
              </form>
            </section>
          ) : null}
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-slate-600">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function SupportCard({ icon: Icon, title, value, description }: {
  icon: React.ComponentType<{ className?: string }>; title: string; value: string; description: string;
}) {
  return (
    <div className="panel-muted p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#B91C1C]/[0.06] text-[#B91C1C]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</div>
          <div className="mt-1 text-sm font-medium text-slate-800">{value}</div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
