"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Search, Settings2, UserRound, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { EmptyState } from "@/components/shared/EmptyState";
import { InputControl, SelectControl } from "@/components/shared/FormControls";
import { MemberResumeTracker } from "@/components/shared/MemberResumeTracker";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  ANNUAL_INCOME_OPTIONS,
  DIET_OPTIONS,
  HABIT_FREQUENCY_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/lib/constants/profile-options";
import type { MemberResumeEntry } from "@/lib/member-resume";
import { requestJson } from "@/lib/client-request";
import { isProfilePlaceholderValue } from "@/lib/profile-utils";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  translateDisplayValue,
  translateInterestLabel,
  translateUiTerm,
} from "@/lib/translate-display";
import type { InterestStatus, ProfileCard, SessionViewer } from "@/types/domain";

interface ProfileSearchProps {
  viewer: SessionViewer;
  profiles: ProfileCard[];
  requestStatusByUserId: Record<string, InterestStatus>;
  directoryMode: "compatible" | "broader-directory";
}

const initialAgeRange: [number, number] = [21, 45];

const DRAWER_SECTIONS = ["age", "background", "location", "education", "lifestyle", "other"] as const;

type DrawerSection = (typeof DRAWER_SECTIONS)[number];

interface FilterState {
  ageRange: [number, number];
  maritalStatus: string;
  religion: string;
  caste: string;
  state: string;
  city: string;
  education: string;
  occupation: string;
  income: string;
  diet: string;
  smoking: string;
  drinking: string;
  photoOnly: boolean;
}

const defaultFilters: FilterState = {
  ageRange: initialAgeRange,
  maritalStatus: "all",
  religion: "all",
  caste: "all",
  state: "all",
  city: "all",
  education: "all",
  occupation: "all",
  income: "all",
  diet: "all",
  smoking: "all",
  drinking: "all",
  photoOnly: false,
};

function getProfileTone(status: ProfileCard["profileStatus"]) {
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  return "warning";
}

function getInterestTone(status: InterestStatus) {
  if (status === "CONTACT_SHARED") return "success";
  if (status === "DECLINED") return "danger";
  if (status === "ACCEPTED") return "warning";
  return "brand";
}

function clampAge(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(60, Math.max(18, parsed));
}

