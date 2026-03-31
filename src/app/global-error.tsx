"use client";

import { useEffect } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ErrorStatusView } from "@/components/shared/SystemStatusViews";
import { LanguageProvider } from "@/providers/LanguageProvider";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ui",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-editorial",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
});

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <head>
        <title>Something Went Wrong | AV Tamil Matrimony</title>
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <LanguageProvider>
          <ErrorStatusView error={error} onRetry={unstable_retry} scope="global" />
        </LanguageProvider>
      </body>
    </html>
  );
}
