import { Heart, type LucideIcon } from "lucide-react";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "brand" | "gold" | "slate" | "emerald";
}

const accentClasses: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  brand: "from-[#B91C1C] to-[#7F1D1D]",
  gold: "from-amber-500 to-amber-600",
  slate: "from-slate-700 to-slate-800",
  emerald: "from-emerald-600 to-emerald-700",
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  accent = "brand",
}: MetricCardProps) {
  return (
    <div className="stat-surface group relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B91C1C]/35 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {title}
          </div>
          <div
            className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-[2rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {value}
          </div>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-gradient-to-br text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)] ${accentClasses[accent]}`}
        >
          {Icon === Heart ? (
            <AnimatedHeartIcon className="h-[18px] w-[18px]" active />
          ) : (
            <Icon className="h-[18px] w-[18px]" />
          )}
        </div>
      </div>
    </div>
  );
}
