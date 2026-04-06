"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, FileCheck, Loader2, Shield, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { InputControl } from "@/components/shared/FormControls";
import { PageTransition } from "@/components/shared/PageTransition";
import { requestJson } from "@/lib/client-request";
import { useLanguage } from "@/providers/LanguageProvider";
import { Logo } from "@/components/shared/Logo";

export function AdminLogin() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const adminHighlights = [
    {
      icon: FileCheck,
      title: language === "ta" ? "சுயவிவர பரிசீலனை" : "Profile moderation",
      description: language === "ta" ? "புதிய மற்றும் புதுப்பிக்கப்பட்ட உறுப்பினர் சுயவிவரங்களை அங்கீகாரத்திற்கு முன் பரிசீலிக்கவும்." : "Review new and updated member profiles before approval.",
    },
    {
      icon: ShieldAlert,
      title: language === "ta" ? "பாதுகாப்பு நடைமுறை" : "Safety workflow",
      description: language === "ta" ? "ஒரே கட்டுப்பாட்டு பலகையிலிருந்து புகார்கள், சந்தேகத்திற்குரிய செயல்பாடுகள் மற்றும் ஆதரவு பின்தொடர்வுகளை கண்காணிக்கவும்." : "Track reports, suspicious activity, and support follow-ups from one console.",
    },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await requestJson("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      toast.success(language === "ta" ? "நிர்வாகி அணுகல் வழங்கப்பட்டது." : "Administrator access granted.");
      router.push("/admin/dashboard");
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
                <span className="eyebrow-pill">{language === "ta" ? "நிர்வாகி அணுகல்" : "Administrator access"}</span>
                <div className="mt-8 max-w-lg">
                  <h1 className="text-5xl text-slate-900 xl:text-[4rem]" style={{ fontFamily: "var(--font-display)" }}>
                    {language === "ta" ? "மேடையை தெளிவான கட்டுப்பாட்டு அனுபவத்துடன் இயக்குங்கள்." : "Operate the platform with a clearer control surface."}
                  </h1>
                  <p className="mt-5 text-base leading-relaxed text-slate-600 xl:text-lg">
                    {language === "ta"
                      ? "உறுப்பினர் செயல்பாட்டைப் பார்வையிட, பரிசீலனை வரிசைகளைச் சீர்செய்ய, மற்றும் ஆதரவு மற்றும் பாதுகாப்பு நடைமுறைகளை மென்மையாக நகர்த்த உள்நுழையவும்."
                      : "Sign in to review member activity, resolve moderation queues, and keep support and safety workflows moving smoothly."}
                  </p>
                </div>

                <div className="mt-10 grid gap-4">
                  {adminHighlights.map((item) => (
                    <div key={item.title} className="panel-muted p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                          <item.icon className="h-5 w-5" />
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
                  onClick={() => router.push("/login")}
                  className="btn-nav-back"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{language === "ta" ? "உறுப்பினர் உள்நுழைவு" : "User sign in"}</span>
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
                <div className="mb-5 flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B91C1C]/15 bg-[#B91C1C]/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B91C1C]">
                    <Shield className="h-3 w-3" />
                    {language === "ta" ? "பாதுகாப்பான நிர்வாகி அணுகல்" : "Secure Admin Access"}
                  </span>
                </div>

                <h1 className="text-4xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  {t("admin.portal.title")}
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {language === "ta" ? "இந்த உள்ளூர் சூழலுக்கு அமைக்கப்பட்ட நிர்வாகி நற்சான்றுகளுடன் உள்நுழையவும்." : "Sign in with the administrator credentials configured for this local environment."}
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div>
                    <label htmlFor="admin-email" className="block text-[13px] font-medium text-slate-600">
                      {language === "ta" ? "மின்னஞ்சல் முகவரி" : "Email address"}
                    </label>
                    <InputControl
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-1.5"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="admin-password" className="block text-[13px] font-medium text-slate-600">
                      {t("admin.password")}
                    </label>
                    <div className="relative mt-1.5">
                      <InputControl
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="pr-11"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn-primary mt-2 w-full py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{language === "ta" ? "உள்நுழைகிறது" : "Signing in"}</span>
                      </>
                    ) : (
                      <span>{t("admin.login.to.panel")}</span>
                    )}
                  </button>
                </form>

                <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
                  {t("admin.security.notice")}
                </p>

                <div className="mt-4 text-center text-sm text-slate-500">
                  {language === "ta" ? "நிர்வாகி அல்லவா?" : "Not an administrator?"}{" "}
                  <Link href="/login" className="font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]">
                    {language === "ta" ? "உறுப்பினர் உள்நுழைவுக்கு திரும்பவும்" : "Return to member sign in"}
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
