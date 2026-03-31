interface StatusBadgeProps {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
}

const toneClasses: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  neutral: "border-slate-200/80 bg-white text-slate-600",
  success: "border-emerald-200/90 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200/90 bg-amber-50 text-amber-700",
  danger: "border-rose-200/90 bg-rose-50 text-rose-700",
  brand: "border-[#B91C1C]/15 bg-[#B91C1C]/[0.06] text-[#991B1B]",
};

export function StatusBadge({
  label,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize tracking-[0.08em] ${toneClasses[tone]}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-75" />
      {label}
    </span>
  );
}
