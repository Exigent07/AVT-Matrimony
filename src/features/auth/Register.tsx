"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { PageTransition } from "@/components/shared/PageTransition";
import { Logo } from "@/components/shared/Logo";
import { requestJson } from "@/lib/client-request";
import { isAdult, normalizePhone } from "@/lib/profile-utils";
import { useLanguage } from "@/providers/LanguageProvider";
import Link from "next/link";

const stepLabels = [
  "Basic details",
  "Account details",
  "Profile summary",
];

const stepDescriptions = [
  "Tell us who the profile is for and capture the essentials.",
  "Secure the account with contact details and a password.",
  "Complete the first summary so the profile is ready for review.",
];

function buildHeightOptions() {
  return Array.from({ length: 16 }, (_, index) => {
    const cm = 150 + index * 2;
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}" (${cm} cm)`;
  });
}

export function Register() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    profileFor: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    community: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    height: "",
    maritalStatus: "",
    education: "",
    occupation: "",
    income: "",
    city: "",
    state: "",
    caste: "",
  });

  const heightOptions = useMemo(() => buildHeightOptions(), []);

  function updateField<K extends keyof typeof formData>(key: K, value: string) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function validateCurrentStep() {
    if (step === 1) {
      if (
        !formData.profileFor ||
        !formData.fullName ||
        !formData.gender ||
        !formData.dateOfBirth
      ) {
        toast.error("Please complete all required fields in this step.");
        return false;
      }

      if (!isAdult(formData.dateOfBirth)) {
        toast.error("You must be at least 18 years old to register.");
        return false;
      }
    }

    if (step === 2) {
      if (
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("Please complete your account details.");
        return false;
      }

      if (!formData.email.includes("@")) {
        toast.error("Enter a valid email address.");
        return false;
      }

      if (normalizePhone(formData.phone).length !== 10) {
        toast.error("Enter a valid 10-digit phone number.");
        return false;
      }

      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }
    }

    if (step === 3) {
      if (
        !formData.height ||
        !formData.maritalStatus ||
        !formData.education ||
        !formData.occupation ||
        !formData.city ||
        !formData.state ||
        !formData.caste
      ) {
        toast.error("Please complete your profile summary.");
        return false;
      }
    }

    return true;
  }

  async function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    if (step < 3) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);

    try {
      await requestJson("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success("Your profile has been created.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create your profile.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell px-4 py-8 sm:px-6 sm:py-10">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.48fr_0.95fr] lg:gap-10">
            <div className="hidden lg:block">
              <div className="hero-surface h-full p-8 xl:p-10">
                <span className="eyebrow-pill">Create your profile</span>
                <div className="mt-8">
                  <h1 className="text-5xl text-slate-900 xl:text-[4rem]" style={{ fontFamily: "var(--font-display)" }}>
                    Build a profile that feels trustworthy from the start.
                  </h1>
                  <p className="mt-5 text-base leading-relaxed text-slate-600 xl:text-lg">
                    We guide you through the essentials first so your profile reaches review with
                    the right information and a cleaner structure.
                  </p>
                </div>

                <div className="mt-10 grid gap-4">
                  {stepLabels.map((label, index) => {
                    const position = index + 1;
                    const active = position === step;
                    const complete = position < step;

                    return (
                      <div
                        key={label}
                        className={`rounded-[1.5rem] border px-5 py-5 transition-all ${
                          active
                            ? "border-[#B91C1C]/18 bg-white shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
                            : "border-[#B91C1C]/10 bg-[#B91C1C]/[0.04]"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
                              complete
                                ? "bg-emerald-600 text-white"
                                : active
                                  ? "bg-[#B91C1C] text-white"
                                  : "bg-white text-slate-500"
                            }`}
                          >
                            {complete ? <Check className="h-4 w-4" /> : position}
                          </div>
                          <div>
                            <div className="text-lg text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                              {label}
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                              {stepDescriptions[index]}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <button
              onClick={() => {
                if (step === 1) {
                  router.push("/");
                  return;
                }
                setStep((current) => current - 1);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#B91C1C]/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{step === 1 ? t("register.back.to.home") : t("register.back.to.previous")}</span>
            </button>
            <Link href="/">
              <Logo size="small" showText={false} variant="light" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel-surface p-6 sm:p-8 md:p-10"
          >
            <div className="section-label">Guided registration</div>
            <h1 className="mt-3 text-4xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
              {t("register.title")}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Complete the essentials so we can create a verified, review-ready profile.
            </p>

            <div className="mt-7">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  className="h-1.5 rounded-full bg-[#B91C1C]"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                {stepLabels.map((label, index) => {
                  const position = index + 1;
                  const active = position === step;
                  const complete = position < step;

                  return (
                    <div
                      key={label}
                      className={`rounded-2xl border px-3 py-3 sm:px-4 sm:py-3.5 ${
                        active
                          ? "border-[#B91C1C]/16 bg-[#B91C1C]/[0.05]"
                          : "border-slate-200/80 bg-slate-50/70"
                      }`}
                    >
                      <div
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                          complete
                            ? "bg-emerald-600 text-white"
                            : active
                              ? "bg-[#B91C1C] text-white"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {complete ? <Check className="h-3.5 w-3.5" /> : position}
                      </div>
                      <div className="mt-2 text-[13px] font-medium text-slate-700">{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleContinue} className="mt-7 space-y-5">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Field label={t("register.profile.for")}>
                      <select
                        value={formData.profileFor}
                        onChange={(event) => updateField("profileFor", event.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">{t("register.select")}</option>
                        <option value="self">{t("register.self")}</option>
                        <option value="son">{t("register.son")}</option>
                        <option value="daughter">{t("register.daughter")}</option>
                        <option value="brother">{t("register.brother")}</option>
                        <option value="sister">{t("register.sister")}</option>
                        <option value="friend">{t("register.friend")}</option>
                        <option value="relative">{t("register.relative")}</option>
                      </select>
                    </Field>

                    <Field label={t("register.full.name")}>
                      <input
                        value={formData.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.gender")}>
                      <select
                        value={formData.gender}
                        onChange={(event) => updateField("gender", event.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">{t("register.select")}</option>
                        <option value="male">{t("register.gender.male")}</option>
                        <option value="female">{t("register.gender.female")}</option>
                      </select>
                    </Field>

                    <Field label={t("register.dob")}>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(event) => updateField("dateOfBirth", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.community")} className="sm:col-span-2">
                      <input
                        value={formData.community}
                        onChange={(event) => updateField("community", event.target.value)}
                        className="input-field"
                        placeholder="Tamil community or family background"
                      />
                    </Field>
                  </motion.div>
                ) : null}

                {step === 2 ? (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Field label={t("register.email")}>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.phone")}>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        className="input-field"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </Field>

                    <Field label={t("register.password")}>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(event) => updateField("password", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.confirm.password")}>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(event) => updateField("confirmPassword", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>
                  </motion.div>
                ) : null}

                {step === 3 ? (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Field label={t("register.height")}>
                      <select
                        value={formData.height}
                        onChange={(event) => updateField("height", event.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">{t("register.select")}</option>
                        {heightOptions.map((height) => (
                          <option key={height} value={height}>
                            {height}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label={t("register.marital.status")}>
                      <select
                        value={formData.maritalStatus}
                        onChange={(event) => updateField("maritalStatus", event.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">{t("register.select")}</option>
                        <option value="Never Married">{t("register.never.married")}</option>
                        <option value="Divorced">{t("register.divorced")}</option>
                        <option value="Widowed">{t("register.widowed")}</option>
                      </select>
                    </Field>

                    <Field label={t("register.education")}>
                      <input
                        value={formData.education}
                        onChange={(event) => updateField("education", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.occupation")}>
                      <input
                        value={formData.occupation}
                        onChange={(event) => updateField("occupation", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.annual.income")}>
                      <input
                        value={formData.income}
                        onChange={(event) => updateField("income", event.target.value)}
                        className="input-field"
                        placeholder="Example: ₹10-12 Lakhs"
                      />
                    </Field>

                    <Field label={t("register.city")}>
                      <input
                        value={formData.city}
                        onChange={(event) => updateField("city", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.state")}>
                      <input
                        value={formData.state}
                        onChange={(event) => updateField("state", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>

                    <Field label={t("register.caste")}>
                      <input
                        value={formData.caste}
                        onChange={(event) => updateField("caste", event.target.value)}
                        className="input-field"
                        required
                      />
                    </Field>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                disabled={isLoading}
                type="submit"
                className="btn-primary mt-2 w-full py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("register.creating.profile")}</span>
                  </>
                ) : (
                  <span>{step === 3 ? t("register.create.profile") : t("register.continue")}</span>
                )}
              </button>
            </form>
          </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-[13px] font-medium text-slate-600">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
