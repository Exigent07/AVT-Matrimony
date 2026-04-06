"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleHelp,
  Heart,
  LogIn,
  Menu,
  Shield,
  User,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  AccountDropdown,
  type AccountDropdownLink,
} from "@/components/layout/AccountDropdown";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Logo } from "@/components/shared/Logo";
import { requestJson } from "@/lib/client-request";
import { useLanguage } from "@/providers/LanguageProvider";
import type { SessionViewer } from "@/types/domain";

type AppHeaderMode = "public" | "member" | "admin";

interface AppHeaderProps {
  mode?: AppHeaderMode;
  activeLink?: string;
  rightContent?: React.ReactNode;
  viewer?: SessionViewer | null;
  adminName?: string;
}

interface NavigationLink {
  href: string;
  label: string;
  id: string;
}

interface HeaderActionLink extends AccountDropdownLink {}

function HeaderShell({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="nav-shell">{children}</div>
      </div>
    </header>
  );
}

function HeaderBrand({ href }: { href: string }) {
  return (
    <Link href={href} className="min-w-0 shrink-0 transition-opacity hover:opacity-90">
      <Logo size="small" showText={true} showTagline={false} />
    </Link>
  );
}

function MobileActionLink({
  href,
  label,
  icon: Icon,
  iconType,
  onSelect,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  iconType?: "heart";
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-left text-sm font-semibold text-white"
    >
      {iconType === "heart" ? (
        <Heart className="h-4 w-4 text-gray-300" />
      ) : (
        <Icon className="h-4 w-4 text-gray-300" />
      )}
      {label}
    </Link>
  );
}

export function AppHeader({
  mode = "public",
  activeLink,
  rightContent,
  viewer,
  adminName,
}: AppHeaderProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdminViewer = viewer?.role === "ADMIN";
  const isMemberViewer = viewer?.role === "MEMBER";
  const resolvedMode: AppHeaderMode = isAdminViewer ? "admin" : mode;
  const resolvedAdminName =
    adminName ?? viewer?.fullName ?? (language === "ta" ? "நிர்வாகி" : "Administrator");
  const triggerLabel = isAdminViewer
    ? viewer?.fullName ?? (language === "ta" ? "நிர்வாகி" : "Administrator")
    : isMemberViewer
      ? viewer?.fullName ?? (language === "ta" ? "உறுப்பினர்" : "Member")
      : language === "ta"
        ? "கணக்கு"
        : "Account";
  const triggerIcon = isAdminViewer ? Shield : isMemberViewer ? User : UserPlus;
  const signedInHomeHref = isAdminViewer
    ? "/admin/dashboard"
    : viewer
      ? "/dashboard"
      : "/";

  const publicNavigation: NavigationLink[] = [
    {
      href: signedInHomeHref,
      id: "home",
      label: t("common.home"),
    },
    { href: "/how-it-works", id: "how-it-works", label: t("header.how.it.works") },
    { href: "/about", id: "about", label: t("header.about.us") },
    { href: "/stories", id: "stories", label: t("header.success.stories") },
    { href: "/help", id: "help", label: t("common.help") },
  ];

  const memberNavigation: NavigationLink[] = [
    { href: "/dashboard", id: "dashboard", label: t("common.dashboard") },
    { href: "/search", id: "search", label: t("dashboard.search.profiles") },
    { href: "/interests", id: "interests", label: t("dashboard.my.interests") },
    { href: "/edit-profile", id: "edit-profile", label: t("dashboard.edit.profile") },
    { href: "/help", id: "help", label: language === "ta" ? "உதவி மையம்" : "Help Center" },
  ];

  const adminNavigation: NavigationLink[] = [];

  const guestActions: HeaderActionLink[] = [
    { href: "/login", label: t("common.login"), icon: LogIn },
    { href: "/register", label: t("common.register"), icon: UserPlus },
    { href: "/help", label: language === "ta" ? "உதவி மையம்" : "Help Center", icon: CircleHelp },
  ];
  const viewerActions: HeaderActionLink[] =
    isAdminViewer
      ? [
          {
            href: "/admin/dashboard",
            label: language === "ta" ? "நிர்வாகி பலகை" : "Admin Console",
            icon: Shield,
          },
        ]
      : [];

  const navigationLinks =
    resolvedMode === "member"
      ? memberNavigation
      : resolvedMode === "admin"
        ? adminNavigation
        : publicNavigation;

  const actionLinks = viewer ? viewerActions : guestActions;

  async function handleLogout() {
    try {
      await requestJson("/api/auth/logout", { method: "POST" });
      toast.success(
        isAdminViewer
          ? language === "ta"
            ? "நிர்வாகி அமர்வு முடிக்கப்பட்டது."
            : "Administrator session ended."
          : language === "ta"
            ? "நீங்கள் வெளியேறிவிட்டீர்கள்."
            : "You have been signed out.",
      );
      router.push(isAdminViewer ? "/admin/login" : "/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : language === "ta"
            ? "வெளியேற முடியவில்லை."
            : "Unable to sign out.",
      );
    }
  }

  return (
    <HeaderShell>
      <div className="flex items-center gap-3 lg:gap-5">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 lg:flex-none lg:justify-start">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4 md:gap-5">
            <HeaderBrand
              href={
                resolvedMode === "public"
                  ? signedInHomeHref
                  : resolvedMode === "admin"
                    ? "/admin/dashboard"
                    : "/dashboard"
              }
            />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-gray-200 hover:bg-white/[0.09]"
              aria-label={
                mobileMenuOpen
                  ? language === "ta"
                    ? "மெனுவை மூடு"
                    : "Close menu"
                  : language === "ta"
                    ? "மெனுவை திற"
                    : "Open menu"
              }
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {navigationLinks.length > 0 ? (
          <nav className="hidden min-w-0 flex-1 justify-center lg:flex">
            <div className="flex flex-wrap items-center justify-center gap-0.5 rounded-full border border-white/[0.07] bg-white/[0.04] p-1">
              {navigationLinks.map((item) => {
                const active = activeLink === item.id;

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
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : (
          <div className="hidden flex-1 lg:block" />
        )}

        <div className="hidden shrink-0 items-center justify-end gap-2.5 lg:flex">
          {rightContent}
          <AccountDropdown
            label={resolvedMode === "admin" ? viewer?.fullName ?? resolvedAdminName : triggerLabel}
            avatarUrl={viewer?.profilePhotoUrl}
            fallbackIcon={resolvedMode === "admin" ? Shield : triggerIcon}
            links={actionLinks}
            includeLanguageToggle
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
              {navigationLinks.map((item) => {
                const active = activeLink === item.id;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                      active
                        ? "bg-[#B91C1C] text-white shadow-[0_16px_30px_rgba(185,28,28,0.2)]"
                        : "bg-white/[0.03] text-gray-200 hover:bg-white/[0.07]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3 py-3">
                <LanguageToggle />
              </div>

              {actionLinks.length > 0 ? (
                <>
                  <div className="my-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                  {actionLinks.map((item) => (
                    <MobileActionLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      iconType={item.iconType}
                      onSelect={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </>
              ) : null}

              {viewer ? (
                <button
                  onClick={() => {
                    void handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-gray-300 hover:bg-white/[0.05]"
                >
                  {language === "ta" ? "வெளியேறு" : "Sign out"}
                </button>
              ) : null}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </HeaderShell>
  );
}
