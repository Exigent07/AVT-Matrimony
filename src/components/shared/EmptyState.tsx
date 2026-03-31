import { Heart, type LucideIcon } from "lucide-react";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="panel-muted relative overflow-hidden p-10 text-center">
      <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 rounded-full bg-[#B91C1C]/[0.05] blur-3xl" />
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-white text-[#B91C1C] shadow-[0_18px_32px_rgba(15,23,42,0.08)] ring-1 ring-[#B91C1C]/10">
        {Icon === Heart ? (
          <AnimatedHeartIcon className="h-5 w-5" active />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </div>
      <h3
        className="relative mt-5 text-xl font-semibold text-slate-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      {action ? <div className="relative mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