function uniqueSorted(values: string[]) {
  return Array.from(
    new Set(values.filter((value) => value && !isProfilePlaceholderValue(value))),
  ).sort();
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProfileSearch({
  viewer,
  profiles,
  requestStatusByUserId,
  directoryMode,
}: ProfileSearchProps) {
  const router = useRouter();
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<DrawerSection>>(
    new Set(DRAWER_SECTIONS),
  );
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);
  const [heartBurst, setHeartBurst] = useState<{ userId: string; key: number } | null>(null);

  function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function updateMinAge(value: string) {
    const nextMin = clampAge(value, filters.ageRange[0]);
    setFilter("ageRange", [Math.min(nextMin, filters.ageRange[1]), Math.max(nextMin, filters.ageRange[1])]);
  }

  function updateMaxAge(value: string) {
    const nextMax = clampAge(value, filters.ageRange[1]);
    setFilter("ageRange", [Math.min(filters.ageRange[0], nextMax), Math.max(filters.ageRange[0], nextMax)]);
  }

  function toggleSection(id: DrawerSection) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetFilters() {
    setSearchQuery("");
    setFilters(defaultFilters);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen, isMounted]);

  const options = useMemo(
    () => ({
      maritalStatus: [...MARITAL_STATUS_OPTIONS],
      religion: uniqueSorted(profiles.map((p) => p.religion)),
      caste: uniqueSorted(profiles.map((p) => p.caste)),
      state: uniqueSorted(profiles.map((p) => p.state)),
      city: uniqueSorted(profiles.map((p) => p.city)),
      education: uniqueSorted(profiles.map((p) => p.education)),
      occupation: uniqueSorted(profiles.map((p) => p.occupation)),
      income: [...ANNUAL_INCOME_OPTIONS],
      diet: [...DIET_OPTIONS],
      smoking: [...HABIT_FREQUENCY_OPTIONS],
      drinking: [...HABIT_FREQUENCY_OPTIONS],
    }),
    [profiles],
  );

  // Active filter chips (for the removable tags strip)
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];
    if (filters.ageRange[0] !== initialAgeRange[0] || filters.ageRange[1] !== initialAgeRange[1])
      chips.push({ id: "age", label: `${filters.ageRange[0]}–${filters.ageRange[1]} yrs`, onRemove: () => setFilter("ageRange", initialAgeRange) });
    if (filters.maritalStatus !== "all")
      chips.push({ id: "ms", label: translateDisplayValue(filters.maritalStatus, language), onRemove: () => setFilter("maritalStatus", "all") });
    if (filters.religion !== "all")
      chips.push({ id: "rel", label: translateDisplayValue(filters.religion, language), onRemove: () => setFilter("religion", "all") });
    if (filters.caste !== "all")
      chips.push({ id: "cas", label: translateDisplayValue(filters.caste, language), onRemove: () => setFilter("caste", "all") });
    if (filters.state !== "all")
      chips.push({ id: "st", label: translateDisplayValue(filters.state, language), onRemove: () => setFilter("state", "all") });
    if (filters.city !== "all")
      chips.push({ id: "city", label: translateDisplayValue(filters.city, language), onRemove: () => setFilter("city", "all") });
    if (filters.education !== "all")
      chips.push({ id: "edu", label: translateDisplayValue(filters.education, language), onRemove: () => setFilter("education", "all") });
    if (filters.occupation !== "all")
      chips.push({ id: "occ", label: translateDisplayValue(filters.occupation, language), onRemove: () => setFilter("occupation", "all") });
    if (filters.income !== "all")
      chips.push({ id: "inc", label: translateDisplayValue(filters.income, language), onRemove: () => setFilter("income", "all") });
    if (filters.diet !== "all")
      chips.push({ id: "diet", label: translateDisplayValue(filters.diet, language), onRemove: () => setFilter("diet", "all") });
    if (filters.smoking !== "all")
      chips.push({ id: "smk", label: translateDisplayValue(filters.smoking, language), onRemove: () => setFilter("smoking", "all") });
    if (filters.drinking !== "all")
      chips.push({ id: "drk", label: translateDisplayValue(filters.drinking, language), onRemove: () => setFilter("drinking", "all") });
    if (filters.photoOnly)
      chips.push({ id: "photo", label: language === "ta" ? "புகைப்படம் உள்ளவை மட்டும்" : "With photo", onRemove: () => setFilter("photoOnly", false) });
    return chips;
  }, [filters, language]);

  const activeFilterCount = activeChips.length;

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (![p.fullName, p.city, p.occupation, p.caste, p.religion].join(" ").toLowerCase().includes(q)) return false;
      }
      if (p.age < filters.ageRange[0] || p.age > filters.ageRange[1]) return false;
      if (filters.maritalStatus !== "all" && p.maritalStatus !== filters.maritalStatus) return false;
      if (filters.religion !== "all" && p.religion !== filters.religion) return false;
      if (filters.caste !== "all" && p.caste !== filters.caste) return false;
      if (filters.state !== "all" && p.state !== filters.state) return false;
      if (filters.city !== "all" && p.city !== filters.city) return false;
      if (filters.education !== "all" && p.education !== filters.education) return false;
      if (filters.occupation !== "all" && p.occupation !== filters.occupation) return false;
      if (filters.income !== "all" && p.annualIncome !== filters.income) return false;
      if (filters.diet !== "all" && p.diet !== filters.diet) return false;
      if (filters.smoking !== "all" && p.smoking !== filters.smoking) return false;
      if (filters.drinking !== "all" && p.drinking !== filters.drinking) return false;
      if (filters.photoOnly && !p.profilePhotoUrl) return false;
      return true;
    });
  }, [profiles, searchQuery, filters]);

  const resumeEntry = useMemo<MemberResumeEntry>(
    () => ({
      href: "/search",
      icon: "search",
      title: { en: "Search profiles", ta: "சுயவிவர தேடல்" },
      detail: searchQuery.trim()
        ? { en: `Search query: ${searchQuery.trim()}`, ta: `தேடல் சொல்: ${searchQuery.trim()}` }
        : { en: `Showing ${filteredProfiles.length} of ${profiles.length} profiles`, ta: `${profiles.length} இல் ${filteredProfiles.length} சுயவிவரங்கள் காட்டப்படுகிறது` },
      updatedAt: new Date().toISOString(),
    }),
    [filteredProfiles.length, profiles.length, searchQuery],
  );

  async function handleInterest(targetUserId: string) {
    setHeartBurst({ userId: targetUserId, key: Date.now() });
    setSubmittingFor(targetUserId);
    try {
      await requestJson("/api/interests", { method: "POST", body: JSON.stringify({ targetUserId }) });
      toast.success(language === "ta" ? "ஆர்வக் கோரிக்கை அனுப்பப்பட்டது." : "Interest request sent.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : language === "ta" ? "ஆர்வத்தை அனுப்ப முடியவில்லை." : "Unable to send interest.");
    } finally {
      setSubmittingFor(null);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <PageTransition>
      <div className="page-shell">
        <MemberResumeTracker viewerId={viewer.id} entry={resumeEntry} />
        <AppHeader mode="member" activeLink="search" viewer={viewer} />

        <div className="section-shell section-block pt-4 md:pt-6">

          {/* ── Page header + filters ─────────────────────────────────────── */}
          <section className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="section-label">
                  {language === "ta" ? "பொருத்தத் தேடல்" : "Match Discovery"}
                </span>
                <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">
                  {language === "ta" ? "சுயவிவரங்களைத் தேடுங்கள்" : "Search profiles"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {language === "ta"
                    ? "சரிபார்க்கப்பட்ட உறுப்பினர் சுயவிவரங்களைப் பார்வையிட்டு, பொருத்தமாக இருக்கும்போது மட்டுமே ஆர்வம் தெரிவிக்கவும்."
                    : "Browse verified member profiles and express interest only when the match feels right."}
                </p>
              </div>
              <div className="eyebrow-pill shrink-0 self-start text-slate-500">
                {language === "ta" ? `${viewer.fullName} ஆக உள்நுழைந்துள்ளீர்கள்` : `Signed in as ${viewer.fullName}`}
              </div>
            </div>

            {/* ── Search + All Filters ────────────────────────────── */}
            <div className="mt-6 flex items-center gap-3">
              <div className="field-shell flex-1">
                <Search className="field-shell__icon h-4 w-4" />
                <InputControl
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  placeholder={
                    language === "ta"
                      ? "பெயர், நகரம், தொழில் அல்லது சாதி மூலம் தேடுங்கள்…"
                      : "Search by name, city, occupation or caste…"
                  }
                />
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                  activeFilterCount > 0
                    ? "border-[#B91C1C]/30 bg-[#B91C1C]/[0.06] text-[#B91C1C] hover:bg-[#B91C1C]/[0.09]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === "ta" ? "அனைத்து வடிகட்டிகள்" : "All Filters"}
                </span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#B91C1C] px-1.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* ── Quick filter pills ──────────────────────────────── */}
            <div className="mt-3 hidden items-center gap-2 overflow-x-auto pb-0.5 md:flex">
              {options.maritalStatus.length > 0 && (
                <QuickPill
                  label={language === "ta" ? "திருமண நிலை" : "Marital Status"}
                  value={filters.maritalStatus}
                  onChange={(v) => setFilter("maritalStatus", v)}
                  options={options.maritalStatus}
                  allLabel={language === "ta" ? "அனைத்தும்" : "Any"}
                />
              )}
              {options.religion.length > 0 && (
                <QuickPill
                  label={language === "ta" ? "மதம்" : "Religion"}
                  value={filters.religion}
                  onChange={(v) => setFilter("religion", v)}
                  options={options.religion}
                  allLabel={language === "ta" ? "அனைத்தும்" : "Any"}
                />
              )}
              {options.city.length > 0 && (
                <QuickPill
                  label={language === "ta" ? "நகரம்" : "City"}
                  value={filters.city}
                  onChange={(v) => setFilter("city", v)}
                  options={options.city}
                  allLabel={language === "ta" ? "அனைத்தும்" : "Any"}
                />
              )}
              {options.education.length > 0 && (
                <QuickPill
                  label={language === "ta" ? "கல்வி" : "Education"}
                  value={filters.education}
                  onChange={(v) => setFilter("education", v)}
                  options={options.education}
                  allLabel={language === "ta" ? "அனைத்தும்" : "Any"}
                />
              )}
              {/* Age pill — static, opens drawer */}
              <button
                onClick={() => setDrawerOpen(true)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border py-2 pl-3.5 pr-3 text-sm font-medium whitespace-nowrap transition-colors",
                  filters.ageRange[0] !== initialAgeRange[0] || filters.ageRange[1] !== initialAgeRange[1]
                    ? "border-[#B91C1C]/30 bg-[#B91C1C]/[0.06] text-[#B91C1C]"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                )}
              >
                {language === "ta" ? "வயது" : "Age"}:&nbsp;
                <span className="font-semibold text-slate-700">
                  {filters.ageRange[0]}–{filters.ageRange[1]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="shrink-0 text-[13px] font-semibold text-[#B91C1C] whitespace-nowrap transition-colors hover:text-[#991B1B]"
                >
                  {language === "ta" ? "அனைத்தையும் மீட்டமை" : "Reset all"}
                </button>
              )}
            </div>

            {/* ── Active filter chips ─────────────────────────────── */}
            {activeChips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#B91C1C]/20 bg-[#B91C1C]/[0.05] py-1 pl-3 pr-2 text-xs font-medium text-[#B91C1C]"
                  >
                    {chip.label}
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B91C1C]/10 transition-colors hover:bg-[#B91C1C]/20"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Warnings */}
            {!viewer.profileComplete && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3.5 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  {language === "ta"
                    ? "ஆர்வக் கோரிக்கைகளை அனுப்புவதற்கு முன் உங்கள் சுயவிவரத்தை முழுமையாக்குங்கள்."
                    : "Complete your profile before sending interest requests. You can still browse verified members."}
                </p>
                <button
                  onClick={() => router.push("/edit-profile")}
                  className="btn-ghost shrink-0 border-amber-300 bg-white px-3.5 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50"
                >
                  {language === "ta" ? "சுயவிவரம் முழுமையாக்கு" : "Complete Profile"}
                </button>
              </div>
            )}

            {directoryMode === "broader-directory" && profiles.length > 0 && (
              <div className="panel-muted mt-3 px-4 py-3 text-sm leading-relaxed text-slate-500">
                {language === "ta"
                  ? "உங்கள் பொருத்தக் குழுவில் அங்கீகரிக்கப்பட்ட சுயவிவரங்கள் இல்லாததால் விரிவான பட்டியலை நீங்கள் பார்க்கிறீர்கள்."
                  : "No approved profiles are available in your preferred matching pool right now, so you are seeing the broader approved member directory instead."}
              </div>
            )}
          </section>

          {/* ── Results ──────────────────────────────────────────────────── */}
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                {language === "ta" ? "காண்பிக்கப்படுகிறது " : "Showing "}
                <span className="font-semibold text-slate-800">{filteredProfiles.length}</span>
                {language === "ta"
                  ? ` / ${profiles.length} சரிபார்க்கப்பட்ட சுயவிவரங்கள்`
                  : ` of ${profiles.length} verified profiles`}
              </p>
            </div>

            {filteredProfiles.length === 0 ? (
              <EmptyState
                title={
                  profiles.length === 0
                    ? language === "ta" ? "இப்போது அங்கீகரிக்கப்பட்ட சுயவிவரங்கள் இல்லை" : "No approved profiles available"
                    : language === "ta" ? "வடிகட்டிகளுக்கு பொருந்தும் சுயவிவரங்கள் இல்லை" : "No profiles match the current filters"
                }
                description={
                  profiles.length === 0
                    ? language === "ta" ? "மேலும் சுயவிவரங்கள் அங்கீகரிக்கப்படும் போது தோன்றும்." : "As more profiles are approved, they will appear here."
                    : language === "ta" ? "வடிகட்டிகளை மாற்றி மீண்டும் முயற்சிக்கவும்." : "Try broadening or clearing some of the active filters."
                }
                icon={Search}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProfiles.map((profile, index) => {
                  const requestStatus = requestStatusByUserId[profile.userId];
                  const hasCompatibleGender =
                    !viewer.gender || viewer.gender.toLowerCase() !== profile.gender.toLowerCase();

                  return (
                    <motion.div
                      key={profile.userId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="panel-surface elevated-card flex flex-col p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                            {profile.profilePhotoUrl ? (
                              <img src={profile.profilePhotoUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                            ) : (
                              <UserRound className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold text-slate-900">{profile.fullName}</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {profile.age} {language === "ta" ? "வயது" : "yrs"}&nbsp;&middot;&nbsp;
                              {translateDisplayValue(profile.occupation, language)}
                            </p>
                          </div>
                        </div>
                        <StatusBadge label={profile.profileStatus.toLowerCase()} tone={getProfileTone(profile.profileStatus)} />
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B91C1C]/60" />
                        <span className="truncate">
                          {translateDisplayValue(profile.city, language)}, {translateDisplayValue(profile.state, language)}
                        </span>
                      </div>

                      <dl className="mt-3 grid gap-1">
                        <ProfileMeta label={language === "ta" ? "கல்வி" : "Education"} value={profile.education} />
                        <ProfileMeta label={language === "ta" ? "திருமண நிலை" : "Marital Status"} value={profile.maritalStatus} />
                        <ProfileMeta label={language === "ta" ? "உயரம்" : "Height"} value={profile.height} />
                        <ProfileMeta label={language === "ta" ? "சாதி" : "Caste"} value={profile.caste} />
                        <ProfileMeta label={language === "ta" ? "வருமானம்" : "Income"} value={profile.annualIncome} />
                      </dl>

                      {profile.about ? (
                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">{profile.about}</p>
                      ) : null}

                      {profile.interests.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {profile.interests.slice(0, 4).map((interest) => (
                            <span key={interest} className="tag-pill">
                              {translateInterestLabel(interest, language)}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex items-center gap-2 pt-4">
                        <button onClick={() => router.push(`/profile/${profile.userId}`)} className="btn-secondary flex-1 py-2.5 text-xs">
                          {language === "ta" ? "சுயவிவரத்தை காண்க" : "View Profile"}
                        </button>
                        {requestStatus ? (
                          <div className="flex flex-1 justify-center">
                            <StatusBadge label={requestStatus.replace("_", " ")} tone={getInterestTone(requestStatus)} />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleInterest(profile.userId)}
                            disabled={!viewer.profileComplete || !hasCompatibleGender || submittingFor === profile.userId}
                            className="btn-primary flex-1 py-2.5 text-xs"
                          >
                            {submittingFor === profile.userId ? (
                              <>
                                <AnimatedHeartIcon className="h-3.5 w-3.5" active animateKey={heartBurst?.userId === profile.userId ? heartBurst.key : null} />
                                <span>{language === "ta" ? "அனுப்புகிறது…" : "Sending…"}</span>
                              </>
                            ) : !hasCompatibleGender ? (
                              <span>{translateUiTerm("browse only", language)}</span>
                            ) : !viewer.profileComplete ? (
                              <span>{language === "ta" ? "முதலில் சுயவிவரத்தை முடிக்கவும்" : "Complete profile first"}</span>
                            ) : (
                              <>
                                <AnimatedHeartIcon className="h-3.5 w-3.5" active animateKey={heartBurst?.userId === profile.userId ? heartBurst.key : null} />
                                <span>{language === "ta" ? "ஆர்வம் தெரிவி" : "Show Interest"}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ── Filter drawer overlay ─────────────────────────────────────────── */}
        {isMounted
          ? createPortal(
              <AnimatePresence>
                {drawerOpen && (
                  <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={() => setDrawerOpen(false)}
              />

              {/* Drawer panel */}
              <motion.aside
                key="drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 z-50 flex h-dvh max-h-dvh min-h-0 w-full max-w-[360px] flex-col overflow-hidden bg-white shadow-2xl"
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <Settings2 className="h-4 w-4 text-[#B91C1C]" />
                    <span className="font-display text-base font-semibold text-slate-900">
                      {language === "ta" ? "அனைத்து வடிகட்டிகள்" : "All Filters"}
                    </span>
                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#B91C1C] px-1.5 text-[10px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-xs font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
                      >
                        {language === "ta" ? "மீட்டமை" : "Reset all"}
                      </button>
                    )}
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Drawer body — scrollable */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

                  {/* Age range */}
                  <DrawerSection
                    id="age"
                    label={language === "ta" ? "வயது வரம்பு" : "Age Range"}
                    expanded={expandedSections.has("age")}
                    onToggle={() => toggleSection("age")}
                  >
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <div className="meta-label mb-1.5">{language === "ta" ? "குறைந்தது" : "Min age"}</div>
                        <InputControl type="number" min={18} max={60} value={filters.ageRange[0]} onChange={(e) => updateMinAge(e.target.value)} className="min-h-9 text-sm" />
                      </div>
                      <span className="mb-2.5 text-sm text-slate-300">–</span>
                      <div className="flex-1">
                        <div className="meta-label mb-1.5">{language === "ta" ? "அதிகபட்சம்" : "Max age"}</div>
                        <InputControl type="number" min={18} max={60} value={filters.ageRange[1]} onChange={(e) => updateMaxAge(e.target.value)} className="min-h-9 text-sm" />
                      </div>
                    </div>
                  </DrawerSection>

                  {/* Background */}
                  <DrawerSection
                    id="background"
                    label={language === "ta" ? "பின்னணி" : "Background"}
                    expanded={expandedSections.has("background")}
                    onToggle={() => toggleSection("background")}
                  >
                    <div className="grid gap-3">
                      {options.maritalStatus.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "திருமண நிலை" : "Marital Status"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.maritalStatus} onChange={(v) => setFilter("maritalStatus", v)} options={options.maritalStatus} />
                      )}
                      {options.religion.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "மதம்" : "Religion"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.religion} onChange={(v) => setFilter("religion", v)} options={options.religion} />
                      )}
                      {options.caste.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "சாதி" : "Caste"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.caste} onChange={(v) => setFilter("caste", v)} options={options.caste} />
                      )}
                    </div>
                  </DrawerSection>

                  {/* Location */}
                  <DrawerSection
                    id="location"
                    label={language === "ta" ? "இடம்" : "Location"}
                    expanded={expandedSections.has("location")}
                    onToggle={() => toggleSection("location")}
                  >
                    <div className="grid gap-3">
                      {options.state.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "மாநிலம்" : "State"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.state} onChange={(v) => setFilter("state", v)} options={options.state} />
                      )}
                      {options.city.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "நகரம்" : "City"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.city} onChange={(v) => setFilter("city", v)} options={options.city} />
                      )}
                    </div>
                  </DrawerSection>

                  {/* Education & Career */}
                  <DrawerSection
                    id="education"
                    label={language === "ta" ? "கல்வி & தொழில்" : "Education & Career"}
                    expanded={expandedSections.has("education")}
                    onToggle={() => toggleSection("education")}
                  >
                    <div className="grid gap-3">
                      {options.education.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "கல்வி" : "Education"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.education} onChange={(v) => setFilter("education", v)} options={options.education} />
                      )}
                      {options.occupation.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "தொழில்" : "Occupation"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.occupation} onChange={(v) => setFilter("occupation", v)} options={options.occupation} />
                      )}
                      {options.income.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "வருட வருமானம்" : "Annual Income"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.income} onChange={(v) => setFilter("income", v)} options={options.income} />
                      )}
                    </div>
                  </DrawerSection>

                  {/* Lifestyle */}
                  <DrawerSection
                    id="lifestyle"
                    label={language === "ta" ? "வாழ்க்கை முறை" : "Lifestyle"}
                    expanded={expandedSections.has("lifestyle")}
                    onToggle={() => toggleSection("lifestyle")}
                  >
                    <div className="grid gap-3">
                      {options.diet.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "உணவு வகை" : "Diet"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.diet} onChange={(v) => setFilter("diet", v)} options={options.diet} />
                      )}
                      {options.smoking.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "புகையிலை" : "Smoking"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.smoking} onChange={(v) => setFilter("smoking", v)} options={options.smoking} />
                      )}
                      {options.drinking.length > 0 && (
                        <DrawerFilter label={language === "ta" ? "மது" : "Drinking"} allLabel={language === "ta" ? "அனைத்தும்" : "Any"} value={filters.drinking} onChange={(v) => setFilter("drinking", v)} options={options.drinking} />
                      )}
                    </div>
                  </DrawerSection>

                  {/* Other */}
                  <DrawerSection
                    id="other"
                    label={language === "ta" ? "பிற விருப்பங்கள்" : "Other"}
                    expanded={expandedSections.has("other")}
                    onToggle={() => toggleSection("other")}
                  >
                    <button
                      type="button"
                      onClick={() => setFilter("photoOnly", !filters.photoOnly)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors",
                        filters.photoOnly
                          ? "border-[#B91C1C]/25 bg-[#B91C1C]/[0.05] text-[#B91C1C]"
                          : "border-slate-200 bg-slate-50/60 text-slate-600 hover:border-slate-300",
                      )}
                    >
                      <span className="font-medium">
                        {language === "ta" ? "புகைப்படம் உள்ளவை மட்டும்" : "With photo only"}
                      </span>
                      <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border transition-colors", filters.photoOnly ? "border-[#B91C1C] bg-[#B91C1C]" : "border-slate-300 bg-white")}>
                        {filters.photoOnly && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  </DrawerSection>
                </div>

                {/* Drawer footer */}
                <div className="border-t border-slate-100 px-5 py-4">
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="btn-primary w-full py-3"
                  >
                    {language === "ta"
                      ? `${filteredProfiles.length} சுயவிவரங்களை காண்க`
                      : `View ${filteredProfiles.length} profile${filteredProfiles.length !== 1 ? "s" : ""}`}
                  </button>
                </div>
              </motion.aside>
                  </>
                )}
              </AnimatePresence>,
              document.body,
            )
          : null}
      </div>
    </PageTransition>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

