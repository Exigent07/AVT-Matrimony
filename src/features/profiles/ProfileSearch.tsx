"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { AnimatedHeartIcon } from "@/components/shared/AnimatedHeartIcon";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
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
      toast.success("Interest request sent.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send interest.");
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
        <AuthHeader viewer={viewer} backTo="/dashboard" backLabel="Dashboard" />

        <div className="section-shell section-block pt-4 md:pt-6">
          <section className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-label">Match Discovery</span>
                <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Search profiles</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Browse verified member profiles and express interest only when the match feels
                  aligned with your expectations.
                </p>
              </div>
              <div className="panel-muted px-4 py-3 text-[13px] font-semibold text-slate-500">
                Signed in as {viewer.fullName}
              </div>
            </div>

            <div className="mt-7 grid gap-3 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="input-field pl-10"
                  placeholder="Search by name, city, occupation, or caste"
                />
              </div>

              <FilterSelect label="City" allLabel="All cities" value={selectedCity} onChange={setSelectedCity} options={cities} />
              <FilterSelect label="Education" allLabel="All education levels" value={selectedEducation} onChange={setSelectedEducation} options={educationOptions} />
              <div className="panel-muted px-3.5 py-2.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Age range</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number" min={18} max={60} value={ageRange[0]}
                    onChange={(event) => updateMinimumAge(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#B91C1C] transition-colors"
                  />
                  <span className="text-xs text-slate-400">to</span>
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
                <p>Complete your profile before sending interest requests. You can still browse verified members.</p>
                <button onClick={() => router.push("/edit-profile")} className="btn-ghost flex-shrink-0 border-amber-300 bg-white px-3.5 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50">
                  Complete Profile
                </button>
              </div>
            ) : null}

            {directoryMode === "broader-directory" && profiles.length > 0 ? (
              <div className="panel-muted mt-3 px-4 py-3 text-sm leading-relaxed text-slate-500">
                No approved profiles are available in your preferred matching pool right now, so you are seeing the broader approved member directory instead.
              </div>
            ) : null}
          </section>

          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-800">{filteredProfiles.length}</span> of {profiles.length} verified profiles
              </div>
              <button
                onClick={() => { setSearchQuery(""); setAgeRange(initialAgeRange); setSelectedCity("all"); setSelectedEducation("all"); }}
                className="text-[13px] font-semibold text-[#B91C1C] transition-colors hover:text-[#991B1B]"
              >
                Reset filters
              </button>
            </div>

            {filteredProfiles.length === 0 ? (
              <EmptyState
                title={profiles.length === 0 ? "No approved profiles are available right now" : "No profiles match the current filters"}
                description={profiles.length === 0 ? "As more member profiles are approved, they will appear here automatically." : "Try broadening the age range or clearing one of the active filters."}
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
                            <p className="mt-0.5 text-xs text-slate-500">{profile.age} yrs &middot; {profile.occupation}</p>
                          </div>
                        </div>
                        <StatusBadge label={profile.profileStatus.toLowerCase()} tone={getProfileTone(profile.profileStatus)} />
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-[#B91C1C]" />
                        <span>{profile.city}, {profile.state}</span>
                      </div>

                      <dl className="mt-4 grid gap-2 text-sm">
                        <ProfileMeta label="Education" value={profile.education} />
                        <ProfileMeta label="Height" value={profile.height} />
                        <ProfileMeta label="Caste" value={profile.caste} />
                        <ProfileMeta label="Income" value={profile.annualIncome} />
                      </dl>

                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{profile.about}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {profile.interests.slice(0, 4).map((interest) => (
                          <span key={interest} className="tag-pill">
                            {interest}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center gap-2.5">
                        <button
                          onClick={() => router.push(`/profile/${profile.userId}`)}
                          className="btn-secondary flex-1 py-2.5 text-xs"
                        >
                          View Profile
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
                                <span>Sending...</span>
                              </>
                            ) : !hasCompatibleGender ? (
                              <span>Browse only</span>
                            ) : !viewer.profileComplete ? (
                              <span>Complete profile first</span>
                            ) : (
                              <>
                                <AnimatedHeartIcon
                                  className="h-3.5 w-3.5"
                                  active
                                  animateKey={
                                    heartBurst?.userId === profile.userId ? heartBurst.key : null
                                  }
                                />
                                <span>Show Interest</span>
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
  return (
    <div className="panel-muted px-3.5 py-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full bg-transparent text-sm text-slate-700 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option === "all" ? allLabel : option}</option>
        ))}
      </select>
    </div>
  );
}

function ProfileMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-400 text-xs">{label}</dt>
      <dd className="text-right text-xs font-medium text-slate-700">{value}</dd>
    </div>
  );
}
