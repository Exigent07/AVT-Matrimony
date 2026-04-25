"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AnimatedHeartIcon } from '@/components/shared/AnimatedHeartIcon';
import { PageTransition } from '@/components/shared/PageTransition';
import { Users, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useLanguage } from '@/providers/LanguageProvider';
import type { SessionViewer } from '@/types/domain';

interface HomeProps {
  viewer?: SessionViewer | null;
}

export function Home({ viewer }: HomeProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const copy =
    language === "ta"
      ? {
          trustLabel: "50,000+ தமிழ் குடும்பங்கள் நம்பும் தளம்",
          exploreProcess: "செயல்முறையை அறிக",
          heroChips: [
            "காட்சிக்கு முன் சரிபார்க்கப்பட்ட சுயவிவரங்கள்",
            "குடும்ப முன்னுரிமையுள்ள அறிமுகங்கள் மற்றும் ஆதரவு",
            "பிராந்தியங்களை தாண்டிய தமிழ் சமூக கவனம்",
          ],
          whyLabel: "குடும்பங்கள் ஏன் AV-ஐத் தேர்வுசெய்கின்றன",
          whyTitle: "அமைதியான, நோக்கமுள்ள பொருத்தப் பயணம்",
          storyLabel: "சமீபத்திய வெற்றிக் கதை",
          readStories: "மேலும் கதைகளை வாசிக்கவும்",
          qualityLabel: "தரத்துக்காக வடிவமைக்கப்பட்டது",
          qualityTitle: "சத்தத்திற்காக அல்ல, நம்பிக்கைக்காக உருவாக்கப்பட்டது.",
          qualityDescription: "அதிக ஸ்வைப் கவனச்சிதறல்கள் இல்லை, சத்தமான கிமிக்குகள் இல்லை, சுயவிவர பரிசீலனையைத் தாண்டும் சுருக்கப்பாதைகள் இல்லை.",
          learnAbout: "AV பற்றி அறிக",
          visitHelp: "உதவி மையத்துக்கு செல்லவும்",
          journeyTitle: "நிலையான உறவுக்கான உங்கள் பயணம்",
          journeyDescription: "தெளிவு, நம்பிக்கை, மற்றும் திருமணத்திற்கான சீரிய பாதையை விரும்பும் குடும்பங்களுக்கான நான்கு தெளிவான படிகள்.",
          learnProcess: "எங்கள் செயல்முறையை மேலும் அறிக",
          differenceLabel: "எங்கள் வித்தியாசம்",
          differenceTitle: "ஏன் AV தமிழ் மேட்ரிமோனி",
          differenceDescription: "அனுபவத்தின் ஒவ்வொரு பகுதியும் நம்பிக்கை, சீரிய நோக்கம், மற்றும் நீண்டகால குடும்ப பொருத்தத்திற்காக அமைக்கப்பட்டுள்ளது.",
          realConnectionsLabel: "உண்மையான இணைப்புகள்",
          realConnectionsDescription: "உண்மையான ஜோடிகள், உண்மையான குடும்ப நம்பிக்கை, மற்றும் சத்தமல்லாமல் பொருத்தத்தை மையமாகக் கொண்ட கதைகள்.",
          readSuccessStories: "மேலும் வெற்றிக் கதைகளை வாசிக்கவும்",
        }
      : {
          trustLabel: "Trusted by 50,000+ Tamil families",
          exploreProcess: "Explore the process",
          heroChips: [
            "Verified profiles before visibility",
            "Family-first introductions and support",
            "Tamil community focus across regions",
          ],
          whyLabel: "Why families choose AV",
          whyTitle: "A calmer, more intentional match journey",
          storyLabel: "A recent success story",
          readStories: "Read more stories",
          qualityLabel: "Designed for quality",
          qualityTitle: "Built for trust, not noise.",
          qualityDescription: "No swipe-heavy distractions, no noisy gimmicks, and no shortcuts around profile review.",
          learnAbout: "Learn about AV",
          visitHelp: "Visit help center",
          journeyTitle: "Your Journey to Forever",
          journeyDescription: "Four clear steps, shaped for families who want clarity, trust, and a serious path to marriage.",
          learnProcess: "Learn more about our process",
          differenceLabel: "Our difference",
          differenceTitle: "Why AVTamil Matrimony",
          differenceDescription: "Every part of the experience is tuned for trust, seriousness, and long-term family fit.",
          realConnectionsLabel: "Real connections",
          realConnectionsDescription: "Real couples, real family trust, and stories shaped by compatibility instead of noise.",
          readSuccessStories: "Read more success stories",
        };

  const stats = [
    { icon: Users, value: '50K+', label: t('active_profiles') },
    { icon: Heart, value: '2.5K+', label: t('success_stories') },
    { icon: ShieldCheck, value: '100%', label: t('verified_profiles') },
  ];

  const features = [
    {
      title: t('family_centered_approach'),
      description: t('family_centered_description'),
    },
    {
      title: t('verified_profiles_only'),
      description: t('verified_profiles_description'),
    },
    {
      title: t('tamil_community_focus'),
      description: t('tamil_community_description'),
    },
    {
      title: t('no_games_just_genuine_connections'),
      description: t('no_games_description'),
    },
  ];

  const stories = [
    {
      quote: t('story_1_quote'),
      names: language === "ta" ? "ப்ரியா & கார்த்திக்" : 'Priya & Karthik',
      location: language === "ta" ? "சென்னை, 2025" : 'Chennai, 2025',
    },
    {
      quote: t('story_2_quote'),
      names: language === "ta" ? "லட்சுமி & ராஜ்" : 'Lakshmi & Raj',
      location: language === "ta" ? "கோயம்புத்தூர், 2026" : 'Coimbatore, 2026',
    },
    {
      quote: t('story_3_quote'),
      names: language === "ta" ? "திவ்யா & அருண்" : 'Divya & Arun',
      location: language === "ta" ? "சிங்கப்பூர், 2025" : 'Singapore, 2025',
    },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="public" activeLink="home" viewer={viewer} />

        <section className="section-shell section-block pt-4 md:pt-6 lg:pt-8">
          <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
            <div className="hero-surface relative h-full p-6 md:p-8 lg:p-12">
              <div className="absolute -left-12 top-0 h-48 w-48 rounded-full bg-[#B91C1C]/[0.06] blur-3xl" />
              <div className="absolute right-0 top-12 h-40 w-40 rounded-full bg-[#B91C1C]/[0.05] blur-3xl" />
              <div className="relative max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="eyebrow-pill"
                >
                  <AnimatedHeartIcon className="h-3.5 w-3.5" active />
                  <span>{copy.trustLabel}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="mt-6 text-4xl text-slate-900 md:text-5xl lg:text-[4.15rem] lg:leading-[0.96]"
                >
                  {t("home.hero.title")}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28 }}
                  className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg"
                >
                  {t("home.hero.description")}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.38 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <button
                    onClick={() => router.push("/register")}
                    className="btn-primary group px-6 py-3.5 text-base"
                  >
                    <span>{t("home.cta.get.started")}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                  <button
                    onClick={() => router.push("/how-it-works")}
                    className="btn-secondary px-6 py-3.5 text-base"
                  >
                    {copy.exploreProcess}
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="mt-3"
                >
                  <button
                    onClick={() => router.push("/login")}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#B91C1C]"
                  >
                    {language === "ta"
                      ? "ஏற்கனவே உறுப்பினரா? உங்கள் பயணத்தை தொடரவும்"
                      : "Already on your journey? Continue here"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.42 }}
                  className="mt-8 overflow-hidden rounded-[1.75rem] border border-[#B91C1C]/10 bg-[#f5ece0] shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                >
                  <img
                    src="/images/hero-decor.png"
                    alt={language === "ta" ? "தமிழ் திருமண அலங்காரம்" : "Traditional Tamil wedding décor"}
                    className="aspect-[16/10] w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.46 }}
                  className="mt-5 grid gap-3 sm:grid-cols-3"
                >
                  {copy.heroChips.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.35rem] border border-[#B91C1C]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(250,245,237,0.92))] px-4 py-4 shadow-[0_14px_28px_rgba(15,23,42,0.04)]"
                    >
                      <div className="h-[1.5px] w-10 rounded-full bg-gradient-to-r from-[#B91C1C]/50 to-transparent" />
                      <div className="mt-3 text-sm font-semibold leading-snug text-slate-900">{item}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="grid gap-5 xl:grid-rows-[minmax(0,1fr)_auto]"
            >
              <div className="panel-surface flex h-full flex-col p-5 md:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="max-w-sm">
                    <div className="section-label">{copy.whyLabel}</div>
                    <h2 className="mt-2 text-2xl text-slate-900 md:text-3xl">{copy.whyTitle}</h2>
                  </div>
                  <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#B91C1C] text-white shadow-[0_14px_28px_rgba(185,28,28,0.18)] sm:flex">
                    <AnimatedHeartIcon className="h-5 w-5" active />
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  {features.slice(0, 3).map((feature) => (
                    <div
                      key={feature.title}
                      className="panel-muted elevated-card px-4 py-4"
                    >
                      <div className="text-base font-semibold text-slate-900">{feature.title}</div>
                      <div className="mt-1.5 text-sm leading-relaxed text-slate-500">
                        {feature.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-surface p-5 md:p-6">
                <div className="section-label">{copy.storyLabel}</div>
                <div className="mt-2 font-display text-xl text-slate-900 md:text-2xl">
                  {stories[0]?.names}
                </div>
                <p className="mt-2.5 text-sm italic leading-relaxed text-slate-600">
                  &ldquo;{stories[0]?.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="text-sm text-slate-500">{stories[0]?.location}</div>
                  <button
                    onClick={() => router.push("/stories")}
                    className="link-brand inline-flex items-center gap-2 text-sm"
                  >
                    {copy.readStories}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="panel-surface p-5 md:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.42 + index * 0.06 }}
                    className="stat-surface text-center"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#B91C1C] to-[#7F1D1D] text-white shadow-[0_12px_24px_rgba(185,28,28,0.16)]">
                      {stat.icon === Heart ? (
                        <AnimatedHeartIcon className="h-[18px] w-[18px]" active />
                      ) : (
                        <stat.icon className="h-[18px] w-[18px]" />
                      )}
                    </div>
                    <div className="mt-4 font-display text-3xl font-semibold text-[#B91C1C]">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="panel-muted p-5 md:p-6">
              <div className="section-label">{copy.qualityLabel}</div>
              <h2 className="mt-2 text-2xl text-slate-900">
                {copy.qualityTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {copy.qualityDescription}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => router.push("/about")}
                  className="btn-secondary px-4 py-2.5 text-sm"
                >
                  {copy.learnAbout}
                </button>
                <button
                  onClick={() => router.push("/help")}
                  className="btn-ghost px-4 py-2.5 text-sm"
                >
                  {copy.visitHelp}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-block">
          <div className="panel-surface relative overflow-hidden p-6 md:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="section-label">{t("home.how.it.works.title")}</span>
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl">
                {copy.journeyTitle}
              </h2>
              <p className="mt-3 text-sm text-slate-500 md:text-base">
                {copy.journeyDescription}
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {[
                { num: "01", title: t("home.how.step1"), desc: t("home.how.step1.desc") },
                { num: "02", title: t("home.how.step2"), desc: t("home.how.step2.desc") },
                { num: "03", title: t("home.how.step3"), desc: t("home.how.step3.desc") },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="panel-muted group relative overflow-hidden p-5 md:p-7"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B91C1C]/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#B91C1C] to-[#7F1D1D] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(185,28,28,0.16)]">
                      {step.num}
                    </div>
                    <h3 className="mt-4 text-xl text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-7 text-center md:mt-10"
            >
              <button
                onClick={() => router.push("/how-it-works")}
                className="btn-secondary"
              >
                {copy.learnProcess}
              </button>
            </motion.div>
          </div>
        </section>

        <section className="section-shell section-block pt-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="section-label">{copy.differenceLabel}</span>
            <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl">
              {copy.differenceTitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 md:text-base">
              {copy.differenceDescription}
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="panel-surface elevated-card group relative overflow-hidden p-6 md:p-8"
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#B91C1C]/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-4 h-px w-10 rounded-full bg-[#B91C1C]/60" />
                    <h3 className="text-xl text-[#B91C1C] md:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>

        <section className="section-shell section-block">
          <div className="panel-surface relative overflow-hidden p-6 md:p-8 lg:p-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="section-label">{copy.realConnectionsLabel}</span>
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl">
                {t("header.success.stories")}
              </h2>
              <p className="mt-3 text-sm text-slate-500 md:text-base">
                {copy.realConnectionsDescription}
              </p>
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {stories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="panel-muted group relative overflow-hidden p-5 md:p-6"
                >
                  <div className="relative z-10">
                    <div className="mb-3.5 h-[1.5px] w-8 rounded-full bg-[#B91C1C]/35" />
                    <p className="text-sm italic leading-relaxed text-slate-600">{story.quote}</p>
                    <div className="mt-4 border-t border-slate-100/80 pt-4">
                      <div className="font-display text-base text-[#B91C1C]">
                        {story.names}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">{story.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-7 text-center md:mt-10"
            >
              <button
                onClick={() => router.push("/stories")}
                className="btn-secondary"
              >
                {copy.readSuccessStories}
              </button>
            </motion.div>
          </div>
        </section>

        <SiteFooter variant="gradient" />
      </div>
    </PageTransition>
  );
}
