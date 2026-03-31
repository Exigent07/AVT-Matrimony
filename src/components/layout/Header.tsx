"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleHelp,
  FilePenLine,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { requestJson } from "@/lib/client-request";
import type { SessionViewer } from "@/types/domain";
import { useLanguage } from "@/providers/LanguageProvider";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Logo } from "@/components/shared/Logo";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { AccountDropdown } from "@/components/layout/AccountDropdown";

interface HeaderProps {
  activeLink?: string;
  viewer?: SessionViewer | null;
}

const navigation = [
  { href: "/how-it-works", labelKey: "header.how.it.works", id: "how-it-works" },
  { href: "/about", labelKey: "header.about.us", id: "about" },
  { href: "/stories", labelKey: "header.success.stories", id: "stories" },
  { href: "/help", labelKey: "common.help", id: "help" },
];

export function Header({ activeLink, viewer }: HeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentSection = activeLink ?? "none";
  const isAdmin = viewer?.role === "ADMIN";
  const isMember = Boolean(viewer);
  const isHomeHeader = currentSection === "home";
  const showNavigation = !isHomeHeader;
  const homeHref = isAdmin ? "/admin/dashboard" : isMember ? "/dashboard" : "/";
  const homeLabel = isAdmin ? "Admin Console" : isMember ? "Dashboard" : t("common.home");

  async function handleLogout() {
    try {
      await requestJson("/api/auth/logout", { method: "POST" });
      toast.success("You have been signed out.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }

  const memberQuickLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/search", label: "Search Profiles", icon: Search },
    { href: "/interests", label: "My Interests", icon: Heart, iconType: "heart" as const },
    { href: "/edit-profile", label: "Edit Profile", icon: FilePenLine },
  ];

  const adminQuickLinks = [
    { href: "/admin/dashboard", label: "Admin Console", icon: LayoutDashboard },
    { href: homeHref, label: "Home", icon: Home },
  ];

  const guestQuickLinks = [
    { href: "/login", label: t("common.login"), icon: LogIn },
    { href: "/register", label: t("common.register"), icon: UserPlus },
    { href: "/help", label: "Help Center", icon: CircleHelp },
  ];

  const quickLinks = isAdmin
    ? adminQuickLinks
    : isMember
      ? memberQuickLinks
      : guestQuickLinks;

  const triggerLabel = isAdmin ? viewer?.fullName ?? "Administrator" : isMember ? viewer?.fullName ?? "Member" : "Account";
  const triggerIcon = isAdmin ? Shield : isMember ? User : UserPlus;

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="nav-shell">
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="flex min-w-0 flex-1 items-center justify-between gap-3 lg:flex-none lg:justify-start">
              <Link
                href={homeHref}
                className="min-w-0 rounded-2xl px-2 py-1.5 transition-opacity hover:opacity-90"
              >
                <Logo
                  size="medium"
                  showText={false}
                  showTagline={false}
                  siteName={t("site.name")}
                  tagline={t("site.tagline")}
                />
              </Link>

              <div className="flex items-center gap-2 lg:hidden">
                {isHomeHeader ? <LanguageToggle /> : null}
                <button
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-gray-200 hover:bg-white/[0.09]"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {showNavigation ? (
              <nav className="hidden min-w-0 flex-1 justify-center lg:flex">
                <div className="flex flex-wrap items-center justify-center gap-0.5 rounded-full border border-white/[0.07] bg-white/[0.04] p-1">
                  <Link
                    href={homeHref}
                    aria-current={currentSection === "home" ? "page" : undefined}
                    className="nav-link"
                    data-active={currentSection === "home"}
                  >
                    {currentSection === "home" ? (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full border border-white/[0.06] bg-white/[0.08]"
                        transition={{ type: "spring", stiffness: 540, damping: 36 }}
                      />
                    ) : null}
                    <span className="relative z-10">{homeLabel}</span>
                  </Link>
                  {navigation.map((item) => {
                    const active = currentSection === item.id;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="nav-link"
                        data-active={active}
                      >
                        {active ? (
                          <motion.span
                            layoutId="nav-indicator"
                            className="absolute inset-0 rounded-full border border-white/[0.06] bg-white/[0.08]"
                            transition={{ type: "spring", stiffness: 540, damping: 36 }}
                          />
                        ) : null}
                        <span className="relative z-10">{t(item.labelKey)}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>
            ) : (
              <div className="hidden flex-1 lg:block" />
            )}

            <div className="hidden shrink-0 items-center justify-end gap-2.5 lg:flex">
              {isHomeHeader ? <LanguageToggle /> : null}
              <AccountDropdown
                label={triggerLabel}
                avatarUrl={viewer?.profilePhotoUrl}
                fallbackIcon={triggerIcon}
                links={quickLinks}
                includeLanguageToggle={!isHomeHeader}
                onLogout={viewer ? () => void handleLogout() : undefined}
              />
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="mt-3 overflow-hidden border-t border-white/[0.07] pt-3 lg:hidden"
              >
                <nav className="grid gap-2">
                  {showNavigation ? (
                    <>
                      <Link
                        href={homeHref}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                          currentSection === "home"
                            ? "bg-[#B91C1C] text-white shadow-[0_16px_30px_rgba(185,28,28,0.2)]"
                            : "bg-white/[0.03] text-gray-200 hover:bg-white/[0.07]"
                        }`}
                      >
                        {homeLabel}
                      </Link>
                      {navigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                            currentSection === item.id
                              ? "bg-[#B91C1C] text-white shadow-[0_16px_30px_rgba(185,28,28,0.2)]"
                              : "bg-white/[0.03] text-gray-200 hover:bg-white/[0.07]"
                          }`}
                        >
                          {t(item.labelKey)}
                        </Link>
                      ))}
                      <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    </>
                  ) : null}
                  {!isHomeHeader ? (
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-3">
                      <LanguageToggle />
                    </div>
                  ) : null}
                  {isAdmin ? (
                    <>
                      {adminQuickLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-left text-sm font-semibold text-white"
                        >
                          <item.icon className="h-4 w-4 text-gray-300" />
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          void handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-gray-300 hover:bg-white/[0.05]"
                      >
                        Sign out
                      </button>
                    </>
                  ) : isMember ? (
                    <>
                      {memberQuickLinks.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                            index === 0
                              ? "bg-[#B91C1C] text-white shadow-[0_16px_30px_rgba(185,28,28,0.2)]"
                              : "border border-white/[0.08] bg-white/[0.04] text-gray-200"
                          }`}
                        >
                          {item.iconType === "heart" ? (
                            <AnimatedHeartIcon className="h-4 w-4" active interactive />
                          ) : (
                            <item.icon className="h-4 w-4" />
                          )}
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          void handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-gray-300"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    guestQuickLinks.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                          index === 1
                            ? "bg-[#B91C1C] text-white shadow-[0_16px_30px_rgba(185,28,28,0.2)]"
                            : "border border-white/[0.08] bg-white/[0.04] text-gray-200"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))
                  )}
                </nav>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
