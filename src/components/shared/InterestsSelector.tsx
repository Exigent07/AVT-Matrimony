"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { INTEREST_CATEGORIES } from "@/lib/constants/interests";
import { useLanguage } from "@/providers/LanguageProvider";
import { translateInterestCategory, translateInterestLabel } from "@/lib/translate-display";

interface InterestsSelectorProps {
  selectedInterests?: string[];
  onInterestsChange?: (interests: string[]) => void;
  showSaveButton?: boolean;
  maxSelections?: number;
}

export function InterestsSelector({
  selectedInterests = [],
  onInterestsChange,
  showSaveButton = false,
  maxSelections = 15,
}: InterestsSelectorProps) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string[]>(selectedInterests);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    INTEREST_CATEGORIES[0]?.id ?? null,
  );

  useEffect(() => {
    setSelected(selectedInterests);
  }, [selectedInterests]);

  const totalAvailable = useMemo(
    () => INTEREST_CATEGORIES.reduce((count, category) => count + category.items.length, 0),
    [],
  );

  function updateSelected(nextSelected: string[]) {
    setSelected(nextSelected);
    onInterestsChange?.(nextSelected);
  }

  function toggleInterest(label: string) {
    if (selected.includes(label)) {
      updateSelected(selected.filter((interest) => interest !== label));
      return;
    }

    if (selected.length >= maxSelections) {
      toast.error(
        language === "ta"
          ? `அதிகபட்சம் ${maxSelections} விருப்பங்களை மட்டும் தேர்வு செய்யலாம்.`
          : `You can select up to ${maxSelections} interests.`,
      );
      return;
    }

    updateSelected([...selected, label]);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#B91C1C]/10 bg-gradient-to-br from-[#FBF7F0] to-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B91C1C]/10 text-[#B91C1C]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl text-slate-900">
                {language === "ta" ? "தேர்ந்தெடுத்த விருப்பங்கள்" : "Selected interests"}
              </h3>
              <p className="text-sm text-slate-600">
                {language === "ta"
                  ? "உங்கள் வாழ்க்கை முறை மற்றும் குணநலன்களை பிரதிபலிக்கும் சுருக்கமான விருப்பங்களைத் தேர்ந்தெடுக்கவும்."
                  : "Choose a concise set of interests that represents your lifestyle and personality."}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {selected.length}/{maxSelections}
          </span>
        </div>

        {selected.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm text-slate-500">
            {language === "ta"
              ? `இன்னும் எந்த விருப்பமும் தேர்ந்தெடுக்கப்படவில்லை. கீழே உள்ள ${totalAvailable} விருப்பங்களில் இருந்து தேர்வு செய்யவும்.`
              : `No interests selected yet. Choose from ${totalAvailable} available options below.`}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-2">
            {selected.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className="inline-flex items-center gap-2 rounded-full border border-[#B91C1C]/20 bg-[#B91C1C]/8 px-4 py-2 text-sm text-[#991B1B] transition-colors hover:bg-[#B91C1C]/12"
              >
                <span>{translateInterestLabel(interest, language)}</span>
                <X className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {INTEREST_CATEGORIES.map((category) => {
          const categoryCount = category.items.filter((item) => selected.includes(item.label)).length;
          const open = expandedCategory === category.id;

          return (
            <div key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedCategory(open ? null : category.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <div className="text-base text-slate-900">
                    {translateInterestCategory(category.label, language)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {language === "ta" ? `${categoryCount} தேர்வு செய்யப்பட்டது` : `${categoryCount} selected`}
                  </div>
                </div>
                <motion.div animate={{ rotate: open ? 180 : 0 }}>
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-3 border-t border-slate-100 px-5 py-5 md:grid-cols-2 xl:grid-cols-3">
                      {category.items.map((item) => {
                        const active = selected.includes(item.label);

                        return (
                          <button
                            key={item.slug}
                            type="button"
                            onClick={() => toggleInterest(item.label)}
                            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                              active
                                ? "border-[#B91C1C]/20 bg-[#B91C1C]/8 text-[#991B1B]"
                                : "border-slate-200 bg-white text-slate-700 hover:border-[#B91C1C]/20 hover:bg-[#FBF7F0]"
                            }`}
                          >
                            <span>{translateInterestLabel(item.label, language)}</span>
                            {active ? <Check className="h-4 w-4" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {showSaveButton ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-center text-sm text-slate-500">
          {language === "ta"
            ? "உங்கள் சுயவிவரத்தை சமர்ப்பிக்கும் போது மாற்றங்கள் சேமிக்கப்படும்."
            : "Changes are saved when you submit your profile."}
        </div>
      ) : null}
    </div>
  );
}
