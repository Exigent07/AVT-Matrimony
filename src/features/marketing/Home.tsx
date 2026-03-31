"use client";

import { Header } from '@/components/layout/Header';
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
  const { t } = useLanguage();

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
      names: 'Priya & Karthik',
      location: 'Chennai, 2025',
    },
    {
      quote: t('story_2_quote'),
      names: 'Lakshmi & Raj',
      location: 'Coimbatore, 2026',
    },
    {
      quote: t('story_3_quote'),
      names: 'Divya & Arun',
      location: 'Singapore, 2025',
    },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <Header activeLink="home" viewer={viewer} />

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
                  <span>Trusted by 50,000+ Tamil families</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18 }}
                  className="mt-6 text-4xl text-slate-900 md:text-5xl lg:text-[4.15rem]"
                  style={{ fontFamily: "var(--font-display)" }}
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
                    Explore the process
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.46 }}
                  className="mt-10 grid gap-3 sm:grid-cols-3"
                >
                  {[
                    "Verified profiles before visibility",
                    "Family-first introductions and support",
                    "Tamil community focus across regions",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.35rem] border border-[#B91C1C]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(250,245,237,0.92))] px-4 py-4 shadow-[0_14px_28px_rgba(15,23,42,0.04)]"
                    >
                      <div className="h-px w-12 bg-gradient-to-r from-[#B91C1C]/45 to-transparent" />
                      <div className="mt-3 text-sm font-semibold leading-6 text-slate-900">{item}</div>
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
                    <div className="section-label">Why families choose AV</div>
                    <h2 className="mt-2 text-2xl text-slate-900 md:text-3xl">A calmer, more intentional match journey</h2>
                  </div>
                  <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#B91C1C] text-white shadow-[0_18px_34px_rgba(185,28,28,0.18)] sm:flex">
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
                <div className="section-label">A recent success story</div>
                <div className="mt-3 text-xl text-slate-900 md:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                  {stories[0]?.names}
                </div>
                <p className="mt-3 text-sm italic leading-relaxed text-slate-600">
                  &ldquo;{stories[0]?.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="text-sm text-slate-500">{stories[0]?.location}</div>
                  <button
                    onClick={() => router.push("/stories")}
                    className="link-brand inline-flex items-center gap-2 text-sm"
                  >
                    Read more stories
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
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B91C1C] to-[#7F1D1D] text-white shadow-[0_14px_28px_rgba(185,28,28,0.16)]">
                      {stat.icon === Heart ? (
                        <AnimatedHeartIcon className="h-[18px] w-[18px]" active />
                      ) : (
                        <stat.icon className="h-[18px] w-[18px]" />
                      )}
                    </div>
                    <div
                      className="mt-4 text-3xl font-semibold text-[#B91C1C]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
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
              <div className="section-label">Designed for quality</div>
              <h2 className="mt-2 text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Built for trust, not noise.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                No swipe-heavy distractions, no noisy gimmicks, and no shortcuts around profile review.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => router.push("/about")}
                  className="btn-secondary px-4 py-2.5 text-sm"
                >
                  Learn about AV
                </button>
                <button
                  onClick={() => router.push("/help")}
                  className="btn-ghost px-4 py-2.5 text-sm"
                >
                  Visit help center
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
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                Your Journey to Forever
              </h2>
              <p className="mt-3 text-sm text-slate-500 md:text-base">
                Four clear steps, shaped for families who want clarity, trust, and a serious path to marriage.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
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
                  className="panel-muted group relative overflow-hidden p-6 text-center md:p-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B91C1C]/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B91C1C] to-[#7F1D1D] text-sm font-semibold text-white shadow-[0_16px_30px_rgba(185,28,28,0.16)] md:h-14 md:w-14 md:text-base">
                      {step.num}
                    </div>
                    <h3 className="mt-5 text-xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
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
              className="mt-8 text-center md:mt-12"
            >
              <button
                onClick={() => router.push("/how-it-works")}
                className="btn-secondary"
              >
                Learn more about our process
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
            <span className="section-label">Our difference</span>
            <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Why AV Tamil Matrimony
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 md:text-base">
              Every part of the experience is tuned for trust, seriousness, and long-term family fit.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
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
                    <div className="mb-5 h-1 w-14 rounded-full bg-[#B91C1C]" />
                    <h3 className="text-xl text-[#B91C1C] md:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
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
              <span className="section-label">Real connections</span>
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                {t("header.success.stories")}
              </h2>
              <p className="mt-3 text-sm text-slate-500 md:text-base">
                Real couples, real family trust, and stories shaped by compatibility instead of noise.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
              {stories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="panel-muted group relative overflow-hidden p-6 md:p-8"
                >
                  <div className="relative z-10">
                    <div className="text-4xl leading-none text-[#B91C1C]/20 md:text-5xl">&ldquo;</div>
                    <p className="mt-2 text-sm italic leading-relaxed text-slate-600 md:mt-3">{story.quote}</p>
                    <div className="mt-5 border-t border-slate-200/60 pt-4">
                      <div className="text-lg text-[#B91C1C]" style={{ fontFamily: "var(--font-display)" }}>
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
              className="mt-8 text-center md:mt-12"
            >
              <button
                onClick={() => router.push("/stories")}
                className="btn-secondary"
              >
                Read more success stories
              </button>
            </motion.div>
          </div>
        </section>

        <SiteFooter variant="gradient" />
      </div>
    </PageTransition>
  );
}
