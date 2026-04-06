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
      image: '/images/step-register.png',
      imageAlt: language === "ta" ? "சுயவிவரம் உருவாக்கு" : "Create your profile",
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
      image: '/images/step-search.png',
      imageAlt: language === "ta" ? "சுயவிவரங்களை உலாவு" : "Browse profiles",
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
      image: '/images/step-connect.png',
      imageAlt: language === "ta" ? "ஆர்வம் அனுப்பு" : "Send interest",
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
      image: '/images/step-meet.png',
      imageAlt: language === "ta" ? "சந்தித்து மணம் புரி" : "Meet and marry",
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
          <div className="hero-surface overflow-hidden p-6 text-center md:p-10 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-pill">{t("howitworks.badge")}</span>
              <h1 className="mt-5 text-4xl text-slate-900 md:text-5xl lg:text-[4rem]">
                {t("howitworks.title")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
                {t("howitworks.subtitle")}
              </p>
            </motion.div>

            {/* Banner image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#B91C1C]/10 bg-[#f5ece0] shadow-[0_18px_36px_rgba(15,23,42,0.07)]"
            >
              <img
                src="/images/how-it-works-banner.png"
                alt={language === "ta" ? "தமிழ் திருமண பாரம்பரியம்" : "Traditional Tamil wedding elements"}
                className="aspect-[16/5] w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </motion.div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="panel-muted p-4 text-left">
                  <div className="section-label">
                    {language === "ta" ? `படி ${step.number}` : `Step ${step.number}`}
                  </div>
                  <div className="mt-2 font-display text-lg text-slate-900">
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
                  <div className="grid grid-cols-1 items-stretch gap-0 md:grid-cols-2">
                    {/* Left: text + features */}
                    <div className={`relative flex flex-col justify-center p-6 md:p-8 lg:p-10 ${!isEven ? "md:order-2" : ""}`}>
                      <div
                        className={`absolute -top-4 font-display text-[90px] leading-none text-[#B91C1C] opacity-[0.05] md:text-[120px] lg:text-[140px] ${isEven ? "-left-1" : "-right-1"}`}
                      >
                        {step.number}
                      </div>
                      <div className="relative">
                        <span className="section-label">
                          {language === "ta" ? `படி ${step.number} / 4` : `STEP ${step.number} OF 4`}
                        </span>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#B91C1C] to-[#7F1D1D] text-white shadow-[0_10px_20px_rgba(185,28,28,0.16)]">
                            {step.icon === Heart ? (
                              <AnimatedHeartIcon className="h-4 w-4" active />
                            ) : (
                              <step.icon className="h-4 w-4" />
                            )}
                          </div>
                          <h2 className="text-2xl text-slate-900 md:text-3xl">
                            {step.title}
                          </h2>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-500 md:text-base">
                          {step.description}
                        </p>
                        <div className="mt-5 grid gap-2">
                          {step.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white/60 px-4 py-3 text-sm text-slate-700">
                              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B91C1C]/60" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Right: image fills full column height */}
                    <div className={`relative min-h-[280px] overflow-hidden md:min-h-0 ${!isEven ? "md:order-1" : ""}`}>
                      <img
                        src={step.image}
                        alt={step.imageAlt}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).parentElement!.classList.add('bg-[#f5ece0]');
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="hero-surface px-6 py-10 text-center md:px-10 md:py-12">
            <h2 className="text-3xl text-slate-900 md:text-4xl">
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
