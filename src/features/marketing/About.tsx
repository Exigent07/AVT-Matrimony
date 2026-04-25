"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AnimatedHeartIcon } from '@/components/shared/AnimatedHeartIcon';
import { PageTransition } from '@/components/shared/PageTransition';
import type { SessionViewer } from '@/types/domain';
import { useRouter } from 'next/navigation';
import { Heart, Shield, Users, Target } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { motion } from 'motion/react';

interface AboutProps {
  viewer?: SessionViewer | null;
}

export function About({ viewer }: AboutProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const copy =
    language === "ta"
      ? {
          badge: "எங்களை பற்றி",
          missionParagraphOne: "தமிழ் குடும்பங்கள் பாரம்பரியத்தை மதிக்கும், அதே நேரத்தில் நவீன வசதியையும் ஏற்றுக்கொள்ளும் ஒரு தளத்தின் மூலம் பொருத்தமான இணைப்புகளைப் பெற உதவுவது எங்கள் நோக்கம். திருமணத்தின் புனிதத்தையும் குடும்பத்தின் முக்கியத்துவத்தையும் நாங்கள் நம்புகிறோம்.",
          missionParagraphTwo: "எங்கள் தளத்தில் உள்ள ஒவ்வொரு சுயவிவரமும் சரிபார்க்கப்பட்டது, ஒவ்வொரு இணைப்பும் அர்த்தமுள்ளதாகும், ஒவ்வொரு வெற்றிக் கதையும் எங்கள் சமூகத்திற்கான அர்ப்பணிப்பை வலுப்படுத்துகிறது.",
          principlesLabel: "எங்கள் கொள்கைகள்",
          storyLabel: "எங்கள் கதை",
        }
      : {
          badge: "About us",
          missionParagraphOne: "Our mission is to help Tamil families find compatible matches through a platform that respects tradition while embracing modern convenience. We believe in the sanctity of marriage and the importance of family in the matchmaking process.",
          missionParagraphTwo: "Every profile on our platform is verified, every connection is meaningful, and every success story strengthens our commitment to serving our community.",
          principlesLabel: "Our principles",
          storyLabel: "Our story",
        };

  const values = [
    {
      icon: Heart,
      title: language === "ta" ? 'குடும்ப மைய அணுகுமுறை' : 'Family-Centered Approach',
      description: language === "ta" ? 'திருமணம் என்பது தனிநபர்களைப் பற்றியது மட்டுமல்ல, குடும்பங்களையும் பற்றியது என்பதை நாங்கள் புரிந்துகொள்கிறோம். ஒவ்வொரு இணைப்பும் பாரம்பரியத்தையும் குடும்ப மதிப்புகளையும் மதிக்கிறது.' : 'We understand that marriage is about families, not just individuals. Every connection honors tradition and family values.',
    },
    {
      icon: Shield,
      title: language === "ta" ? 'நம்பிக்கை மற்றும் பாதுகாப்பு' : 'Trust & Security',
      description: language === "ta" ? 'ஒவ்வொரு சுயவிவரமும் பொதுவில் காண்பிக்கப்படும் முன் எங்கள் குழுவால் தனிப்பட்ட முறையில் சரிபார்க்கப்படுகிறது. போலி கணக்குகள் இல்லை, உண்மையான நபர்கள் மட்டுமே.' : 'Every profile is personally verified by our team before going live. No fake accounts, only genuine people.',
    },
    {
      icon: Users,
      title: language === "ta" ? 'சமூக கவனம்' : 'Community Focus',
      description: language === "ta" ? 'இந்தியாவிலும் வெளிநாடுகளிலும் உள்ள தமிழ் சமூகங்களுக்கு தமிழ் கலாசாரம் மற்றும் பாரம்பரியங்களுக்கு ஆழ்ந்த மரியாதையுடன் சேவை செய்கிறோம்.' : 'Serving Tamil communities across India and abroad, with deep respect for Tamil culture and traditions.',
    },
    {
      icon: Target,
      title: language === "ta" ? 'அர்த்தமுள்ள இணைப்புகள்' : 'Meaningful Connections',
      description: language === "ta" ? 'அல்காரிதம் தந்திரங்கள் இல்லை. ஸ்வைப் கலாச்சாரம் இல்லை. நேர்மையான சுயவிவரங்கள் மற்றும் திருமணத்துக்கு வழிவகுக்கும் அர்த்தமுள்ள இணைப்புகள் மட்டுமே.' : 'No algorithm tricks. No swipe culture. Just honest profiles and meaningful connections that lead to marriage.',
    },
  ];

  const stats = [
    { value: '50,000+', label: language === "ta" ? 'செயலில் உள்ள சுயவிவரங்கள்' : 'Active Profiles' },
    { value: '2,500+', label: language === "ta" ? 'வெற்றிக் கதைகள்' : 'Success Stories' },
    { value: '100%', label: language === "ta" ? 'சரிபார்க்கப்பட்ட சுயவிவரங்கள்' : 'Verified Profiles' },
    { value: '95%', label: language === "ta" ? 'பொருத்த விகிதம்' : 'Match Rate' },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="public" activeLink="about" viewer={viewer} />

        <section className="section-shell section-block pt-4 md:pt-6">
          <div className="hero-surface p-6 text-center md:p-10 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-pill">{copy.badge}</span>
              <h1 className="mt-5 text-4xl text-slate-900 md:text-5xl lg:text-[4rem]">
                {t("about.title")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
                {t("about.desc")}
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-surface text-center">
                  <div className="font-display text-3xl text-[#B91C1C] md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="panel-surface overflow-hidden">
            <div className="grid grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-10 lg:p-12">
              <div>
                <span className="section-label">
                  {t("about.mission.badge")}
                </span>
                <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl">
                  {t("about.mission.title")}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {copy.missionParagraphOne}
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {copy.missionParagraphTwo}
                </p>
              </div>
              <div className="overflow-hidden rounded-[1.5rem] border border-[#B91C1C]/10 bg-[#f5ece0] shadow-[0_18px_36px_rgba(15,23,42,0.07)]">
                <img
                  src="/images/about-mission.png"
                  alt={language === "ta" ? "தமிழ் பாரம்பரிய திருமண அலங்காரம்" : "Traditional Tamil cultural décor"}
                  className="aspect-[4/3] w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-block">
          <div className="mb-6 text-center md:mb-8">
            <span className="section-label">{copy.principlesLabel}</span>
            <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl">
              {t("about.values.title")}
            </h2>
            <p className="mt-3 text-base text-slate-500">
              {t("about.values.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {values.map((value, index) => (
              <div key={index} className="panel-surface group p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                    {value.icon === Heart ? (
                      <AnimatedHeartIcon className="h-5 w-5" active />
                    ) : (
                      <value.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl text-slate-900 md:text-2xl">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="panel-surface p-6 md:p-8 lg:p-10">
            <div className="mb-6 text-center md:mb-8">
              <span className="section-label">{copy.storyLabel}</span>
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl">
                {t("about.journey.title")}
              </h2>
              <p className="mt-3 text-base text-slate-500">
                {t("about.journey.subtitle")}
              </p>
            </div>

            <div className="space-y-4 md:space-y-5">
              {[
                {
                  year: "2015",
                  title: language === "ta" ? "அடித்தளம்" : "Foundation",
                  desc: language === "ta" ? "தமிழ் குடும்பங்களுக்கு சேவை செய்வதற்கான நோக்கத்துடன் AVTamil Matrimony தொடங்கப்பட்டது" : "AVTamil Matrimony was founded with a vision to serve Tamil families",
                },
                {
                  year: "2018",
                  title: language === "ta" ? "10,000 உறுப்பினர்கள்" : "10,000 Members",
                  desc: language === "ta" ? "10,000 செயலில் உள்ள சுயவிவரங்களுடன் எங்கள் முதல் முக்கிய இலக்கை எட்டினோம்" : "Reached our first major milestone with 10,000 active profiles",
                },
                {
                  year: "2021",
                  title: language === "ta" ? "உலகளாவிய விரிவு" : "Global Expansion",
                  desc: language === "ta" ? "அமெரிக்கா, இங்கிலாந்து, சிங்கப்பூர், மற்றும் ஆஸ்திரேலியாவில் உள்ள தமிழ் சமூகங்களுக்கு சேவைகளை விரிவுபடுத்தினோம்" : "Expanded services to Tamil communities in USA, UK, Singapore, and Australia",
                },
                {
                  year: "2026",
                  title: language === "ta" ? "50,000+ வெற்றி" : "50,000+ Success",
                  desc: language === "ta" ? "50,000+ செயலில் உள்ள சுயவிவரங்களையும் 2,500+ வெற்றிகரமான திருமணங்களையும் கொண்டாடுகிறோம்" : "Celebrating 50,000+ active profiles and 2,500+ successful marriages",
                },
              ].map((item) => (
                <div key={item.year} className="flex items-center gap-4 md:gap-6">
                  <div className="w-16 shrink-0 text-right md:w-20">
                    <div className="font-display text-xl font-semibold text-[#B91C1C] md:text-2xl">{item.year}</div>
                  </div>
                  <div className="shrink-0">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#B91C1C]" />
                  </div>
                  <div className="panel-muted min-w-0 flex-1 p-4 md:p-5">
                    <h3 className="text-lg text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="hero-surface px-6 py-10 text-center md:px-10 md:py-12">
            <h2 className="text-3xl text-slate-900 md:text-4xl">
              {t("about.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 md:text-lg">
              {t("about.cta.desc")}
            </p>
            <button
              onClick={() => router.push("/register")}
              className="btn-primary mt-8 px-8 py-3.5 text-base"
            >
              {t("about.cta.button")}
            </button>
          </div>
        </section>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
