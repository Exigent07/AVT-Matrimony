"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Heart, LogOut, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { useLanguage } from "@/providers/LanguageProvider";

export interface AccountDropdownLink {
  href: string;
  label: string;
  icon: LucideIcon;
  iconType?: "heart";
}

interface AccountDropdownProps {
  label: string;
  avatarUrl?: string | null;
  fallbackIcon: LucideIcon;
  links: AccountDropdownLink[];
  onLogout?: () => void;
}

export function AccountDropdown({
  label,
  avatarUrl,
  fallbackIcon: FallbackIcon,
  links,
  onLogout,
}: AccountDropdownProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarUrl]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const resolvedAvatarUrl = avatarUrl && !avatarFailed ? avatarUrl : null;
  const hasLinks = links.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        data-open={open}
        className="nav-control"
      >
        <span className="nav-control__icon">
          {resolvedAvatarUrl ? (
            <img
              src={resolvedAvatarUrl}
              alt={label}
              className="h-full w-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <FallbackIcon className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="max-w-[8.75rem] truncate text-left text-[13px] font-semibold text-gray-100 sm:max-w-[10rem] md:max-w-[12rem]">
          {label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="nav-menu absolute right-0 top-[calc(100%+0.65rem)] z-50 w-[17.5rem] origin-top-right"
          >
            <div className="grid gap-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="nav-menu-item"
                >
                  <span className="nav-menu-item__icon">
                    {item.iconType === "heart" || item.icon === Heart ? (
                      <AnimatedHeartIcon className="h-4 w-4" active interactive />
                    ) : (
                      <item.icon className="h-4 w-4" />
                    )}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
              {onLogout ? (
                <>
                  {hasLinks ? (
                    <div className="mx-2 my-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                  ) : null}
                  <button
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                    className="nav-menu-item text-left text-gray-300"
                  >
                    <span className="nav-menu-item__icon">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span>{language === "ta" ? "வெளியேறு" : "Sign out"}</span>
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
