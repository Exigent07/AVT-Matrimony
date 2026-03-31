"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/shared/PageTransition";
import { useLanguage } from "@/providers/LanguageProvider";
import type { SessionViewer } from "@/types/domain";

interface LegalSection {
  title: string;
  body: string[];
}

interface LegalPageProps {
  variant: "privacy" | "terms";
  viewer?: SessionViewer | null;
}

export function LegalPage({
  variant,
  viewer,
}: LegalPageProps) {
  const { language } = useLanguage();
  const content: Record<LegalPageProps["variant"], { badge: string; title: string; introduction: string; sections: LegalSection[] }> = language === "ta"
    ? {
        privacy: {
          badge: "தனியுரிமைக் கொள்கை",
          title: "AV தமிழ் மேட்ரிமோனி உறுப்பினர் தரவை எப்படி கையாளுகிறது",
          introduction: "இந்த தயாரிப்பு வடிவம் உறுப்பினர் தகவலை தனிப்பட்டதாகவும், பரிசீலிக்கக்கூடியதாகவும், நினைத்தபடி பகிரப்படக்கூடியதாகவும் வைத்திருக்க வடிவமைக்கப்பட்டது. கீழேயுள்ள கொள்கை சுயவிவர, ஆதரவு, மற்றும் பரிசீலனை தரவு பயன்பாட்டுக்குள் எப்படி கையாளப்படுகிறது என்பதை விளக்குகிறது.",
          sections: [
            {
              title: "நாங்கள் சேகரிப்பது",
              body: [
                "நீங்கள் வழங்கத் தேர்ந்தெடுக்கும் சுயவிவர விவரங்கள், தொடர்பு தகவல், சமூக விவரங்கள், விருப்பங்கள், மற்றும் நீங்கள் சமர்ப்பிக்கும் ஆதரவு அல்லது பாதுகாப்பு புகார்களை நாங்கள் சேகரிக்கிறோம்.",
                "சேவையை இயக்க தேவையான பாதுகாப்பான அமர்வு பதிவுகள், சுயவிவர பரிசீலனை நிலை, ஆதரவு டிக்கெட் வரலாறு, மற்றும் ஆர்வக் கோரிக்கை செயல்பாடு போன்ற செயல்பாட்டு தரவையும் நாங்கள் சேமிக்கிறோம்.",
              ],
            },
            {
              title: "உங்கள் தகவலை எவ்வாறு பயன்படுத்துகிறோம்",
              body: [
                "உங்கள் கணக்கை உருவாக்கவும் பராமரிக்கவும், சுயவிவர கண்டுபிடிப்பை இயக்கவும், உறுப்பினர் சமர்ப்பிப்புகளை மதிப்பாய்வு செய்யவும், மற்றும் பாதுகாப்பான அறிமுகங்களை ஆதரிக்கவும் உங்கள் தகவல் பயன்படுத்தப்படுகிறது.",
                "தொடர்பு விவரங்கள் பொதுவில் காட்டப்படாது. ஆர்வக் கோரிக்கை ஏற்கப்பட்டு நிர்வாகி அணுகலை வெளியிட்ட பின் மட்டுமே அவை தெரியும்.",
              ],
            },
            {
              title: "பாதுகாப்பு மற்றும் பரிசீலனை",
              body: [
                "சுயவிவர திருத்தங்கள், ஆதரவு டிக்கெட்டுகள், மற்றும் பாதுகாப்பு புகார்கள் நிர்வாகிகளால் மதிப்பாய்வு செய்யப்படலாம், இதனால் உறுப்பினர் பட்டியல் துல்லியமானதும் மரியாதையானதும் நம்பகமானதும் ஆகும்.",
                "ஒரு கணக்கு தடுக்கப்பட்டாலோ, நிராகரிக்கப்பட்டாலோ, அல்லது தவறாகப் பயன்படுத்தியதற்காக புகாரிடப்பட்டாலோ, தொடர்புடைய தரவு பரிசீலனை, இணக்கம், மற்றும் ஆய்வுக்காக சேமிக்கப்படலாம்.",
              ],
            },
            {
              title: "உங்கள் தேர்வுகள்",
              body: [
                "உறுப்பினர் பலகையிலிருந்து நீங்கள் எப்போது வேண்டுமானாலும் உங்கள் சுயவிவர விவரங்களை புதுப்பிக்கலாம். பெரிய திருத்தங்கள் மீண்டும் மற்ற உறுப்பினர்களுக்கு காட்டப்படுவதற்கு முன் பரிசீலனை வரிசைக்கு திரும்பக்கூடும்.",
                "கணக்கு உதவி தேவையானால், உதவி மையத்தின் மூலம் ஆதரவைத் தொடர்புகொள்ளுங்கள்; நிர்வாகி உங்கள் சுயவிவரம் அல்லது அணுகல் கோரிக்கையில் உதவுவார்.",
              ],
            },
          ],
        },
        terms: {
          badge: "சேவை விதிமுறைகள்",
          title: "மேடையைப் பயன்படுத்துவதற்கான உறுப்பினர் எதிர்பார்ப்புகள்",
          introduction: "இந்த விதிமுறைகள் உறுப்பினர்களும் நிர்வாகிகளும் பயன்பாட்டைப் பயன்படுத்தும் முறையை நிர்வகிக்கின்றன. சரிபார்ப்பு, பரிசீலனை, ஆதரவு, மற்றும் கட்டுப்படுத்தப்பட்ட தொடர்பு பகிர்வு உள்ளிட்ட தற்போதைய தயாரிப்பு நடத்தைக்கு ஏற்ப இவை எழுதப்பட்டுள்ளன.",
          sections: [
            {
              title: "சேவையின் பயன்பாடு",
              body: [
                "உறுப்பினர்கள் துல்லியமான சுயவிவர தகவலை வழங்கி, சட்டபூர்வமான திருமண அறிமுகங்களுக்காக மட்டுமே தளத்தைப் பயன்படுத்த வேண்டும்.",
                "சுயவிவர அங்கீகாரம், நிராகரம், தடை, மற்றும் தொடர்பு வெளியீடு போன்ற நிர்வாகச் செயல்கள் தளத்தில் நம்பிக்கையை பாதுகாக்கும் தயாரிப்பு நடைமுறையின் ஓர் அங்கமாகும்.",
              ],
            },
            {
              title: "கணக்கு பொறுப்புகள்",
              body: [
                "உங்கள் உள்நுழைவு நற்சான்றுகளை ரகசியமாக வைத்திருப்பதும், கணக்கிலுள்ள தகவல் புதுப்பிக்கப்பட்டதுமாகவும் உண்மையானதுமாகவும் இருப்பதையும் உறுதி செய்வதும் உங்கள் பொறுப்பு.",
                "தவறான தகவல், அவமதிப்பு உள்ளடக்கம், தொந்தரவு, அல்லது மோசடி செயல்பாடுகள் உள்ள கணக்குகள் முன்னறிவிப்பு இல்லாமல் இடைநிறுத்தப்படலாம் அல்லது நீக்கப்படலாம்.",
              ],
            },
            {
              title: "ஆர்வம் மற்றும் தொடர்பு நடைமுறை",
              body: [
                "ஆர்வக் கோரிக்கை அனுப்புவது தொடர்பு அணுகலை உறுதிப்படுத்தாது. பெறுநர் கோரிக்கையை ஏற்றுக்கொண்டு நிர்வாகி இணைப்பை வெளியிட்ட பின் மட்டுமே தொடர்பு தகவல் பகிரப்படும்.",
                "பரிசீலனையை தாண்ட முயற்சிகள், தொடர்பு விவரங்களை தவறாகப் பயன்படுத்துதல், அல்லது பிற உறுப்பினர்களுக்கு அழுத்தம் கொடுத்தல் ஆகியவை கணக்கு நடவடிக்கைக்கான காரணங்களாகும்.",
              ],
            },
            {
              title: "ஆதரவு மற்றும் புகாரளித்தல்",
              body: [
                "உறுப்பினர்கள் உதவி மையத்தைப் பயன்படுத்தி ஆதரவைத் தொடர்புகொள்ளவோ அல்லது சந்தேகமான சுயவிவரங்களைப் புகார் செய்யவோ முடியும். புகார்கள் தயாரிப்பிற்குள் இருக்கும் நிர்வாகி பாதுகாப்பு நடைமுறையின் மூலம் மதிப்பாய்வு செய்யப்படுகின்றன.",
                "சேவையைப் பயன்படுத்துவதன் மூலம், உறுப்பினர் பாதுகாப்பு மற்றும் தயாரிப்பு ஒருமைப்பாட்டை காக்க பரிசீலனை முடிவுகள் எடுக்கப்படலாம் என்பதை நீங்கள் ஏற்கிறீர்கள்.",
              ],
            },
          ],
        },
      }
    : {
        privacy: {
          badge: "Privacy Policy",
          title: "How AV Tamil Matrimony handles member data",
          introduction: "This local product build is designed to keep member information private, reviewable, and intentionally shared. The policy below explains how profile, support, and moderation data are handled inside the application.",
          sections: [
            {
              title: "What we collect",
              body: [
                "We collect the profile details you choose to provide, including name, contact information, community details, preferences, and any support or safety reports you submit.",
                "We also store operational data needed to run the service, such as secure session records, profile review status, support ticket history, and interest request activity.",
              ],
            },
            {
              title: "How we use your information",
              body: [
                "Your information is used to create and maintain your account, power profile discovery, review member submissions, and support safe introductions between members.",
                "Contact details are not exposed publicly. They are only made visible when an interest request has been accepted and an administrator releases contact access.",
              ],
            },
            {
              title: "Safety and moderation",
              body: [
                "Profile edits, support tickets, and safety reports may be reviewed by administrators so the member directory remains accurate, respectful, and trustworthy.",
                "If an account is blocked, rejected, or reported for abuse, related data may be retained for moderation, compliance, and audit purposes.",
              ],
            },
            {
              title: "Your choices",
              body: [
                "You can update your profile details at any time from the member dashboard. Major edits may return the profile to the review queue before it is shown to other members again.",
                "If you need account help, contact support through the Help Center so an administrator can assist with profile or access requests.",
              ],
            },
          ],
        },
        terms: {
          badge: "Terms of Service",
          title: "Member expectations for using the platform",
          introduction: "These terms govern how members and administrators use the application. They are written to match the current product behavior, including verification, moderation, support, and controlled contact sharing.",
          sections: [
            {
              title: "Using the service",
              body: [
                "Members are expected to provide accurate profile information and use the platform only for legitimate matrimonial introductions.",
                "Administrator actions such as profile approval, rejection, blocking, and contact release are part of the product workflow and are used to preserve trust across the directory.",
              ],
            },
            {
              title: "Account responsibilities",
              body: [
                "You are responsible for keeping your login credentials private and for ensuring the information in your account remains current and truthful.",
                "Accounts that contain misleading information, abusive content, harassment, or fraudulent activity may be suspended or removed without notice.",
              ],
            },
            {
              title: "Interest and contact workflow",
              body: [
                "Sending an interest request does not guarantee contact access. Contact information is shared only after the recipient accepts the request and an administrator releases the connection.",
                "Attempts to bypass moderation, misuse contact details, or pressure other members are grounds for account action.",
              ],
            },
            {
              title: "Support and reporting",
              body: [
                "Members can use the Help Center to contact support or report suspicious profiles. Reports are reviewed through the administrator safety workflow inside the product.",
                "By using the service, you agree that moderation decisions may be made to protect member safety and product integrity.",
              ],
            },
          ],
        },
      };
  const page = content[variant];

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="public" viewer={viewer} />

        <main className="section-shell-narrow section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <span className="section-label">{page.badge}</span>
            <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>{page.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{page.introduction}</p>
          </section>

          <section className="mt-5 space-y-4">
            {page.sections.map((section) => (
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
