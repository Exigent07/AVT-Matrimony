"use client";

import { motion } from "motion/react";

interface DecorativePatternProps {
  variant?: "top" | "bottom" | "inline";
}

export function DecorativePattern({ variant = "top" }: DecorativePatternProps) {
  if (variant === "inline") {
    return (
      <div className="my-8 flex items-center justify-center gap-3">
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#B91C1C]/30 to-transparent sm:w-28" />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B91C1C]/18 bg-white"
        >
          <div className="h-2 w-2 rotate-45 bg-[#B91C1C]" />
        </motion.div>
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#B91C1C]/30 to-transparent sm:w-28" />
      </div>
    );
  }

  return (
    <div className="relative h-20 w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B91C1C]/22 to-transparent" />

      <svg className="absolute inset-0 h-full w-full opacity-[0.1]" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <defs>
          <pattern id="tamil-pattern" x="0" y="0" width="120" height="80" patternUnits="userSpaceOnUse">
            <circle cx="60" cy="40" r="3" fill="#B91C1C" />
            <circle cx="30" cy="40" r="2" fill="#B91C1C" opacity="0.6" />
            <circle cx="90" cy="40" r="2" fill="#B91C1C" opacity="0.6" />
            <path d="M 50 40 Q 55 30 60 40 T 70 40" stroke="#B91C1C" strokeWidth="0.5" fill="none" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="1200" height="80" fill="url(#tamil-pattern)" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
      >
        <div className="h-px w-10 bg-gradient-to-r from-[#B91C1C]/0 to-[#B91C1C]/30" />
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#B91C1C]/18 bg-white/90">
          <div className="h-2.5 w-2.5 rotate-45 border border-[#B91C1C]/45 bg-[#fbf7f0]" />
        </div>
        <div className="h-px w-10 bg-gradient-to-l from-[#B91C1C]/0 to-[#B91C1C]/30" />
      </motion.div>
    </div>
  );
}
