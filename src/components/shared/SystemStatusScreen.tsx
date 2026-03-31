"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Compass, LifeBuoy, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useLanguage } from "@/providers/LanguageProvider";

interface SystemStatusTip {
  title: string;
  description: string;
}

interface SystemStatusScreenProps {
  code: string;
  label: string;
  title: string;
  description: string;
  tone?: "missing" | "error";
  actions?: ReactNode;
  detail?: ReactNode;
  tips: SystemStatusTip[];
}

export function SystemStatusScreen({
  code,
  label,
  title,
  description,
  tone = "missing",
  actions,
  detail,
  tips,
}: SystemStatusScreenProps) {
  const { language } = useLanguage();
  const AccentIcon = tone === "error" ? ShieldAlert : Compass;
  const sectionLabel =
    tone === "error"
      ? language === "ta"
        ? "எதிர்பாராத தடை"
        : "Unexpected interruption"
      : language === "ta"
        ? "பக்கம் கிடைக்கவில்லை"
        : "Page not available";
  const supportReferenceLabel =
    language === "ta" ? "ஆதரவு குறிப்பு" : "Support reference";
  const whatThisMeansLabel =
    language === "ta" ? "இதன் பொருள்" : "What this means";
  const needHelpLabel = language === "ta" ? "உதவி வேண்டுமா?" : "Need help?";
  const meaningDescription =
    tone === "error"
      ? language === "ta"
        ? "கோரிக்கை எங்களை அடைந்தது, ஆனால் இந்தப் பக்கம் சரியாக காட்டப்படுவதில் ஏதோ தடையாக இருந்தது."
        : "The request reached us, but something prevented this page from rendering properly."
      : language === "ta"
        ? "இலக்கு மாற்றப்பட்டிருக்கலாம், இணைப்பு பழமையானதாக இருக்கலாம், அல்லது சுயவிவரம் இனி கிடைக்காமல் இருக்கலாம்."
        : "The destination may have moved, the link may be outdated, or the profile may no longer be available.";
  const helpDescription =
    language === "ta"
      ? "இது தொடர்ந்து நடந்தால், சரியான இடத்திற்குத் திரும்புவதற்கான வேகமான வழி எங்கள் ஆதரவு பக்கத்தில் உள்ளது."
      : "If this keeps happening, our support page has the quickest path back to the right place.";

  return (
    <div className="page-shell">
      <div className="section-shell flex min-h-screen items-center py-8 md:py-10">
        <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(19rem,0.78fr)]">
          <section className="hero-surface relative p-6 md:p-8 lg:p-10">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#B91C1C]/[0.07] blur-3xl" />
            <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-[#B91C1C]/[0.05] blur-3xl" />

            <div className="relative flex h-full flex-col">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
                  <Logo
                    size="medium"
                    showText={false}
                    showTagline={false}
                    siteName="AV Tamil Matrimony"
                    tagline="திருமண சேவை"
                  />
                </Link>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#B91C1C]/12 bg-[#B91C1C]/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B91C1C]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B91C1C]" />
                  {label}
                </span>
              </div>

              <div className="mt-10 max-w-2xl">
                <div className="section-label">{sectionLabel}</div>
                <h1
                  className="mt-4 text-4xl text-slate-900 md:text-5xl lg:text-[4rem]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                  {description}
                </p>
              </div>

              {actions ? (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
              ) : null}

              {detail ? (
                <div className="panel-muted mt-8 max-w-2xl px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {supportReferenceLabel}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</div>
                </div>
              ) : null}

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <div className="panel-muted px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {whatThisMeansLabel}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">
                    {meaningDescription}
                  </div>
                </div>
                <div className="panel-muted px-4 py-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <LifeBuoy className="h-3.5 w-3.5 text-[#B91C1C]" />
                    {needHelpLabel}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">
                    {helpDescription}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="panel-surface p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="section-label">Status code</div>
                <div
                  className="mt-3 text-6xl text-slate-900 md:text-7xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {code}
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#B91C1C]/[0.07] text-[#B91C1C] shadow-[0_18px_34px_rgba(185,28,28,0.1)]">
                <AccentIcon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {tips.map((tip) => (
                <div key={tip.title} className="panel-muted px-4 py-4">
                  <div className="text-sm font-semibold text-slate-900">{tip.title}</div>
                  <div className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {tip.description}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
