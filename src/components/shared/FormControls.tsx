"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

interface SelectControlProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

interface DateControlProps extends InputHTMLAttributes<HTMLInputElement> {}

export function SelectControl({
  children,
  className,
  ...props
}: SelectControlProps) {
  return (
    <div className="field-shell">
      <select
        {...props}
        className={["input-field select-field", className].filter(Boolean).join(" ")}
      >
        {children}
      </select>
      <span className="field-shell__icon field-shell__icon--right" aria-hidden="true">
        <ChevronDown className="h-4 w-4" />
      </span>
    </div>
  );
}

export function DateControl({ className, ...props }: DateControlProps) {
  return (
    <div className="field-shell">
      <span className="field-shell__icon" aria-hidden="true">
        <CalendarDays className="h-4 w-4" />
      </span>
      <input
        {...props}
        type="date"
        className={["input-field date-field", className].filter(Boolean).join(" ")}
      />
    </div>
  );
}
