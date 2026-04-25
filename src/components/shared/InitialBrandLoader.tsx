"use client";

import { useEffect, useState } from "react";
import {
  INTRO_LOADER_ANIMATION_MS,
  INTRO_LOADER_EXIT_MS,
  INTRO_LOADER_STORAGE_KEY,
} from "@/lib/intro-loader";

type LoaderPhase = "active" | "exiting" | "hidden";

export function InitialBrandLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("active");

  useEffect(() => {
    if (document.documentElement.dataset.introLoaderSeen === "true") {
      document.body.removeAttribute("data-intro-loader-active");
      setPhase("hidden");
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activeDuration = prefersReducedMotion ? 0 : INTRO_LOADER_ANIMATION_MS;
    const exitDuration = prefersReducedMotion ? 0 : INTRO_LOADER_EXIT_MS;

    document.body.dataset.introLoaderActive = "true";

    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, activeDuration);

    const cleanupTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_LOADER_STORAGE_KEY, "true");
      } catch {
        // Storage access can fail in privacy modes or when proxied (e.g., cloudflared).
        // Use memory-based fallback.
        window.__introLoaderSeen = true;
      }

      document.documentElement.dataset.introLoaderSeen = "true";
      document.body.removeAttribute("data-intro-loader-active");
      setPhase("hidden");
    }, activeDuration + exitDuration);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(cleanupTimer);
      document.body.removeAttribute("data-intro-loader-active");
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      className="site-loader"
      data-state={phase}
      role="status"
      aria-live="polite"
      aria-label="Loading AV Tamil Matrimony"
    >
      <div className="site-loader__stage">
        <div className="site-loader__halo" aria-hidden="true" />
        <div className="site-loader__halo site-loader__halo--secondary" aria-hidden="true" />

        <div className="site-loader__mark">
          <img
            src="/images/avt-logo.png"
            alt=""
            loading="eager"
            className="object-contain"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div className="site-loader__copy" aria-hidden="true">
          <span className="site-loader__line" />
          <span className="site-loader__title">AV Tamil Matrimony</span>
          <span className="site-loader__subtitle">Tamil matrimony with heart and tradition</span>
        </div>
      </div>
    </div>
  );
}
