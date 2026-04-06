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
    <div className="panel-muted relative overflow-hidden px-8 py-12 text-center h-full">
      <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-[#B91C1C]/[0.06] blur-3xl" />
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-white text-[#B91C1C] shadow-[0_18px_36px_rgba(15,23,42,0.09),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#B91C1C]/10">
        {Icon === Heart ? (
          <AnimatedHeartIcon className="h-[22px] w-[22px]" active />
        ) : (
          <Icon className="h-[22px] w-[22px]" />
        )}
      </div>
      <h3 className="relative mt-5 font-display text-xl font-semibold text-slate-900">
        {title}
      </h3>
      <p className="relative mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      {action ? <div className="relative mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
