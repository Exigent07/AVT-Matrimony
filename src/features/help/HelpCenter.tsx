"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  InputControl,
  SelectControl,
  TextareaControl,
} from "@/components/shared/FormControls";
import { PageTransition } from "@/components/shared/PageTransition";
import { requestJson } from "@/lib/client-request";
import { SITE_CONFIG } from "@/lib/site-config";
import { useLanguage } from "@/providers/LanguageProvider";
import { translateUiTerm } from "@/lib/translate-display";
import type { SessionViewer } from "@/types/domain";

type HelpTab = "faq" | "contact" | "report";

interface HelpCenterProps {
  initialName?: string;
  initialEmail?: string;
  initialTab?: HelpTab;
  initialProfileId?: string;
  initialSubject?: string;
  viewer?: SessionViewer | null;
}

export function HelpCenter({
  initialName = "",
  initialEmail = "",
  initialTab = "faq",
  initialProfileId = "",
  initialSubject = "",
  viewer,
}: HelpCenterProps) {
  const { language } = useLanguage();
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
  const faqs = language === "ta"
    ? [
        {
          question: "சுயவிவர அங்கீகாரம் எப்படி செயல்படுகிறது?",
          answer: "புதிய உறுப்பினர் சுயவிவரங்களும் முக்கிய திருத்தங்களும் பரிசீலனை வரிசைக்கு செல்கின்றன, இதனால் உறுப்பினர் பட்டியல் நம்பகமாகவும் ஒழுங்காகவும் இருக்கும்.",
        },
        {
          question: "தொடர்பு விவரங்கள் எப்போது பகிரப்படும்?",
          answer: "பெறுநர் ஆர்வக் கோரிக்கையை ஏற்றுக்கொண்ட பின் மற்றும் நிர்வாகி பகிர்ந்த பின் மட்டுமே தொடர்பு விவரங்கள் வெளியிடப்படும்.",
        },
        {
          question: "எப்படி சிறந்த பதில்களைப் பெறலாம்?",
          answer: "உங்கள் சுயவிவரத்தை முழுமையாக்கி, சிந்தனைமிக்க சுயவிவர சுருக்கத்தைச் சேர்த்து, பொருத்தமான விருப்பங்களைத் தேர்ந்தெடுத்து, இடம், கல்வி, குடும்ப விவரங்களை புதுப்பித்துக் கொள்ளுங்கள்.",
        },
        {
          question: "ஒரு சுயவிவரம் சந்தேகமாகத் தெரிந்தால் என்ன செய்ய வேண்டும்?",
          answer: "இந்தப் பக்கத்தில் உள்ள புகார் படிவத்தைப் பயன்படுத்துங்கள். புகார்கள் நிர்வாகி பரிசீலனை வரிசைக்கு செல்கின்றன மற்றும் நிர்வாகி பலகையில் கண்காணிக்கப்படலாம்.",
        },
      ]
    : [
        {
          question: "How do profile approvals work?",
          answer: "New member profiles and major profile edits go into a review queue so the member directory stays trustworthy and consistent.",
        },
        {
          question: "When are contact details shared?",
          answer: "Contact details are only released after an interest request is accepted by the recipient and then shared by an administrator.",
        },
        {
          question: "How do I improve response quality?",
          answer: "Complete your profile, add a thoughtful profile summary, select relevant interests, and keep your location, education, and family details current.",
        },
        {
          question: "What should I do if a profile looks suspicious?",
          answer: "Use the report form on this page. Reports go to the administrator review queue and can be tracked internally from the admin dashboard.",
        },
      ];

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
      toast.success(language === "ta" ? "உங்கள் ஆதரவு கோரிக்கை சமர்ப்பிக்கப்பட்டது." : "Your support request has been submitted.");
      setContactForm({ name: initialName, email: initialEmail, subject: initialSubject, message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : language === "ta" ? "உங்கள் செய்தியை சமர்ப்பிக்க முடியவில்லை." : "Unable to submit your message.");
    } finally {
      setIsSubmittingContact(false);
    }
  }

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingReport(true);
    try {
      await requestJson("/api/reports", { method: "POST", body: JSON.stringify(reportForm) });
      toast.success(language === "ta" ? "உங்கள் புகார் பரிசீலனைக்காக சமர்ப்பிக்கப்பட்டது." : "Your report has been submitted for review.");
      setReportForm({ profileId: initialProfileId, reason: "FAKE_PROFILE", details: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : language === "ta" ? "உங்கள் புகாரை சமர்ப்பிக்க முடியவில்லை." : "Unable to submit your report.");
    } finally {
      setIsSubmittingReport(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader
          mode="public"
          activeLink="help"
          viewer={viewer}
        />

        <div className="section-shell-narrow section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">{language === "ta" ? "உதவி மற்றும் பாதுகாப்பு" : "Help and safety"}</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              {language === "ta" ? "ஆதரவு மையம்" : "Support center"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              {language === "ta" ? "ஒரே இடத்தில் பதில்கள் பெறவும், ஆதரவைத் தொடர்புகொள்ளவும், அல்லது சந்தேகமான உறுப்பினர் சுயவிவரத்தைப் புகார் செய்யவும்." : "Get answers, contact support, or report a suspicious member profile from one place."}
            </p>

            <div className="toolbar-surface mt-7 inline-flex flex-wrap gap-1 p-1">
              {[
                { id: "faq" as const, label: language === "ta" ? "அடிக்கடி கேட்கப்படும் கேள்விகள்" : "FAQ" },
                { id: "contact" as const, label: language === "ta" ? "ஆதரவை தொடர்புகொள்ளவும்" : "Contact Support" },
                { id: "report" as const, label: language === "ta" ? "சுயவிவரத்தை புகார் செய்யவும்" : "Report a Profile" },
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
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  {language === "ta" ? "ஆதரவு கோரிக்கையை அனுப்பவும்" : "Send a support request"}
                </h2>
                <form onSubmit={submitContact} className="mt-5 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label={language === "ta" ? "உங்கள் பெயர்" : "Your name"}>
                      <InputControl value={contactForm.name} onChange={(event) => setContactForm((c) => ({ ...c, name: event.target.value }))} required />
                    </Field>
                    <Field label={language === "ta" ? "மின்னஞ்சல் முகவரி" : "Email address"}>
                      <InputControl type="email" value={contactForm.email} onChange={(event) => setContactForm((c) => ({ ...c, email: event.target.value }))} required />
                    </Field>
                  </div>
                  <Field label={language === "ta" ? "தலைப்பு" : "Subject"}>
                    <InputControl value={contactForm.subject} onChange={(event) => setContactForm((c) => ({ ...c, subject: event.target.value }))} required />
                  </Field>
                  <Field label={language === "ta" ? "செய்தி" : "Message"}>
                    <TextareaControl value={contactForm.message} onChange={(event) => setContactForm((c) => ({ ...c, message: event.target.value }))} required />
                  </Field>
                  <button type="submit" disabled={isSubmittingContact} className="btn-primary">
                    {isSubmittingContact ? (language === "ta" ? "சமர்ப்பிக்கிறது" : "Submitting") : language === "ta" ? "கோரிக்கையை சமர்ப்பி" : "Submit request"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <SupportCard icon={Mail} title={language === "ta" ? "மின்னஞ்சல்" : "Email"} value={SITE_CONFIG.supportEmail} description={language === "ta" ? "கணக்கு, பரிசீலனை, மற்றும் சுயவிவர மதிப்பாய்வு கேள்விகளுக்கு சிறந்தது." : "Best for account, moderation, and profile review queries."} />
                <SupportCard icon={Phone} title={language === "ta" ? "தொலைபேசி" : "Phone"} value={SITE_CONFIG.supportPhone} description={language === "ta" ? "சாதாரண ஆதரவு நேரங்களில் கிடைக்கும்." : "Available during standard support hours."} />
                <SupportCard
                  icon={MessageSquare}
                  title={language === "ta" ? "ஆதரவு நேரம்" : "Support hours"}
                  value={language === "ta" ? "திங்கள் - சனி, காலை 9:00 முதல் மாலை 6:00 வரை" : SITE_CONFIG.supportHours}
                  description={language === "ta" ? "சமர்ப்பிக்கப்பட்ட ஆதரவு கோரிக்கைகளுக்கு பொதுவாக ஒரு வேலைநாளுக்குள் பதிலளிக்கிறோம்." : "We typically reply to submitted support tickets within one business day."}
                />
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
                  <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                    {language === "ta" ? "சுயவிவரத்தை புகார் செய்யவும்" : "Report a profile"}
                  </h2>
                  <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-500">
                    {language === "ta" ? "புகார்கள் நேரடியாக பரிசீலனை வரிசைக்கு செல்கின்றன. நீங்கள் புகார் செய்யும் பக்கத்தில் காட்டப்பட்டுள்ள சுயவிவர அல்லது உறுப்பினர் குறிப்பை சேர்க்கவும்." : "Reports go directly into the moderation queue for review. Include the profile or member reference shown on the page you are reporting."}
                  </p>
                </div>
              </div>

              <form onSubmit={submitReport} className="mt-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={language === "ta" ? "சுயவிவர அல்லது உறுப்பினர் ஐடி" : "Profile or member ID"}>
                    <InputControl value={reportForm.profileId} onChange={(event) => setReportForm((c) => ({ ...c, profileId: event.target.value }))} required />
                  </Field>
                  <Field label={language === "ta" ? "காரணம்" : "Reason"}>
                    <SelectControl value={reportForm.reason} onChange={(event) => setReportForm((c) => ({ ...c, reason: event.target.value }))}>
                      <option value="FAKE_PROFILE">{language === "ta" ? "போலி சுயவிவரம் அல்லது தவறான தகவல்" : "Fake profile or false information"}</option>
                      <option value="INAPPROPRIATE_BEHAVIOR">{language === "ta" ? "ஒழுங்கற்ற நடத்தை" : "Inappropriate behaviour"}</option>
                      <option value="HARASSMENT">{translateUiTerm("harassment", language)}</option>
                      <option value="SCAM">{translateUiTerm("scam", language)}</option>
                      <option value="OTHER">{language === "ta" ? "வேறு கவலை" : "Other concern"}</option>
                    </SelectControl>
                  </Field>
                </div>
                <Field label={language === "ta" ? "கூடுதல் விவரங்கள்" : "Additional details"}>
                  <TextareaControl value={reportForm.details} onChange={(event) => setReportForm((c) => ({ ...c, details: event.target.value }))} required />
                </Field>
                <button type="submit" disabled={isSubmittingReport} className="btn-primary">
                  {isSubmittingReport ? (language === "ta" ? "சமர்ப்பிக்கிறது" : "Submitting") : language === "ta" ? "புகாரை சமர்ப்பி" : "Submit report"}
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
