import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Geist } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import { getIntroLoaderBootstrapScript } from "@/lib/intro-loader";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

export const metadata: Metadata = {
  title: {
    default: "AVTamil Matrimony",
    template: "%s | AVTamil Matrimony",
  },
  description:
    "A family-centered Tamil matrimony experience with verified profiles, bilingual support, and thoughtful matching tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", bodyFont.variable, displayFont.variable, "font-sans", geist.variable)}
    >
      <head>
        <script
          id="intro-loader-bootstrap"
          dangerouslySetInnerHTML={{ __html: getIntroLoaderBootstrapScript() }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
