"use client";

import * as React from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { CalendarDays } from "lucide-react";
import { enUS, ta } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

type SelectControlChangeEvent = {
  target: {
    value: string;
  };
};

interface SelectControlProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "children" | "onChange" | "size"
  > {
  children: ReactNode;
  onChange?: (event: SelectControlChangeEvent) => void;
  size?: "default" | "sm";
}

interface DateControlProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onChange?: (event: SelectControlChangeEvent) => void;
}

interface InputControlProps extends InputHTMLAttributes<HTMLInputElement> {}
interface TextareaControlProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

function extractSelectOptions(children: ReactNode) {
  const nodes = React.Children.toArray(children);
  const options = nodes
    .filter((node): node is React.ReactElement<{
      value?: string;
      children?: ReactNode;
      disabled?: boolean;
    }> => React.isValidElement(node))
    .map((node) => ({
      value: String(node.props.value ?? ""),
      label: node.props.children as ReactNode,
      disabled: Boolean(node.props.disabled),
    }));

  const placeholderOption =
    options.find((option) => option.value === "") ?? null;

  return {
    options: options.filter((option) => option.value !== ""),
    placeholder:
      placeholderOption && typeof placeholderOption.label === "string"
        ? placeholderOption.label
        : undefined,
  };
}

function parseIsoDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date, language: "en" | "ta") {
  return new Intl.DateTimeFormat(language === "ta" ? "ta-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeFieldValue(
  value: string | number | readonly string[] | undefined,
) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return "";
}

export function InputControl({ className, ...props }: InputControlProps) {
  return <Input className={cn("field-input", className)} {...props} />;
}

export function TextareaControl({
  className,
  ...props
}: TextareaControlProps) {
  return <Textarea className={cn("field-input field-textarea", className)} {...props} />;
}

export function SelectControl({
  children,
  value,
  onChange,
  name,
  required,
  disabled,
  size = "default",
  className,
  ...props
}: SelectControlProps) {
  const { options, placeholder } = extractSelectOptions(children);
  const normalizedValue = normalizeFieldValue(value);

  return (
    <div className="field-shell">
      {name ? <input type="hidden" name={name} value={normalizedValue} /> : null}
      <Select
        value={normalizedValue || undefined}
        disabled={disabled}
        required={required}
        onValueChange={(nextValue) => onChange?.({ target: { value: nextValue } })}
      >
        <SelectTrigger
          size={size}
          aria-invalid={props["aria-invalid"]}
          className={cn("field-input field-select-trigger", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={10}
          className="field-select-content"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="field-select-item"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function DateControl({
  value,
  onChange,
  disabled,
  className,
  placeholder,
  required,
  name,
  ...props
}: DateControlProps) {
  const { language } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const normalizedValue = normalizeFieldValue(value);
  const selectedDate = parseIsoDate(normalizedValue);
  const today = React.useMemo(() => new Date(), []);
  const startMonth = React.useMemo(
    () => new Date(today.getFullYear() - 80, 0, 1),
    [today],
  );
  const endMonth = React.useMemo(
    () => new Date(today.getFullYear() - 18, 11, 31),
    [today],
  );
  const label =
    selectedDate
      ? formatDisplayDate(selectedDate, language)
      : placeholder ??
        (language === "ta" ? "தேதியைத் தேர்ந்தெடுக்கவும்" : "Select date");

  return (
    <div className="field-shell">
      {name ? <input type="hidden" name={name} value={normalizedValue} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-invalid={props["aria-invalid"]}
            aria-required={required}
            className={cn(
              "field-input field-date-trigger w-full text-left",
              !selectedDate && "text-slate-400",
              className,
            )}
          >
            <span className="field-date-trigger__content">
              <CalendarDays className="h-4 w-4 text-[#B91C1C]/75" />
              <span>{label}</span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={12}
          className="field-date-popover w-auto p-0"
        >
          <Calendar
            mode="single"
            locale={language === "ta" ? ta : enUS}
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) {
                return;
              }

              onChange?.({ target: { value: toIsoDate(date) } });
              setOpen(false);
            }}
            defaultMonth={selectedDate ?? endMonth}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={{ after: today }}
            fixedWeeks
            className="field-calendar"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
