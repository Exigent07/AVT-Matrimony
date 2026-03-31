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
    small: "h-11 w-11 sm:h-12 sm:w-12",
    medium: "h-14 w-14 md:h-16 md:w-16",
    large: "h-20 w-20 md:h-24 md:w-24",
  };
  const imageSizes = {
    small: "48px",
    medium: "64px",
    large: "96px",
  };

  const textSizeClasses = {
    small: { name: "text-[14px]", tagline: "text-[10px]" },
    medium: { name: "text-[17px]", tagline: "text-[11px]" },
    large: { name: "text-[2rem]", tagline: "text-[13px]" },
  };

  const textColor = variant === "dark" ? "text-white" : "text-slate-900";
  const taglineColor = variant === "dark" ? "text-white/55" : "text-slate-500";
  const frameClass =
    variant === "dark"
      ? "from-[#fbf7f0] to-[#efe6d6] ring-white/10"
      : "from-white to-[#f7f1e6] ring-[#B91C1C]/10";

  return (
    <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
      <div className={`${sizeClasses[size]} relative shrink-0`}>
        <div
          className={`relative h-full w-full overflow-hidden rounded-[1.15rem] bg-gradient-to-br shadow-[0_14px_30px_rgba(15,23,42,0.18)] ring-1 ${frameClass}`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[0.95rem] bg-white/84">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_60%)]" />
          </div>
          <Image
            src="/images/avt-logo.png"
            alt="AV Tamil Matrimony Logo"
            fill
            sizes={imageSizes[size]}
            className="object-contain"
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
