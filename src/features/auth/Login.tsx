"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Loader2, ShieldCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { InputControl, PasswordControl } from "@/components/shared/FormControls";
import { PageTransition } from "@/components/shared/PageTransition";
import { requestJson } from "@/lib/client-request";
import { useLanguage } from "@/providers/LanguageProvider";

export function Login() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const highlights = [
    {
      icon: ShieldCheck,
      title: language === "ta" ? "முதலில் சரிபார்க்கப்பட்ட பட்டியல்" : "Verified-first directory",
      description: language === "ta" ? "பெரிய சமூகத்திற்கு காட்சியளிக்கும் முன் சுயவிவரங்கள் பரிசீலிக்கப்படுகின்றன." : "Profiles are reviewed before they become visible to the wider community.",
    },
    {
      icon: Heart,
      title: language === "ta" ? "நோக்கமுள்ள அறிமுகங்கள்" : "Intentional introductions",
      description: language === "ta" ? "ஆர்வக் கோரிக்கைகள் மற்றும் தொடர்பு பகிர்வு திட்டமிட்டதும் குடும்ப நட்புமுறையுடனும் இருக்கும்." : "Interest requests and contact sharing stay deliberate and family-friendly.",
    },
    {
      icon: Users,
      title: language === "ta" ? "தமிழ் குடும்ப கவனம்" : "Tamil family focus",
      description: language === "ta" ? "பொருத்தம், கலாசாரம், மற்றும் நீண்டகால பொருத்தத்தை மையமாகக் கொண்ட அமைதியான அனுபவம்." : "A calmer experience built around compatibility, culture, and long-term fit.",
    },
  ];
  const registerPreview =
    language === "ta"
      ? {
          eyebrow: "புதியவரா?",
          title: "பதிவு செய்து சுயவிவரத்தை தொடங்குங்கள்",
          description:
            "கணக்கை உருவாக்கி, அடிப்படை விவரங்களை நிரப்பி, வழிநடத்தப்பட்ட உறுப்பினர் பயணத்தைத் தொடங்கலாம்.",
          action: "இப்போது பதிவு செய்யவும்",
          mobilePrompt: "கணக்கு இல்லையா?",
          mobileLink: "இங்கே பதிவு செய்யவும்",
        }
      : {
          eyebrow: "New here?",
          title: "Register to start your profile",
          description:
            "Create your account, complete the essentials, and begin your guided member journey.",
          action: "Register now",
          mobilePrompt: "Don't have an account?",
          mobileLink: "Register here",
        };
  const loginCopy =
    language === "ta"
      ? {
          eyebrow: "மீண்டும் வரவேற்கிறோம்",
          title: "உங்கள் பயணத்துக்குள் மீண்டும் நுழையுங்கள்",
          description:
            "டாஷ்போர்டை அணுகி, சுயவிவர பணிகளைத் தொடர்ந்து முடித்து, ஆர்வங்கள் மற்றும் பொருத்த நிலைகளை நம்பிக்கையுடன் முன்னேற்றுங்கள்.",
          emailPlaceholder: "பெயர்@உதாரணம்.com",
          passwordPlaceholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
        }
      : {
          eyebrow: "Welcome back",
          title: "Step back into your journey",
          description:
            "Sign in to access your dashboard, continue profile progress, and move your interests and matches forward with confidence.",
          emailPlaceholder: "name@example.com",
          passwordPlaceholder: "Enter your password",
        };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await requestJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      toast.success(language === "ta" ? "மீண்டும் வரவேற்கிறோம்." : "Welcome back.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : language === "ta" ? "உள்நுழைய முடியவில்லை." : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell px-4 py-8 sm:px-6 sm:py-10">
        <div className="section-shell">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <button onClick={() => router.push("/")} className="btn-nav-back">
              <ArrowLeft className="h-4 w-4" />
              <span>{t("login.back.to.home")}</span>
            </button>
          </motion.div>

          <div className="grid w-full items-stretch gap-8 lg:grid-cols-2 lg:gap-10">

            {/* ── Left panel ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="hidden lg:flex lg:flex-col"
            >
              <div className="hero-surface flex h-full flex-col p-8 xl:p-10">
                <div>
                  <span className="eyebrow-pill">
                    {language === "ta" ? "உறுப்பினர் உள்நுழைவு" : "Member sign in"}
                  </span>
                  <h1 className="mt-8 max-w-lg text-5xl text-slate-900 xl:text-[4rem]">
                    {language === "ta"
                      ? "தெளிவுடன் உங்கள் பொருத்தப் பயணத்தை தொடருங்கள்."
                      : "Continue your match journey with clarity."}
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 xl:text-lg">
                    {language === "ta"
                      ? "நீங்கள் நிறுத்திய இடத்திலிருந்து தொடருங்கள், சுயவிவரச் செயல்பாட்டைப் பார்வையிட்டு, நம்பிக்கையுடன் நல்ல இணைப்புகளை முன்னேற்றுங்கள்."
                      : "Pick up where you left off, review profile activity, and move promising connections forward with confidence."}
                  </p>
                </div>

                {/* Features pushed to bottom */}
                <div className="mt-auto grid gap-3 pt-10">
                  {highlights.map((item) => (
                    <div key={item.title} className="panel-muted p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                          {item.icon === Heart ? (
                            <AnimatedHeartIcon className="h-4.5 w-4.5" active />
                          ) : (
                            <item.icon className="h-4.5 w-4.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-display text-base text-slate-900">
                            {item.title}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Right column ── */}
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="panel-surface flex h-full flex-col p-7 sm:p-8 lg:p-9"
              >
                <div className="section-label">
                  {loginCopy.eyebrow}
                </div>
                <h1 className="mt-3 font-display text-4xl leading-[0.96] text-slate-900 md:text-[3.15rem]">
                  {loginCopy.title}
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
                  {loginCopy.description}
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-medium text-slate-600">
                      {t("login.email")}
                    </label>
                    <InputControl
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5"
                      placeholder={loginCopy.emailPlaceholder}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="password" className="block text-[13px] font-medium text-slate-600">
                        {t("login.password")}
                      </label>
                      <Link
                        href={`/help?tab=contact&subject=${encodeURIComponent(
                          language === "ta" ? "கடவுச்சொல் உதவி" : "Password assistance",
                        )}`}
                        className="text-xs font-medium text-slate-400 transition-colors hover:text-[#B91C1C]"
                      >
                        {language === "ta" ? "கடவுச்சொல் மறந்துவிட்டதா" : "Forgot password"}
                      </Link>
                    </div>
                    <PasswordControl
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1.5"
                      placeholder={loginCopy.passwordPlaceholder}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn-primary mt-2 w-full py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t("login.logging.in")}</span>
                      </>
                    ) : (
                      <span>{t("common.login")}</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500 lg:hidden">
                  {registerPreview.mobilePrompt}{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                  >
                    {registerPreview.mobileLink}
                  </Link>
                </div>

                <div className="mt-auto hidden pt-6 lg:block">
                  <div className="panel-muted flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B91C1C]/[0.08] text-[#B91C1C]">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="section-label">{registerPreview.eyebrow}</div>
                      <div className="mt-1 font-display text-xl text-slate-900">
                        {registerPreview.title}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {registerPreview.description}
                      </p>
                      <div className="mt-4">
                        <Link
                          href="/register"
                          className="btn-ghost px-4 py-2.5 text-sm font-semibold"
                        >
                          {registerPreview.action}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}
