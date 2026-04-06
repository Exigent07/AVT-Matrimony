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
    small: "h-10 w-10 sm:h-11 sm:w-11",
    medium: "h-14 w-14 md:h-16 md:w-16",
    large: "h-20 w-20 md:h-24 md:w-24",
  };
  const imageSizes = {
    small: "48px",
    medium: "64px",
    large: "96px",
  };
  const textSizeClasses = {
    small: { name: "text-[15px]", tagline: "text-[10px]" },
    medium: { name: "text-[17px]", tagline: "text-[11px]" },
    large: { name: "text-[2rem]", tagline: "text-[13px]" },
  };

  const isDark = variant === "dark";
  const textColor = isDark ? "text-white" : "text-slate-900";
  const taglineColor = isDark ? "text-white/50" : "text-slate-500";

  return (
    <div className="flex min-w-0 items-center gap-3">
      {/* Logo image — transparent PNG, no frame on dark variant */}
      <div className={`${sizeClasses[size]} relative shrink-0`}>
        {isDark ? (
          <Image
            src="/images/avt-logo.png"
            alt="AV Tamil Matrimony"
            fill
            sizes={imageSizes[size]}
            className="object-contain [filter:drop-shadow(0_1px_6px_rgba(185,28,28,0.30))_drop-shadow(0_1px_2px_rgba(0,0,0,0.45))]"
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#B91C1C]/10 bg-gradient-to-br from-white to-[#f7f0e6] shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <Image
              src="/images/avt-logo.png"
              alt="AV Tamil Matrimony"
              fill
              sizes={imageSizes[size]}
              className="object-contain p-1"
            />
          </div>
        )}
      </div>

      {showText && (
        <>
          {/* Thin vertical divider — only on dark nav */}
          {isDark && (
            <div className="h-5 w-px shrink-0 bg-white/15" />
          )}
          <div className="min-w-0">
            <div
              className={`font-display ${textSizeClasses[size].name} ${textColor} truncate font-semibold leading-none tracking-[-0.01em]`}
            >
              {siteName}
            </div>
            {showTagline && (
              <div className={`${textSizeClasses[size].tagline} ${taglineColor} mt-1 flex items-center gap-1.5 leading-tight`}>
                <span className="h-1 w-1 rounded-full bg-[#B91C1C]" />
                <span className="truncate">{tagline}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
