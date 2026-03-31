"use client";

import Image from "next/image";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  showTagline?: boolean;
  siteName?: string;
  tagline?: string;
  variant?: "dark" | "light";
}

export function Logo({
  size = "medium",
  showText = true,
  showTagline = true,
  siteName = "AV Tamil Matrimony",
  tagline = "திருமண சேவை",
  variant = "dark",
}: LogoProps) {
  const sizeClasses = {
    small: "h-9 w-9",
    medium: "h-12 w-12",
    large: "h-20 w-20",
  };

  const textSizeClasses = {
    small: { name: "text-[13px]", tagline: "text-[10px]" },
    medium: { name: "text-[15px]", tagline: "text-[10px]" },
    large: { name: "text-2xl", tagline: "text-sm" },
  };

  const textColor = variant === "dark" ? "text-white" : "text-slate-900";
  const taglineColor = variant === "dark" ? "text-white/55" : "text-slate-500";
  const frameClass =
    variant === "dark"
      ? "from-[#fbf7f0] to-[#efe6d6] ring-white/10"
      : "from-white to-[#f7f1e6] ring-[#B91C1C]/10";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={`${sizeClasses[size]} relative shrink-0`}>
        <div
          className={`relative h-full w-full overflow-hidden rounded-[1rem] bg-gradient-to-br p-1 shadow-[0_12px_28px_rgba(15,23,42,0.18)] ring-1 ${frameClass}`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[0.8rem] bg-white/80">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_60%)]" />
          </div>
          <Image
            src="/images/avt-logo.png"
            alt="AV Tamil Matrimony Logo"
            fill
            sizes="80px"
            className="object-contain p-0.5"
          />
        </div>
      </div>

      {showText && (
        <div className="min-w-0">
          <div
            className={`${textSizeClasses[size].name} ${textColor} truncate font-semibold leading-none tracking-[-0.02em]`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {siteName}
          </div>
          {showTagline ? (
            <div className={`${textSizeClasses[size].tagline} ${taglineColor} mt-1 flex items-center gap-1.5 leading-tight`}>
              <span className="h-1 w-1 rounded-full bg-[#B91C1C]" />
              <span className="truncate">{tagline}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
