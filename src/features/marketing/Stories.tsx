"use client";

import { AppHeader } from "@/components/layout/AppHeader";
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
  const { t, language } = useLanguage();

  const successStories = [
    {
      id: 1,
      names: language === "ta" ? 'ப்ரியா & கார்த்திக்' : 'Priya & Karthik',
      location: language === "ta" ? 'சென்னை, 2025' : 'Chennai, 2025',
      story: language === "ta" ? 'நாங்கள் AV தமிழ் மேட்ரிமோனி மூலம் ஒருவரையொருவர் கண்டுபிடித்தோம். சரிபார்ப்பு செயல்முறை எங்கள் குடும்பங்களுக்கு நம்பிக்கையை வழங்கியது. ஒரு எளிய சுயவிவர பொருத்தமாகத் தொடங்கியது, எங்களையும் எங்கள் குடும்பங்களையும் அறிந்து கொள்ளும் அழகான பயணமாக மாறியது.' : 'We found each other through AV Tamil Matrimony. The verification process gave our families confidence. What started as a simple profile match turned into a beautiful journey of getting to know each other and our families. We are grateful for the platform that brought us together.',
      quote: language === "ta" ? 'சரிபார்ப்பு செயல்முறை எங்கள் குடும்பங்களுக்கு நம்பிக்கையும் மனநிம்மதியும் வழங்கியது.' : 'The verification process gave our families confidence and peace of mind.',
    },
    {
      id: 2,
      names: language === "ta" ? 'லட்சுமி & ராஜ்' : 'Lakshmi & Raj',
      location: language === "ta" ? 'கோயம்புத்தூர், 2026' : 'Coimbatore, 2026',
      story: language === "ta" ? 'எளிமையானது, மரியாதையானது, மற்றும் பயனுள்ளது. வாழ்க்கைத்துணையைத் தேடுவதற்கு தேவையான அம்சங்கள் மட்டும். குடும்ப மதிப்புகள் மற்றும் உண்மையான சுயவிவரங்கள் மீது இருந்த கவனம் எங்களுக்கு மிகவும் பிடித்தது.' : 'Simple, respectful, and effective. No unnecessary features, just what matters for finding a life partner. We appreciated the focus on family values and the genuine profiles. Within three months of joining, we found each other and knew it was meant to be.',
      quote: language === "ta" ? 'எங்களுக்கு தேவைப்பட்டதுதான் இது - எளிமை, மரியாதை, மற்றும் பயன்.' : 'Simple, respectful, and effective - exactly what we needed.',
    },
    {
      id: 3,
      names: language === "ta" ? 'திவ்யா & அருண்' : 'Divya & Arun',
      location: language === "ta" ? 'சிங்கப்பூர், 2025' : 'Singapore, 2025',
      story: language === "ta" ? 'வெளிநாட்டில் இருந்ததால், இரண்டு கலாசாரங்களையும் புரிந்துகொள்ளும் ஒருவரைத் தேடுவது முக்கியமாக இருந்தது. AV எங்களுக்கு அர்த்தமுள்ள இணைப்பை உருவாக்க உதவியது.' : 'Being abroad, it was important to find someone who understood both cultures. AV helped us connect meaningfully. Despite being in different countries, the platform made it easy to communicate with our families and make the right decision together.',
      quote: language === "ta" ? 'கண்டங்களைத் தாண்டி அர்த்தமுள்ள தொடர்பை AV உருவாக்க உதவியது.' : 'AV helped us connect meaningfully across continents.',
    },
    {
      id: 4,
      names: language === "ta" ? 'மீரா & வெங்கட்' : 'Meera & Venkat',
      location: language === "ta" ? 'பெங்களூரு, 2025' : 'Bangalore, 2025',
      story: language === "ta" ? 'நாங்கள் இருவரும் பிஸியான அட்டவணையுடன் இருந்த தொழில்முனைவர்கள். எங்கள் மதிப்புகளை விட்டுக்கொடுக்காமல் பொருத்தமான இணைப்புகளை AV மேட்ரிமோனி கண்டுபிடிக்க உதவியது.' : 'We were both professionals with busy schedules. AV Matrimony made it easy to find compatible matches without compromising on our values. The detailed profiles helped us understand compatibility before even meeting. Our families connected instantly.',
      quote: language === "ta" ? 'உங்கள் மதிப்புகளையும் எதிர்காலக் கண்ணோட்டத்தையும் பகிரும் ஒருவரைக் கண்டுபிடிப்பது.' : 'Finding someone who shares your values and vision for the future.',
    },
    {
      id: 5,
      names: language === "ta" ? 'அஞ்சலி & சுரேஷ்' : 'Anjali & Suresh',
      location: language === "ta" ? 'மதுரை, 2024' : 'Madurai, 2024',
      story: language === "ta" ? 'ஒரு பாரம்பரிய குடும்பமாக, தனிப்பட்ட சரிபார்ப்பு செயல்முறையை நாம் மதித்தோம். நாம் பார்த்த ஒவ்வொரு சுயவிவரமும் உண்மையானதாக இருந்தது. பயணத்தின் முழுவதும் ஆதரவு குழு உதவிகரமாக இருந்தது.' : 'As a traditional family, we valued the personal verification process. Every profile we viewed was genuine. The support team was helpful throughout our journey. We found our perfect match within the Tamil community we value so much.',
      quote: language === "ta" ? 'பாரம்பரிய மதிப்புகளும் நவீன வசதியும் சேர்ந்த சிறந்த அனுபவம்!' : 'Traditional values meeting modern convenience - perfect!',
    },
    {
      id: 6,
      names: language === "ta" ? 'கவிதா & ரமேஷ்' : 'Kavitha & Ramesh',
      location: language === "ta" ? 'அமெரிக்கா, 2025' : 'USA, 2025',
      story: language === "ta" ? 'அமெரிக்காவில் வாழ்ந்தாலும், எங்கள் தமிழ் வேர்களுடன் இணைந்திருக்க விரும்பினோம். எங்கள் இரட்டை அடையாளத்தைப் புரிந்துகொள்ளும் துணையை AV மேட்ரிமோனி கண்டுபிடிக்க உதவியது.' : 'Living in the USA, we wanted to stay connected to our Tamil roots. AV Matrimony helped us find partners who understood our dual identity. The platform\'s global reach connected us with someone from our community living abroad.',
      quote: language === "ta" ? 'வெளிநாட்டில் எதிர்காலத்தை கட்டியெழுப்பும் போதும் எங்கள் வேர்களுடன் இணைந்திருப்பது.' : 'Staying connected to our roots while building a future abroad.',
    },
  ];

  const testimonials = [
    {
      name: language === "ta" ? 'சரவணன் குடும்பம்' : 'Saravanan Family',
      relation: language === "ta" ? 'பெற்றோர்' : 'Parents',
      text: language === "ta" ? 'பெற்றோர்களாக, எங்கள் மகளுக்கு சரியான பொருத்தத்தைப் பெறுவது மிக முக்கியம். AV தமிழ் மேட்ரிமோனியின் சரிபார்ப்பு செயல்முறை மற்றும் குடும்ப மைய அணுகுமுறை எங்களுக்கு தேவைப்பட்ட நம்பிக்கையை வழங்கியது.' : 'As parents, finding the right match for our daughter was paramount. AV Tamil Matrimony\'s verification process and family-centered approach gave us the confidence we needed. Highly recommended!',
    },
    {
      name: language === "ta" ? 'ஜானகி கிருஷ்ணன்' : 'Janaki Krishnan',
      relation: language === "ta" ? 'உறுப்பினர்' : 'User',
      text: language === "ta" ? 'ஆன்லைன் மேட்ரிமோனியைப் பற்றி எனக்கு சந்தேகம் இருந்தது, ஆனால் AV என் எண்ணத்தை மாற்றியது. சுயவிவரங்கள் உண்மையானவை, செயல்முறை மரியாதையானது, மற்றும் ஆதரவு குழு எப்போதும் உதவத் தயாராக இருந்தது.' : 'I was skeptical about online matrimony, but AV changed my perspective. The profiles are genuine, the process is respectful, and the support team is always available to help.',
    },
    {
      name: language === "ta" ? 'முருகன் & லட்சுமி' : 'Murugan & Lakshmi',
      relation: language === "ta" ? 'திருமணமான ஜோடி' : 'Married Couple',
      text: language === "ta" ? 'AV தமிழ் மேட்ரிமோனி மூலம் சந்தித்த பிறகு கடந்த ஆண்டு நாங்கள் திருமணம் செய்துகொண்டோம். எங்கள் குடும்பங்கள் இணைந்து பேசுவதற்கு தளம் மிகவும் உதவிகரமாக இருந்தது.' : 'We got married last year after meeting through AV Tamil Matrimony. The platform made it easy for our families to connect and communicate. Thank you for bringing us together!',
    },
  ];

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="public" activeLink="stories" viewer={viewer} />

        <section className="section-shell section-block pt-4 md:pt-6">
          <div className="hero-surface p-6 text-center md:p-10 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-pill">{language === "ta" ? "உண்மையான இணைப்புகள்" : "Real connections"}</span>
              <h1 className="mt-5 text-4xl text-slate-900 md:text-5xl lg:text-[4rem]">
                {t("stories.title")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
                {t("stories.desc")}
              </p>
            </motion.div>

            {/* Stories banner image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 overflow-hidden rounded-[1.5rem] border border-[#B91C1C]/10 bg-[#f5ece0] shadow-[0_18px_36px_rgba(15,23,42,0.07)]"
            >
              <img
                src="/images/stories-banner.png"
                alt={language === "ta" ? "தமிழ் திருமண கோலம் அலங்காரம்" : "Traditional Tamil kolam wedding decoration"}
                className="aspect-[16/5] w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            </motion.div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <div className="stat-surface text-center">
                  <div className="font-display text-3xl text-[#B91C1C] md:text-4xl">2,500+</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{t("stories.successful.marriages")}</div>
                </div>
              </div>
              <div>
                <div className="stat-surface text-center">
                  <div className="font-display text-3xl text-[#B91C1C] md:text-4xl">50+</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{t("stories.countries.connected")}</div>
                </div>
              </div>
              <div>
                <div className="stat-surface text-center">
                  <div className="font-display text-3xl text-[#B91C1C] md:text-4xl">95%</div>
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
                    <div className="font-display text-lg text-[#B91C1C]">
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
            <div className="mb-8 md:mb-10">
              <span className="section-label">{language === "ta" ? "நம்பிக்கையின் குரல்கள்" : "Voices of trust"}</span>
              <h2 className="mt-3 text-3xl text-slate-900 md:text-4xl">
                {t("stories.testimonials.title")}
              </h2>
              <p className="mt-3 text-base text-slate-500">
                {t("stories.testimonials.subtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="panel-muted p-5 md:p-6">
                  <div className="mb-3.5 h-[1.5px] w-8 rounded-full bg-[#B91C1C]/35" />
                  <p className="text-sm italic leading-relaxed text-slate-600">{testimonial.text}</p>
                  <div className="mt-4 border-t border-slate-100/80 pt-4">
                    <div className="font-display text-base text-[#B91C1C]">
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
            <h2 className="text-3xl text-slate-900 md:text-4xl">
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
