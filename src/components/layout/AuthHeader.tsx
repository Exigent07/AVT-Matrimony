"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CircleHelp,
  FilePenLine,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  Search,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { AccountDropdown } from "@/components/layout/AccountDropdown";
import { Logo } from "@/components/shared/Logo";
import { requestJson } from "@/lib/client-request";
import type { SessionViewer } from "@/types/domain";

interface AuthHeaderProps {
  backTo?: string;
  backLabel?: string;
  rightContent?: React.ReactNode;
  viewer?: SessionViewer | null;
}

export function AuthHeader({
  backTo,
  backLabel,
  rightContent,
  viewer,
}: AuthHeaderProps) {
  const router = useRouter();
  const isAdmin = viewer?.role === "ADMIN";
  const isMember = Boolean(viewer && viewer.role === "MEMBER");
  const homeHref = isAdmin ? "/admin/dashboard" : isMember ? "/dashboard" : "/";
  const triggerLabel = isAdmin
    ? viewer?.fullName ?? "Administrator"
    : isMember
      ? viewer?.fullName ?? "Member"
      : "Account";
  const triggerIcon = isAdmin ? Shield : User;

  const links = isAdmin
    ? [
        { href: "/admin/dashboard", label: "Admin Console", icon: LayoutDashboard },
        { href: "/", label: "Main Site", icon: Home },
        { href: "/help", label: "Help Center", icon: CircleHelp },
      ]
    : isMember
      ? [
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/search", label: "Search Profiles", icon: Search },
          { href: "/interests", label: "My Interests", icon: Heart, iconType: "heart" as const },
          { href: "/edit-profile", label: "Edit Profile", icon: FilePenLine },
        ]
      : [
          { href: "/login", label: "Login", icon: LogIn },
          { href: "/register", label: "Register", icon: UserPlus },
          { href: "/help", label: "Help Center", icon: CircleHelp },
        ];

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

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[1.75rem] border border-white/[0.08] bg-[#161616]/92 px-3 py-3 shadow-[0_24px_60px_rgba(0,0,0,0.22),0_8px_20px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <Link href={homeHref} className="shrink-0 transition-opacity hover:opacity-90">
                <Logo size="medium" showText={false} showTagline={false} />
              </Link>
              {backTo ? (
                <Link
                  href={backTo}
                  className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-[13px] font-semibold text-gray-300 hover:bg-white/[0.08] hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{backLabel ?? "Back"}</span>
                </Link>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              {rightContent}
              <AccountDropdown
                label={triggerLabel}
                avatarUrl={viewer?.profilePhotoUrl}
                fallbackIcon={triggerIcon}
                links={links}
                includeLanguageToggle
                onLogout={viewer ? () => void handleLogout() : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
