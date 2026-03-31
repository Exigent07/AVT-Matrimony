"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Loader2, ShieldCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { InputControl } from "@/components/shared/FormControls";
import { PageTransition } from "@/components/shared/PageTransition";
import { Logo } from "@/components/shared/Logo";
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
        <div className="section-shell flex min-h-[calc(100vh-4rem)] items-center">
          <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_0.8fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="hidden lg:block"
            >
              <div className="hero-surface h-full p-8 xl:p-10">
                <span className="eyebrow-pill">{language === "ta" ? "உறுப்பினர் உள்நுழைவு" : "Member sign in"}</span>
                <div className="mt-8 max-w-lg">
                  <h1 className="text-5xl text-slate-900 xl:text-[4rem]" style={{ fontFamily: "var(--font-display)" }}>
                    {language === "ta" ? "தெளிவுடன் உங்கள் பொருத்தப் பயணத்தை தொடருங்கள்." : "Continue your match journey with clarity."}
                  </h1>
                  <p className="mt-5 text-base leading-relaxed text-slate-600 xl:text-lg">
                    {language === "ta"
                      ? "நீங்கள் நிறுத்திய இடத்திலிருந்து தொடருங்கள், சுயவிவரச் செயல்பாட்டைப் பார்வையிட்டு, நம்பிக்கையுடன் நல்ல இணைப்புகளை முன்னேற்றுங்கள்."
                      : "Pick up where you left off, review profile activity, and move promising connections forward with confidence."}
                  </p>
                </div>

                <div className="mt-10 grid gap-4">
                  {highlights.map((item) => (
                    <div key={item.title} className="panel-muted p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                          {item.icon === Heart ? (
                            <AnimatedHeartIcon className="h-5 w-5" active />
                          ) : (
                            <item.icon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="text-lg text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                            {item.title}
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="w-full max-w-[460px] lg:justify-self-end">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-6 flex items-center justify-between"
          >
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-full border border-[#B91C1C]/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("login.back.to.home")}</span>
            </button>
            <Link href="/">
              <Logo size="medium" showText={false} variant="light" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="panel-surface p-7 sm:p-8"
          >
            <div className="section-label">{language === "ta" ? "மீண்டும் வரவேற்கிறோம்" : "Welcome back"}</div>
            <h1 className="mt-3 text-4xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
              {t("common.login")}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              {t("login.welcome.back")}
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
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5"
                  placeholder={language === "ta" ? "பெயர்@உதாரணம்.com" : "name@example.com"}
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
                <InputControl
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1.5"
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

            <div className="mt-6 text-center text-sm text-slate-500">
              {t("login.no.account.text")}{" "}
              <Link href="/register" className="font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]">
                {t("login.register.here")}
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/admin/login"
                className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
              >
                {language === "ta" ? "நிர்வாகி உள்நுழைவு" : "Administrator sign in"}
              </Link>
            </div>
          </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
