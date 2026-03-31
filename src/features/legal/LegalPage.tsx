"use client";

import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/shared/PageTransition";
import type { SessionViewer } from "@/types/domain";

interface LegalSection {
  title: string;
  body: string[];
}

interface LegalPageProps {
  badge: string;
  title: string;
  introduction: string;
  sections: LegalSection[];
  viewer?: SessionViewer | null;
}

export function LegalPage({
  badge,
  title,
  introduction,
  sections,
  viewer,
}: LegalPageProps) {
  return (
    <PageTransition>
      <div className="page-shell">
        <Header viewer={viewer} />

        <main className="section-shell-narrow section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">{badge}</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{introduction}</p>
          </section>

          <section className="mt-5 space-y-4">
            {sections.map((section) => (
              <article
                key={section.title}
                className="panel-surface p-6 md:p-8"
              >
                <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-slate-500">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </main>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
