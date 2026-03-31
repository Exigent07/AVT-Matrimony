"use client";

import { Header } from '@/components/layout/Header';
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
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: 'Family-Centered Approach',
      description: 'We understand that marriage is about families, not just individuals. Every connection honors tradition and family values.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Every profile is personally verified by our team before going live. No fake accounts, only genuine people.',
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Serving Tamil communities across India and abroad, with deep respect for Tamil culture and traditions.',
    },
    {
      icon: Target,
      title: 'Meaningful Connections',
      description: 'No algorithm tricks. No swipe culture. Just honest profiles and meaningful connections that lead to marriage.',
    },
  ];

  const stats = [
    { value: '50,000+', label: 'Active Profiles' },
    { value: '2,500+', label: 'Success Stories' },
    { value: '100%', label: 'Verified Profiles' },
    { value: '95%', label: 'Match Rate' },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <Header activeLink="about" viewer={viewer} />

        <section className="section-shell section-block pt-4 md:pt-6">
          <div className="hero-surface p-6 text-center md:p-10 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-pill">About us</span>
              <h1 className="mt-5 text-4xl text-slate-900 md:text-5xl lg:text-[4rem]" style={{ fontFamily: "var(--font-display)" }}>
                {t("about.title")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
                {t("about.desc")}
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-surface text-center">
                  <div className="text-3xl text-[#B91C1C] md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
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
                  <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                    {t("about.mission.title")}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    Our mission is to help Tamil families find compatible matches through a platform
                    that respects tradition while embracing modern convenience. We believe in the
                    sanctity of marriage and the importance of family in the matchmaking process.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    Every profile on our platform is verified, every connection is meaningful, and
                    every success story strengthens our commitment to serving our community.
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex h-56 w-56 items-center justify-center rounded-full border border-[#B91C1C]/12 bg-gradient-to-br from-[#fffaf4] to-[#f5e6d3] shadow-[0_30px_70px_rgba(15,23,42,0.1)] md:h-64 md:w-64 lg:h-72 lg:w-72">
                    <AnimatedHeartIcon className="h-24 w-24 text-[#B91C1C] md:h-32 md:w-32" active />
                  </div>
                </div>
              </div>
          </div>
        </section>

        <section className="section-shell section-block">
          <div className="mb-10 text-center md:mb-14">
            <span className="section-label">Our principles</span>
            <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              {t("about.values.title")}
            </h2>
            <p className="mt-3 text-base text-slate-500">
              {t("about.values.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {values.map((value, index) => (
              <div key={index} className="panel-surface group p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B91C1C]/[0.06] text-[#B91C1C] shadow-[0_16px_28px_rgba(185,28,28,0.08)]">
                    {value.icon === Heart ? (
                      <AnimatedHeartIcon className="h-5 w-5" active />
                    ) : (
                      <value.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl text-slate-900 md:text-2xl" style={{ fontFamily: "var(--font-display)" }}>
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
            <div className="mb-10 text-center md:mb-14">
              <span className="section-label">Our story</span>
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                {t("about.journey.title")}
              </h2>
              <p className="mt-3 text-base text-slate-500">
                {t("about.journey.subtitle")}
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {[
                { year: "2015", title: "Foundation", desc: "AV Tamil Matrimony was founded with a vision to serve Tamil families" },
                { year: "2018", title: "10,000 Members", desc: "Reached our first major milestone with 10,000 active profiles" },
                { year: "2021", title: "Global Expansion", desc: "Expanded services to Tamil communities in USA, UK, Singapore, and Australia" },
                { year: "2026", title: "50,000+ Success", desc: "Celebrating 50,000+ active profiles and 2,500+ successful marriages" },
              ].map((item) => (
                <div key={item.year} className="flex items-start gap-4 md:gap-6 md:items-center">
                  <div className="w-16 shrink-0 text-right md:w-24">
                    <div className="text-xl font-semibold text-[#B91C1C] md:text-2xl" style={{ fontFamily: "var(--font-display)" }}>{item.year}</div>
                  </div>
                  <div className="mt-2 shrink-0 md:mt-0">
                    <div className="h-3 w-3 rounded-full bg-[#B91C1C]" />
                  </div>
                  <div className="panel-muted min-w-0 flex-1 p-4 md:p-5">
                    <h3 className="text-lg text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="hero-surface px-6 py-10 text-center md:px-10 md:py-12">
            <h2 className="text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
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
