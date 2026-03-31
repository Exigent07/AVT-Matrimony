"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AnimatedHeartIcon } from '@/components/shared/AnimatedHeartIcon';
import { PageTransition } from '@/components/shared/PageTransition';
import type { SessionViewer } from '@/types/domain';
import { useRouter } from 'next/navigation';
import { User, Search, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { motion } from 'motion/react';

interface HowItWorksProps {
  viewer?: SessionViewer | null;
}

export function HowItWorks({ viewer }: HowItWorksProps) {
  const router = useRouter();
  const { t, language } = useLanguage();

  const steps = [
    {
      number: 1,
      title: t('howitworks.step1.title'),
      icon: User,
      description: t('howitworks.step1.desc'),
      features: language === "ta"
        ? [
            'தனிப்பட்ட மற்றும் குடும்ப விவரங்களை நிரப்பவும்',
            'கல்வி மற்றும் தொழில் தகவல்களைச் சேர்க்கவும்',
            'இணைவர் விருப்பங்களை குறிப்பிடவும்',
            'புகைப்படங்களைப் பதிவேற்றவும் (விருப்பம்)',
          ]
        : [
            'Fill in personal and family details',
            'Add education and career information',
            'Specify partner preferences',
            'Upload photos (optional)',
          ],
    },
    {
      number: 2,
      title: t('howitworks.step2.title'),
      icon: Search,
      description: t('howitworks.step2.desc'),
      features: language === "ta"
        ? [
            'மேம்பட்ட வடிகட்டிகளைப் பயன்படுத்தவும் (வயது, இடம், சாதி போன்றவை)',
            'விரிவான சுயவிவரங்களைப் பார்க்கவும்',
            'பொருத்த மதிப்பெண்களைப் பார்க்கவும்',
            'பின்னர் பார்க்க சுயவிவரங்களைச் சேமிக்கவும்',
          ]
        : [
            'Use advanced filters (age, location, caste, etc.)',
            'View detailed profiles',
            'See compatibility scores',
            'Save profiles for later',
          ],
    },
    {
      number: 3,
      title: t('howitworks.step3.title'),
      icon: Heart,
      description: t('howitworks.step3.desc'),
      features: language === "ta"
        ? [
            'ஆர்வக் கோரிக்கைகளை அனுப்பவும் மற்றும் பெறவும்',
            'பொருந்திய சுயவிவரங்களுடன் உரையாடவும்',
            'தொடர்பு விவரங்களைப் பகிரவும்',
            'சந்திப்புகளை திட்டமிடவும்',
          ]
        : [
            'Send and receive interest requests',
            'Chat with matched profiles',
            'Share contact details',
            'Schedule meetings',
          ],
    },
    {
      number: 4,
      title: t('howitworks.step4.title'),
      icon: Sparkles,
      description: t('howitworks.step4.desc'),
      features: language === "ta"
        ? [
            'குடும்ப அறிமுகங்கள்',
            'நேரடி சந்திப்புகள்',
            'பாரம்பரிய பொருத்த ஆதரவு',
            'திருமண திட்டமிடல் வழிகாட்டுதல்',
          ]
        : [
            'Family introductions',
            'In-person meetings',
            'Traditional matchmaking support',
            'Wedding planning guidance',
          ],
    },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="public" activeLink="how-it-works" viewer={viewer} />

        <section className="section-shell section-block pt-4 md:pt-6">
          <div className="hero-surface p-6 text-center md:p-10 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-pill">{t("howitworks.badge")}</span>
              <h1 className="mt-5 text-4xl text-slate-900 md:text-5xl lg:text-[4rem]" style={{ fontFamily: "var(--font-display)" }}>
                {t("howitworks.title")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
                {t("howitworks.subtitle")}
              </p>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="panel-muted p-4 text-left">
                  <div className="section-label">
                    {language === "ta" ? `படி ${step.number}` : `Step ${step.number}`}
                  </div>
                  <div className="mt-2 text-lg text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell section-block">
          <div className="space-y-8 md:space-y-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="panel-surface overflow-hidden"
                >
                  <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-8 lg:p-10">
                    <div className={`relative ${!isEven ? "md:order-2" : ""}`}>
                      <div
                        className="absolute -top-6 text-[100px] leading-none text-[#B91C1C] opacity-[0.06] md:-top-8 md:text-[130px] lg:text-[150px]"
                        style={{
                          fontFamily: "var(--font-display)",
                          left: isEven ? "-0.5rem" : undefined,
                          right: !isEven ? "-0.5rem" : undefined,
                        }}
                      >
                        {step.number}
                      </div>
                      <div className="relative">
                        <span className="section-label">
                          {language === "ta" ? `படி ${step.number} / 4` : `STEP ${step.number} OF 4`}
                        </span>
                        <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                          {step.title}
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-slate-500">
                          {step.description}
                        </p>
                        <ul className="mt-6 space-y-3">
                          {step.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B91C1C]" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className={`flex items-center justify-center ${!isEven ? "md:order-1" : ""}`}>
                      <div className="flex h-44 w-44 items-center justify-center rounded-full border border-[#B91C1C]/12 bg-gradient-to-br from-[#fffaf4] to-[#f5e6d3] shadow-[0_30px_70px_rgba(15,23,42,0.1)] md:h-56 md:w-56 lg:h-64 lg:w-64">
                        {step.icon === Heart ? (
                          <AnimatedHeartIcon className="h-20 w-20 text-[#B91C1C] md:h-24 md:w-24 lg:h-28 lg:w-28" active />
                        ) : (
                          <step.icon className="h-20 w-20 text-[#B91C1C] md:h-24 md:w-24 lg:h-28 lg:w-28" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="hero-surface px-6 py-10 text-center md:px-10 md:py-12">
            <h2 className="text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              {t("howitworks.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 md:text-lg">
              {t("howitworks.cta.desc")}
            </p>
            <button
              onClick={() => router.push("/register")}
              className="btn-primary mt-8 px-8 py-3.5 text-base"
            >
              {t("howitworks.cta.button")}
            </button>
          </div>
        </section>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
