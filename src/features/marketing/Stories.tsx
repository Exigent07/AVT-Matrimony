"use client";

import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AnimatedHeartIcon } from '@/components/shared/AnimatedHeartIcon';
import { PageTransition } from '@/components/shared/PageTransition';
import { useRouter } from 'next/navigation';
import { Heart, Quote } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { motion } from 'motion/react';
import type { SessionViewer } from '@/types/domain';

interface StoriesProps {
  viewer?: SessionViewer | null;
}

export function Stories({ viewer }: StoriesProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const successStories = [
    {
      id: 1,
      names: 'Priya & Karthik',
      location: 'Chennai, 2025',
      story: 'We found each other through AV Tamil Matrimony. The verification process gave our families confidence. What started as a simple profile match turned into a beautiful journey of getting to know each other and our families. We are grateful for the platform that brought us together.',
      quote: 'The verification process gave our families confidence and peace of mind.',
    },
    {
      id: 2,
      names: 'Lakshmi & Raj',
      location: 'Coimbatore, 2026',
      story: 'Simple, respectful, and effective. No unnecessary features, just what matters for finding a life partner. We appreciated the focus on family values and the genuine profiles. Within three months of joining, we found each other and knew it was meant to be.',
      quote: 'Simple, respectful, and effective - exactly what we needed.',
    },
    {
      id: 3,
      names: 'Divya & Arun',
      location: 'Singapore, 2025',
      story: 'Being abroad, it was important to find someone who understood both cultures. AV helped us connect meaningfully. Despite being in different countries, the platform made it easy to communicate with our families and make the right decision together.',
      quote: 'AV helped us connect meaningfully across continents.',
    },
    {
      id: 4,
      names: 'Meera & Venkat',
      location: 'Bangalore, 2025',
      story: 'We were both professionals with busy schedules. AV Matrimony made it easy to find compatible matches without compromising on our values. The detailed profiles helped us understand compatibility before even meeting. Our families connected instantly.',
      quote: 'Finding someone who shares your values and vision for the future.',
    },
    {
      id: 5,
      names: 'Anjali & Suresh',
      location: 'Madurai, 2024',
      story: 'As a traditional family, we valued the personal verification process. Every profile we viewed was genuine. The support team was helpful throughout our journey. We found our perfect match within the Tamil community we value so much.',
      quote: 'Traditional values meeting modern convenience - perfect!',
    },
    {
      id: 6,
      names: 'Kavitha & Ramesh',
      location: 'USA, 2025',
      story: 'Living in the USA, we wanted to stay connected to our Tamil roots. AV Matrimony helped us find partners who understood our dual identity. The platform\'s global reach connected us with someone from our community living abroad.',
      quote: 'Staying connected to our roots while building a future abroad.',
    },
  ];

  const testimonials = [
    {
      name: 'Saravanan Family',
      relation: 'Parents',
      text: 'As parents, finding the right match for our daughter was paramount. AV Tamil Matrimony\'s verification process and family-centered approach gave us the confidence we needed. Highly recommended!',
    },
    {
      name: 'Janaki Krishnan',
      relation: 'User',
      text: 'I was skeptical about online matrimony, but AV changed my perspective. The profiles are genuine, the process is respectful, and the support team is always available to help.',
    },
    {
      name: 'Murugan & Lakshmi',
      relation: 'Married Couple',
      text: 'We got married last year after meeting through AV Tamil Matrimony. The platform made it easy for our families to connect and communicate. Thank you for bringing us together!',
    },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <Header activeLink="stories" viewer={viewer} />

        <section className="section-shell section-block pt-4 md:pt-6">
          <div className="hero-surface p-6 text-center md:p-10 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-pill">Real connections</span>
              <h1 className="mt-5 text-4xl text-slate-900 md:text-5xl lg:text-[4rem]" style={{ fontFamily: "var(--font-display)" }}>
                {t("stories.title")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
                {t("stories.desc")}
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <div className="stat-surface text-center">
                  <div className="text-3xl text-[#B91C1C] md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>2,500+</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{t("stories.successful.marriages")}</div>
                </div>
              </div>
              <div>
                <div className="stat-surface text-center">
                  <div className="text-3xl text-[#B91C1C] md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>50+</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{t("stories.countries.connected")}</div>
                </div>
              </div>
              <div>
                <div className="stat-surface text-center">
                  <div className="text-3xl text-[#B91C1C] md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>95%</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{t("stories.happy.families")}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-block">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {successStories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="panel-surface group overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-[#B91C1C] to-[#7F1D1D] text-lg font-semibold text-white shadow-[0_18px_36px_rgba(185,28,28,0.18)]">
                      {story.names
                        .split("&")
                        .map((name) => name.trim().charAt(0))
                        .join("")}
                    </div>
                    <AnimatedHeartIcon className="h-5 w-5 text-[#B91C1C]" active />
                  </div>
                  <div className="mb-4 flex items-start gap-2">
                    <Quote className="mt-0.5 h-5 w-5 shrink-0 text-[#B91C1C]/25" />
                    <p className="text-base italic leading-relaxed text-slate-600">&ldquo;{story.quote}&rdquo;</p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">{story.story}</p>
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="text-lg text-[#B91C1C]" style={{ fontFamily: "var(--font-display)" }}>
                      {story.names}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">{story.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="panel-surface p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <span className="section-label">Voices of trust</span>
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                {t("stories.testimonials.title")}
              </h2>
              <p className="mt-3 text-base text-slate-500">
                {t("stories.testimonials.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="panel-muted p-6 md:p-8">
                  <div className="text-3xl leading-none text-slate-300">&ldquo;</div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{testimonial.text}</p>
                  <div className="mt-5 border-t border-slate-200/60 pt-4">
                    <div className="text-lg text-[#B91C1C]" style={{ fontFamily: "var(--font-display)" }}>
                      {testimonial.name}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">{testimonial.relation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell section-block pt-0">
          <div className="hero-surface px-6 py-10 text-center md:px-10 md:py-12">
            <h2 className="text-3xl text-slate-900 md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              {t("stories.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 md:text-lg">
              {t("stories.cta.desc")}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push("/register")}
                className="btn-primary w-full px-8 py-3.5 text-base sm:w-auto"
              >
                {t("stories.cta.button")}
              </button>
              <button
                onClick={() => router.push("/how-it-works")}
                className="btn-secondary w-full px-8 py-3.5 text-base sm:w-auto"
              >
                {t("stories.cta.learn")}
              </button>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
