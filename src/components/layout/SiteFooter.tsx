"use client";

import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { Logo } from "@/components/shared/Logo";

interface SiteFooterProps {
  variant?: "gradient" | "solid";
}

export function SiteFooter({ variant = "solid" }: SiteFooterProps) {
  const { t, language } = useLanguage();
  const copy =
    language === "ta"
      ? {
          trustLabel: "நம்பகமான தமிழ் திருமண சேவை",
          description:
            "நம்பிக்கை, பாரம்பரியம், மற்றும் சரிபார்க்கப்பட்ட சுயவிவரங்களின் மூலம் தமிழ் குடும்பங்களை நீண்டகால உறவுகளுக்காக இணைக்கும் கவனமான தளம்.",
          ctaRegisterTitle: "சுயவிவரம் உருவாக்கவும்",
          ctaRegisterDescription: "சரிபார்க்கப்பட்ட உங்கள் பயணத்தை தொடங்குங்கள்",
          ctaHowTitle: "எப்படி செயல்படுகிறது",
          ctaHowDescription: "உறுப்பினர் பயணத்தை தெளிவாகப் பாருங்கள்",
          ctaSupportTitle: "உதவி பெறுங்கள்",
          ctaSupportDescription: "உதவி, பாதுகாப்பு, மற்றும் வழிகாட்டல்",
          platform: "தளம்",
          platformDescription:
            "இருமொழி ஆதரவு, சரிபார்க்கப்பட்ட சுயவிவரங்கள், மற்றும் திருமணத்திற்கான மரியாதையான இணைப்புகளுடன் குடும்பமைய பொருத்தம்.",
          memberSignIn: "உறுப்பினர் உள்நுழைவு",
          createProfile: "சுயவிவரம் உருவாக்கவும்",
          closing: "சரிபார்க்கப்பட்ட சுயவிவரங்கள். மரியாதையான அறிமுகங்கள். குடும்ப மையப்படுத்தப்பட்ட ஆதரவு.",
        }
      : {
          trustLabel: "Trusted Tamil Matrimony",
          description:
            "Connecting Tamil families with trust, tradition, and verified profiles through a thoughtfully moderated experience designed for long-term commitment.",
          ctaRegisterTitle: "Create your profile",
          ctaRegisterDescription: "Start your verified journey",
          ctaHowTitle: "How it works",
          ctaHowDescription: "See the member journey clearly",
          ctaSupportTitle: "Get support",
          ctaSupportDescription: "Help, safety, and guidance",
          platform: "Platform",
          platformDescription:
            "Family-first matchmaking with bilingual support, verified profiles, and intentional connections built for marriage, not browsing.",
          memberSignIn: "Member Sign In",
          createProfile: "Create Profile",
          closing: "Verified profiles. Respectful introductions. Family-centered support.",
        };

  return (
    <footer
      className={
        variant === "gradient"
          ? "bg-linear-to-b from-[#191919] via-[#161616] to-[#121212] text-white"
          : "bg-[#161616] text-white"
      }
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="py-10 md:py-14">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B91C1C]" />
                  {copy.trustLabel}
                </span>
                <div className="mt-4">
                  <Logo size="medium" siteName={t("site.name")} tagline={t("site.tagline")} />
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
                  {copy.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Link
                  href="/register"
                  className="flex items-center justify-between rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-left transition-all hover:bg-white/[0.07]"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{copy.ctaRegisterTitle}</div>
                    <div className="mt-1 text-xs text-gray-400">{copy.ctaRegisterDescription}</div>
                  </div>
                  <span className="text-[#B91C1C]">01</span>
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center justify-between rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-left transition-all hover:bg-white/[0.07]"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{copy.ctaHowTitle}</div>
                    <div className="mt-1 text-xs text-gray-400">{copy.ctaHowDescription}</div>
                  </div>
                  <span className="text-[#B91C1C]">02</span>
                </Link>
                <Link
                  href="/help"
                  className="flex items-center justify-between rounded-[1.5rem] border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-left transition-all hover:bg-white/[0.07]"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{copy.ctaSupportTitle}</div>
                    <div className="mt-1 text-xs text-gray-400">{copy.ctaSupportDescription}</div>
                  </div>
                  <span className="text-[#B91C1C]">03</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.06] py-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {copy.platform}
            </h4>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              {copy.platformDescription}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              <FooterLink href="/" label={t("common.home")} />
              <FooterLink href="/login" label={copy.memberSignIn} />
              <FooterLink href="/register" label={copy.createProfile} />
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {t("footer.about.us")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href="/about" label={t("footer.about.av")} />
              <FooterLink href="/how-it-works" label={t("header.how.it.works")} />
              <FooterLink href="/stories" label={t("header.success.stories")} />
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {t("footer.services")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href="/register" label={t("common.register")} />
              <FooterLink href="/search" label={t("footer.search.profiles")} />
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {t("footer.support")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href="/help" label={t("footer.help.center")} />
              <FooterLink href="/help?tab=contact" label={t("footer.contact.us")} />
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {t("footer.legal")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              <FooterLink href="/privacy" label={t("footer.privacy")} />
              <FooterLink href="/terms" label={t("footer.terms")} />
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <div className="text-xs text-gray-500">{t("footer.copyright")}</div>
          <div className="text-xs text-gray-600">{copy.closing}</div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-300"
      >
        {label}
      </Link>
    </li>
  );
}
