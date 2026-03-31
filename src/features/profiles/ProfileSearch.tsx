"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
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

export function ProfileSearch({
  viewer,
  profiles,
  requestStatusByUserId,
  directoryMode,
}: ProfileSearchProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [ageRange, setAgeRange] = useState<[number, number]>(initialAgeRange);
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedEducation, setSelectedEducation] = useState("all");
  const [submittingFor, setSubmittingFor] = useState<string | null>(null);
  const [heartBurst, setHeartBurst] = useState<{ userId: string; key: number } | null>(null);

  const cities = useMemo(
    () => ["all", ...Array.from(new Set(profiles.map((profile) => profile.city))).sort()],
    [profiles],
  );
  const educationOptions = useMemo(
    () => ["all", ...Array.from(new Set(profiles.map((profile) => profile.education))).sort()],
    [profiles],
  );

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesQuery =
        !searchQuery ||
        [profile.fullName, profile.city, profile.occupation, profile.caste]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesAge = profile.age >= ageRange[0] && profile.age <= ageRange[1];
      const matchesCity = selectedCity === "all" || profile.city === selectedCity;
      const matchesEducation = selectedEducation === "all" || profile.education === selectedEducation;
      return matchesQuery && matchesAge && matchesCity && matchesEducation;
    });
  }, [ageRange, profiles, searchQuery, selectedCity, selectedEducation]);

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

  function updateMinimumAge(value: string) {
    const nextMin = clampAge(value, ageRange[0]);
    setAgeRange([Math.min(nextMin, ageRange[1]), Math.max(nextMin, ageRange[1])]);
  }

  function updateMaximumAge(value: string) {
    const nextMax = clampAge(value, ageRange[1]);
    setAgeRange([Math.min(ageRange[0], nextMax), Math.max(ageRange[0], nextMax)]);
  }

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="member" activeLink="search" viewer={viewer} />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-label">{language === "ta" ? "பொருத்தத் தேடல்" : "Match Discovery"}</span>
                <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                  {language === "ta" ? "சுயவிவரங்களைத் தேடுங்கள்" : "Search profiles"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {language === "ta"
                    ? "சரிபார்க்கப்பட்ட உறுப்பினர் சுயவிவரங்களைப் பார்வையிட்டு, உங்கள் எதிர்பார்ப்புகளுடன் பொருந்தும் போது மட்டுமே ஆர்வத்தைத் தெரிவிக்கவும்."
                    : "Browse verified member profiles and express interest only when the match feels aligned with your expectations."}
                </p>
              </div>
              <div className="panel-muted px-4 py-3 text-[13px] font-semibold text-slate-500">
                {language === "ta" ? `${viewer.fullName} ஆக உள்நுழைந்துள்ளீர்கள்` : `Signed in as ${viewer.fullName}`}
              </div>
            </div>

            <div className="mt-7 grid gap-3 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="input-field pl-10"
                  placeholder={language === "ta" ? "பெயர், நகரம், தொழில் அல்லது சாதி மூலம் தேடுங்கள்" : "Search by name, city, occupation, or caste"}
                />
              </div>

              <FilterSelect
                label={language === "ta" ? "நகரம்" : "City"}
                allLabel={language === "ta" ? "அனைத்து நகரங்களும்" : "All cities"}
                value={selectedCity}
                onChange={setSelectedCity}
                options={cities}
              />
              <FilterSelect
                label={language === "ta" ? "கல்வி" : "Education"}
                allLabel={language === "ta" ? "அனைத்து கல்வி நிலைகளும்" : "All education levels"}
                value={selectedEducation}
                onChange={setSelectedEducation}
                options={educationOptions}
              />
              <div className="panel-muted px-3.5 py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {language === "ta" ? "வயது வரம்பு" : "Age range"}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number" min={18} max={60} value={ageRange[0]}
                    onChange={(event) => updateMinimumAge(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#B91C1C] transition-colors"
                  />
                  <span className="text-xs text-slate-400">{language === "ta" ? "முதல்" : "to"}</span>
                  <input
                    type="number" min={18} max={60} value={ageRange[1]}
                    onChange={(event) => updateMaximumAge(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#B91C1C] transition-colors"
                  />
                </div>
              </div>
            </div>

            {!viewer.profileComplete ? (
              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3.5 text-sm text-amber-800 md:flex-row md:items-center md:justify-between">
                <p>
                  {language === "ta"
                    ? "ஆர்வக் கோரிக்கைகளை அனுப்புவதற்கு முன் உங்கள் சுயவிவரத்தை முழுமையாக்குங்கள். சரிபார்க்கப்பட்ட உறுப்பினர்களை இன்னும் பார்வையிடலாம்."
                    : "Complete your profile before sending interest requests. You can still browse verified members."}
                </p>
                <button onClick={() => router.push("/edit-profile")} className="btn-ghost flex-shrink-0 border-amber-300 bg-white px-3.5 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">
                  {language === "ta" ? "சுயவிவரம் முழுமையாக்கு" : "Complete Profile"}
                </button>
              </div>
            ) : null}

            {directoryMode === "broader-directory" && profiles.length > 0 ? (
              <div className="panel-muted mt-3 px-4 py-3 text-sm leading-relaxed text-slate-500">
                {language === "ta"
                  ? "தற்போது உங்கள் விருப்பமான பொருத்தக் குழுவில் அங்கீகரிக்கப்பட்ட சுயவிவரங்கள் இல்லை, ஆகவே விரிவான அங்கீகரிக்கப்பட்ட உறுப்பினர் பட்டியலை நீங்கள் பார்க்கிறீர்கள்."
                  : "No approved profiles are available in your preferred matching pool right now, so you are seeing the broader approved member directory instead."}
              </div>
            ) : null}
          </section>

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-sm text-slate-500">
                {language === "ta" ? "காண்பிக்கப்படுகிறது " : "Showing "}
                <span className="font-semibold text-slate-800">{filteredProfiles.length}</span>
                {language === "ta"
                  ? ` / ${profiles.length} சரிபார்க்கப்பட்ட சுயவிவரங்கள்`
                  : ` of ${profiles.length} verified profiles`}
              </div>
              <button
                onClick={() => { setSearchQuery(""); setAgeRange(initialAgeRange); setSelectedCity("all"); setSelectedEducation("all"); }}
                className="text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
              >
                {language === "ta" ? "வடிகட்டிகளை மீட்டமை" : "Reset filters"}
              </button>
            </div>

            {filteredProfiles.length === 0 ? (
              <EmptyState
                title={
                  profiles.length === 0
                    ? language === "ta" ? "இப்போது அங்கீகரிக்கப்பட்ட சுயவிவரங்கள் எதுவும் இல்லை" : "No approved profiles are available right now"
                    : language === "ta" ? "தற்போதைய வடிகட்டிகளுக்கு பொருந்தும் சுயவிவரங்கள் இல்லை" : "No profiles match the current filters"
                }
                description={
                  profiles.length === 0
                    ? language === "ta" ? "மேலும் உறுப்பினர் சுயவிவரங்கள் அங்கீகரிக்கப்படும் போது அவை தானாகவே இங்கே தோன்றும்." : "As more member profiles are approved, they will appear here automatically."
                    : language === "ta" ? "வயது வரம்பை விரிவாக்கி அல்லது செயலிலுள்ள ஒரு வடிகட்டியை நீக்கிப் பாருங்கள்." : "Try broadening the age range or clearing one of the active filters."
                }
                icon={Search}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProfiles.map((profile, index) => {
                  const requestStatus = requestStatusByUserId[profile.userId];
                  const hasCompatibleGender = !viewer.gender || viewer.gender.toLowerCase() !== profile.gender.toLowerCase();

                  return (
                    <motion.div
                      key={profile.userId}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="panel-surface p-5 transition-all duration-200 hover:border-[#B91C1C]/15"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#B91C1C]/[0.06] text-[#B91C1C]">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-base font-semibold text-slate-900 truncate" style={{ fontFamily: 'var(--font-display)' }}>{profile.fullName}</h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {profile.age} {language === "ta" ? "வயது" : "yrs"} &middot;{" "}
                              {translateDisplayValue(profile.occupation, language)}
                            </p>
                          </div>
                        </div>
                        <StatusBadge label={profile.profileStatus.toLowerCase()} tone={getProfileTone(profile.profileStatus)} />
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-[#B91C1C]" />
                        <span>
                          {translateDisplayValue(profile.city, language)},{" "}
                          {translateDisplayValue(profile.state, language)}
                        </span>
                      </div>

                      <dl className="mt-4 grid gap-2 text-sm">
                        <ProfileMeta label={language === "ta" ? "கல்வி" : "Education"} value={profile.education} />
                        <ProfileMeta label={language === "ta" ? "உயரம்" : "Height"} value={profile.height} />
                        <ProfileMeta label={language === "ta" ? "சாதி" : "Caste"} value={profile.caste} />
                        <ProfileMeta label={language === "ta" ? "வருமானம்" : "Income"} value={profile.annualIncome} />
                      </dl>

                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{profile.about}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {profile.interests.slice(0, 4).map((interest) => (
                          <span key={interest} className="tag-pill">
                            {translateInterestLabel(interest, language)}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center gap-2.5">
                        <button
                          onClick={() => router.push(`/profile/${profile.userId}`)}
                          className="btn-secondary flex-1 py-2.5 text-xs"
                        >
                          {language === "ta" ? "சுயவிவரத்தை காண்க" : "View Profile"}
                        </button>
                        {requestStatus ? (
                          <div className="flex-1 text-center">
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
                                <AnimatedHeartIcon
                                  className="h-3.5 w-3.5"
                                  active
                                  animateKey={
                                    heartBurst?.userId === profile.userId ? heartBurst.key : null
                                  }
                                />
                                <span>{language === "ta" ? "அனுப்புகிறது..." : "Sending..."}</span>
                              </>
                            ) : !hasCompatibleGender ? (
                              <span>{translateUiTerm("browse only", language)}</span>
                            ) : !viewer.profileComplete ? (
                              <span>{language === "ta" ? "முதலில் சுயவிவரத்தை முடிக்கவும்" : "Complete profile first"}</span>
                            ) : (
                              <>
                                <AnimatedHeartIcon
                                  className="h-3.5 w-3.5"
                                  active
                                  animateKey={
                                    heartBurst?.userId === profile.userId ? heartBurst.key : null
                                  }
                                />
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
      </div>
    </PageTransition>
  );
}

function FilterSelect({ label, allLabel, value, onChange, options }: {
  label: string; allLabel: string; value: string; onChange: (value: string) => void; options: string[];
}) {
  const { language } = useLanguage();

  return (
    <div className="panel-muted px-3.5 py-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full bg-transparent text-sm text-slate-700 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? allLabel : translateDisplayValue(option, language)}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProfileMeta({ label, value }: { label: string; value: string }) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-400 text-xs">{label}</dt>
      <dd className="text-right text-xs font-medium text-slate-700">
        {translateDisplayValue(value, language)}
      </dd>
    </div>
  );
}
