"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/providers/LanguageProvider";

interface LanguageToggleProps {
  variant?: "dark" | "light" | "nav-inline";
}

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "nav-inline") {
    const activeClass = "text-white";
    const inactiveClass = "text-gray-400 hover:text-gray-100";

    return (
      <div
        className="inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5"
        role="group"
        aria-label="Language switch"
      >
        <button
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          className={`text-sm font-semibold transition-colors ${
            language === "en" ? activeClass : inactiveClass
          }`}
        >
          EN
        </button>
        <span className="h-4 w-px bg-white/[0.12]" aria-hidden="true" />
        <button
          onClick={() => setLanguage("ta")}
          aria-pressed={language === "ta"}
          className={`text-sm font-semibold transition-colors ${
            language === "ta" ? activeClass : inactiveClass
          }`}
        >
          தமிழ்
        </button>
      </div>
    );
  }

  const bgClass =
    variant === "dark"
      ? "border border-white/[0.08] bg-white/[0.05]"
      : "border border-[#B91C1C]/10 bg-white/85";
  const activeText = "text-[#B91C1C]";
  const inactiveText =
    variant === "dark"
      ? "text-gray-400 hover:text-white"
      : "text-slate-500 hover:text-slate-900";

  return (
    <div className={`relative flex h-10 items-center overflow-hidden rounded-full p-1 ${bgClass}`}>
      <motion.div
        className="absolute inset-y-1 rounded-full bg-white shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
        initial={false}
        animate={{
          left: language === "en" ? "4px" : "50%",
          width: "calc(50% - 4px)",
        }}
        transition={{ type: "spring", stiffness: 520, damping: 36 }}
      />
      <button
        onClick={() => setLanguage("en")}
        className={`relative z-10 w-1/2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
          language === "en" ? activeText : inactiveText
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage("ta")}
        className={`relative z-10 w-1/2 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
          language === "ta" ? activeText : inactiveText
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
}
