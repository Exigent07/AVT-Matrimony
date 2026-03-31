"use client";

import { Home, LayoutDashboard, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AccountDropdown } from "@/components/layout/AccountDropdown";
import { Logo } from "@/components/shared/Logo";
import { requestJson } from "@/lib/client-request";
import type { SessionViewer } from "@/types/domain";

interface AdminHeaderProps {
  adminName?: string;
  onLogout?: () => void;
  viewer?: SessionViewer | null;
}

export function AdminHeader({ adminName = "Administrator", onLogout, viewer }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    if (onLogout) {
      onLogout();
      return;
    }

    try {
      await requestJson("/api/auth/logout", { method: "POST" });
      toast.success("Administrator session ended.");
      router.push("/admin/login");
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
            <div className="flex min-w-0 items-center gap-4 md:gap-5">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="min-w-0 text-left transition-opacity hover:opacity-90"
              >
                <Logo size="medium" showText={false} showTagline={false} siteName="AV Tamil Matrimony" tagline="Admin Console" />
              </button>
              <div className="hidden items-center gap-2.5 md:flex">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B91C1C]/15 bg-[#B91C1C]/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B91C1C]">
                  <Shield className="h-3 w-3" />
                  Admin
                </span>
                <span className="truncate text-[13px] font-semibold text-gray-400">{adminName}</span>
              </div>
            </div>

            <AccountDropdown
              label={viewer?.fullName ?? adminName}
              avatarUrl={viewer?.profilePhotoUrl}
              fallbackIcon={Shield}
              links={[
                { href: "/admin/dashboard", label: "Admin Console", icon: LayoutDashboard },
                { href: "/", label: "Main Site", icon: Home },
              ]}
              includeLanguageToggle
              onLogout={() => void handleLogout()}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