/** Pill-shaped select for the quick filter row */
function QuickPill({
  label,
  allLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  allLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const { language } = useLanguage();
  const isActive = value !== "all";
  return (
    <SelectControl
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="sm"
      containerClassName="w-auto shrink-0"
      className={cn(
        "!w-auto min-w-[9.5rem] rounded-full pr-10 text-sm font-medium whitespace-nowrap shadow-none",
        isActive
          ? "border-[#B91C1C]/30 bg-[#B91C1C]/[0.06] text-[#B91C1C] hover:border-[#B91C1C]/35"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
      )}
    >
      <option value="all">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {translateDisplayValue(opt, language)}
        </option>
      ))}
    </SelectControl>
  );
}

/** Accordion section header in the drawer */
function DrawerSection({
  id,
  label,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key={`${id}-body`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Labelled select inside the drawer */
function DrawerFilter({
  label,
  allLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  allLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const { language } = useLanguage();
  return (
    <div>
      <div className="meta-label mb-1.5">{label}</div>
      <SelectControl value={value} onChange={(e) => onChange(e.target.value)} size="sm">
        <option value="all">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {translateDisplayValue(opt, language)}
          </option>
        ))}
      </SelectControl>
    </div>
  );
}

function ProfileMeta({ label, value }: { label: string; value: string }) {
  const { language } = useLanguage();
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100/80 py-1.5 last:border-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</dt>
      <dd className="text-right text-xs font-semibold text-slate-700">
        {translateDisplayValue(value, language)}
      </dd>
    </div>
  );
}
