"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ImagePlus,
  ListChecks,
  Loader2,
  MapPin,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import { DateControl, SelectControl } from "@/components/shared/FormControls";
import { InterestsSelector } from "@/components/shared/InterestsSelector";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { requestJson } from "@/lib/client-request";
import { getProfileCompletionChecklist } from "@/lib/profile-completion";
import {
  buildProfileCompletionState,
  isProfilePlaceholderValue,
} from "@/lib/profile-utils";
import { useLanguage } from "@/providers/LanguageProvider";
import type { ProfileDetail, SessionViewer } from "@/types/domain";

interface EditProfileProps {
  viewer: SessionViewer;
  profile: ProfileDetail;
}

function buildHeightOptions() {
  return Array.from({ length: 20 }, (_, index) => {
    const cm = 150 + index * 2;
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}" (${cm} cm)`;
  });
}

function cleanDisplayValue(value: string | null | undefined) {
  return isProfilePlaceholderValue(value) ? "" : value ?? "";
}

function getProfileTone(status: SessionViewer["profileStatus"]) {
  if (status === "APPROVED") {
    return "success";
  }

  if (status === "REJECTED") {
    return "danger";
  }

  return "warning";
}

export function EditProfile({ viewer, profile }: EditProfileProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(profile.profilePhotoUrl);
  const [horoscopeImageUrl, setHoroscopeImageUrl] = useState<string | null>(
    profile.horoscopeImageUrl,
  );
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    gender: profile.gender.toLowerCase(),
    dateOfBirth: profile.dateOfBirth,
    community: cleanDisplayValue(profile.community),
    maritalStatus: cleanDisplayValue(profile.maritalStatus),
    height: cleanDisplayValue(profile.height),
    weight: profile.weightKg?.toString() ?? "",
    bodyType: cleanDisplayValue(profile.bodyType),
    complexion: cleanDisplayValue(profile.complexion),
    physicalStatus: cleanDisplayValue(profile.physicalStatus),
    religion: cleanDisplayValue(profile.religion),
    caste: cleanDisplayValue(profile.caste),
    subCaste: cleanDisplayValue(profile.subCaste),
    gothram: cleanDisplayValue(profile.gothram),
    star: cleanDisplayValue(profile.star),
    raasi: cleanDisplayValue(profile.raasi),
    country: cleanDisplayValue(profile.country) || "India",
    state: cleanDisplayValue(profile.state),
    city: cleanDisplayValue(profile.city),
    residencyStatus: cleanDisplayValue(profile.residencyStatus),
    education: cleanDisplayValue(profile.education),
    employedIn: cleanDisplayValue(profile.employedIn),
    occupation: cleanDisplayValue(profile.occupation),
    income: cleanDisplayValue(profile.annualIncome),
    familyStatus: cleanDisplayValue(profile.familyStatus),
    familyType: cleanDisplayValue(profile.familyType),
    fatherOccupation: cleanDisplayValue(profile.fatherOccupation),
    motherOccupation: cleanDisplayValue(profile.motherOccupation),
    brothers: profile.brothers?.toString() ?? "",
    sisters: profile.sisters?.toString() ?? "",
    diet: cleanDisplayValue(profile.diet),
    drinking: cleanDisplayValue(profile.drinking),
    smoking: cleanDisplayValue(profile.smoking),
    hobbies: cleanDisplayValue(profile.hobbies),
    about: cleanDisplayValue(profile.about),
    partnerAgeFrom: profile.partnerAgeFrom?.toString() ?? "",
    partnerAgeTo: profile.partnerAgeTo?.toString() ?? "",
    partnerHeight: cleanDisplayValue(profile.partnerHeight),
    partnerMaritalStatus: cleanDisplayValue(profile.partnerMaritalStatus),
    partnerEducation: cleanDisplayValue(profile.partnerEducation),
    partnerOccupation: cleanDisplayValue(profile.partnerOccupation),
    partnerIncome: cleanDisplayValue(profile.partnerIncome),
    partnerLocation: cleanDisplayValue(profile.partnerLocation),
    partnerExpectations: cleanDisplayValue(profile.partnerExpectations),
    email: profile.email ?? "",
    phone: profile.phone ?? "",
  });

  const heightOptions = useMemo(() => buildHeightOptions(), []);
  const completionState = useMemo(
    () =>
      buildProfileCompletionState({
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        height: formData.height,
        maritalStatus: formData.maritalStatus,
        profilePhotoUrl,
        community: formData.community,
        religion: formData.religion,
        caste: formData.caste,
        city: formData.city,
        state: formData.state,
        education: formData.education,
        occupation: formData.occupation,
        annualIncome: formData.income,
        about: formData.about,
        hobbies: formData.hobbies,
        selectedInterests,
        partnerExpectations: formData.partnerExpectations,
        email: formData.email,
        phone: formData.phone,
        horoscopeImageUrl,
      }),
    [formData, horoscopeImageUrl, profilePhotoUrl, selectedInterests],
  );
  const onboardingChecklist = useMemo(
    () =>
      getProfileCompletionChecklist(completionState, language, {
        limit: 6,
      }),
    [completionState, language],
  );
  const sectionLinks = useMemo(
    () => [
      { id: "personal", title: labelsByLanguage(language).personal },
      { id: "community", title: labelsByLanguage(language).community },
      { id: "professional", title: labelsByLanguage(language).professional },
      { id: "lifestyle", title: labelsByLanguage(language).lifestyle },
      { id: "partner", title: labelsByLanguage(language).partner },
      { id: "contact", title: labelsByLanguage(language).contact },
      { id: "interests", title: labelsByLanguage(language).interests },
    ],
    [language],
  );
  const labels = labelsByLanguage(language);

  function updateField<K extends keyof typeof formData>(key: K, value: string) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  async function readFile(file: File) {
    if (!file.type.startsWith("image/")) {
      throw new Error(labels.invalidImage);
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error(labels.imageTooLarge);
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(labels.readFileError));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileUpload(
    event: ChangeEvent<HTMLInputElement>,
    type: "profile" | "horoscope",
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFile(file);
      if (type === "profile") {
        setProfilePhotoUrl(dataUrl);
      } else {
        setHoroscopeImageUrl(dataUrl);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : labels.uploadError);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await requestJson("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          selectedInterests,
          profilePhotoUrl,
          horoscopeImageUrl,
        }),
      });
      toast.success(labels.updateSuccess);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : labels.updateError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell">
        <AppHeader mode="member" activeLink="edit-profile" viewer={viewer} />

        <div className="section-shell-narrow section-block pt-4 md:pt-6">
          <div className="hero-surface p-6 md:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="section-label">{labels.sectionLabel}</span>
                <h1
                  className="mt-3 text-4xl text-slate-900 md:text-5xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {labels.title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {labels.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={viewer.profileStatus ?? "PENDING"}
                  tone={getProfileTone(viewer.profileStatus)}
                />
                <StatusBadge
                  label={
                    completionState.isComplete
                      ? labels.profileReady
                      : `${completionState.percentage}% ${labels.completeSuffix}`
                  }
                  tone={completionState.isComplete ? "success" : "warning"}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
            <aside className="space-y-5 xl:sticky xl:top-28 self-start">
              <div className="panel-surface p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.5rem] border border-[#B91C1C]/12 bg-[#FBF7F0]">
                    {profilePhotoUrl ? (
                      <img
                        src={profilePhotoUrl}
                        alt={labels.profilePhotoPreviewAlt}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#B91C1C]">
                        <UserRound className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div
                      className="text-2xl text-slate-900"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {formData.fullName || labels.previewFallbackName}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {formData.occupation || labels.previewFallbackRole}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 text-[#B91C1C]" />
                      <span>
                        {[formData.city, formData.state].filter(Boolean).join(", ") ||
                          labels.previewFallbackLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {horoscopeImageUrl ? (
                  <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[#B91C1C]/10 bg-[#FBF7F0]">
                    <img
                      src={horoscopeImageUrl}
                      alt={labels.horoscopePreviewAlt}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <div className="panel-surface p-5 md:p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#B91C1C]" />
                  <h2
                    className="text-xl text-slate-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {labels.completionTitle}
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {labels.completionDescription}
                </p>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[13px] font-medium text-slate-500">
                    <span>{labels.requiredProgressLabel}</span>
                    <span>
                      {completionState.requiredCompletedCount}/{completionState.requiredCount}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#B91C1C] transition-[width] duration-300"
                      style={{ width: `${completionState.percentage}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#B91C1C]">
                    {completionState.percentage}% {labels.completeSuffix}
                  </div>
                </div>

                <div className="panel-muted mt-5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <ListChecks className="h-4 w-4 text-[#B91C1C]" />
                    <span>{labels.onboardingTitle}</span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {onboardingChecklist.length === 0 ? (
                      <p className="text-sm leading-relaxed text-slate-500">
                        {labels.onboardingComplete}
                      </p>
                    ) : (
                      onboardingChecklist.map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="tag-pill">{item.sectionLabel}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="panel-surface p-5 md:p-6">
                <div className="text-sm font-semibold text-slate-800">{labels.jumpToTitle}</div>
                <div className="mt-4 grid gap-2">
                  {sectionLinks.map((link) => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      className="panel-muted px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-[#B91C1C]/18 hover:bg-white hover:text-slate-900"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Section
                id="personal"
                title={labels.personal}
                description={labels.personalDescription}
              >
                <FieldGrid>
                  <Field label={labels.fullName}>
                    <input
                      value={formData.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label={labels.gender}>
                    <SelectControl
                      value={formData.gender}
                      onChange={(event) => updateField("gender", event.target.value)}
                      required
                    >
                      <option value="male">{labels.male}</option>
                      <option value="female">{labels.female}</option>
                    </SelectControl>
                  </Field>
                  <Field label={labels.dob}>
                    <DateControl
                      value={formData.dateOfBirth}
                      onChange={(event) => updateField("dateOfBirth", event.target.value)}
                      required
                    />
                  </Field>
                  <Field label={labels.maritalStatus}>
                    <SelectControl
                      value={formData.maritalStatus}
                      onChange={(event) => updateField("maritalStatus", event.target.value)}
                      required
                    >
                      <option value="Never Married">{labels.neverMarried}</option>
                      <option value="Divorced">{labels.divorced}</option>
                      <option value="Widowed">{labels.widowed}</option>
                    </SelectControl>
                  </Field>
                  <Field label={labels.height}>
                    <SelectControl
                      value={formData.height}
                      onChange={(event) => updateField("height", event.target.value)}
                      required
                    >
                      <option value="">{labels.selectHeight}</option>
                      {heightOptions.map((height) => (
                        <option key={height} value={height}>
                          {height}
                        </option>
                      ))}
                    </SelectControl>
                  </Field>
                  <Field label={labels.weight}>
                    <input
                      value={formData.weight}
                      onChange={(event) => updateField("weight", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section
                id="community"
                title={labels.community}
                description={labels.communityDescription}
              >
                <FieldGrid>
                  <Field label={labels.communityLabel}>
                    <input
                      value={formData.community}
                      onChange={(event) => updateField("community", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.religion}>
                    <input
                      value={formData.religion}
                      onChange={(event) => updateField("religion", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.caste}>
                    <input
                      value={formData.caste}
                      onChange={(event) => updateField("caste", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label={labels.subCaste}>
                    <input
                      value={formData.subCaste}
                      onChange={(event) => updateField("subCaste", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.gothram}>
                    <input
                      value={formData.gothram}
                      onChange={(event) => updateField("gothram", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.star}>
                    <input
                      value={formData.star}
                      onChange={(event) => updateField("star", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.raasi}>
                    <input
                      value={formData.raasi}
                      onChange={(event) => updateField("raasi", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.country}>
                    <input
                      value={formData.country}
                      onChange={(event) => updateField("country", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.state}>
                    <input
                      value={formData.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label={labels.city}>
                    <input
                      value={formData.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label={labels.residency}>
                    <input
                      value={formData.residencyStatus}
                      onChange={(event) => updateField("residencyStatus", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section
                id="professional"
                title={labels.professional}
                description={labels.professionalDescription}
              >
                <FieldGrid>
                  <Field label={labels.education}>
                    <input
                      value={formData.education}
                      onChange={(event) => updateField("education", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label={labels.employedIn}>
                    <input
                      value={formData.employedIn}
                      onChange={(event) => updateField("employedIn", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.occupation}>
                    <input
                      value={formData.occupation}
                      onChange={(event) => updateField("occupation", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label={labels.income}>
                    <input
                      value={formData.income}
                      onChange={(event) => updateField("income", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.familyStatus}>
                    <input
                      value={formData.familyStatus}
                      onChange={(event) => updateField("familyStatus", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.familyType}>
                    <input
                      value={formData.familyType}
                      onChange={(event) => updateField("familyType", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.fatherOccupation}>
                    <input
                      value={formData.fatherOccupation}
                      onChange={(event) => updateField("fatherOccupation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.motherOccupation}>
                    <input
                      value={formData.motherOccupation}
                      onChange={(event) => updateField("motherOccupation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.brothers}>
                    <input
                      value={formData.brothers}
                      onChange={(event) => updateField("brothers", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.sisters}>
                    <input
                      value={formData.sisters}
                      onChange={(event) => updateField("sisters", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section
                id="lifestyle"
                title={labels.lifestyle}
                description={labels.lifestyleDescription}
              >
                <FieldGrid>
                  <Field label={labels.diet}>
                    <input
                      value={formData.diet}
                      onChange={(event) => updateField("diet", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.drinking}>
                    <input
                      value={formData.drinking}
                      onChange={(event) => updateField("drinking", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.smoking}>
                    <input
                      value={formData.smoking}
                      onChange={(event) => updateField("smoking", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.hobbies} className="md:col-span-2">
                    <input
                      value={formData.hobbies}
                      onChange={(event) => updateField("hobbies", event.target.value)}
                      className="input-field"
                      placeholder={labels.hobbiesPlaceholder}
                    />
                  </Field>
                  <Field label={labels.about} className="md:col-span-2">
                    <textarea
                      value={formData.about}
                      onChange={(event) => updateField("about", event.target.value)}
                      className="input-field min-h-32"
                      placeholder={labels.aboutPlaceholder}
                      required
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section
                id="partner"
                title={labels.partner}
                description={labels.partnerDescription}
              >
                <FieldGrid>
                  <Field label={labels.partnerAgeFrom}>
                    <input
                      value={formData.partnerAgeFrom}
                      onChange={(event) => updateField("partnerAgeFrom", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerAgeTo}>
                    <input
                      value={formData.partnerAgeTo}
                      onChange={(event) => updateField("partnerAgeTo", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerHeight}>
                    <input
                      value={formData.partnerHeight}
                      onChange={(event) => updateField("partnerHeight", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerMaritalStatus}>
                    <input
                      value={formData.partnerMaritalStatus}
                      onChange={(event) =>
                        updateField("partnerMaritalStatus", event.target.value)
                      }
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerEducation}>
                    <input
                      value={formData.partnerEducation}
                      onChange={(event) => updateField("partnerEducation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerOccupation}>
                    <input
                      value={formData.partnerOccupation}
                      onChange={(event) => updateField("partnerOccupation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerIncome}>
                    <input
                      value={formData.partnerIncome}
                      onChange={(event) => updateField("partnerIncome", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerLocation}>
                    <input
                      value={formData.partnerLocation}
                      onChange={(event) => updateField("partnerLocation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label={labels.partnerExpectations} className="md:col-span-2">
                    <textarea
                      value={formData.partnerExpectations}
                      onChange={(event) =>
                        updateField("partnerExpectations", event.target.value)
                      }
                      className="input-field min-h-28"
                      placeholder={labels.partnerExpectationsPlaceholder}
                      required
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section
                id="contact"
                title={labels.contact}
                description={labels.contactDescription}
              >
                <FieldGrid>
                  <Field label={labels.email}>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label={labels.phone}>
                    <input
                      value={formData.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                </FieldGrid>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <UploadCard
                    title={labels.profilePhoto}
                    value={profilePhotoUrl}
                    onChange={(event) => handleFileUpload(event, "profile")}
                    uploadedHint={labels.uploadedHint}
                    uploadHint={labels.uploadHint}
                    previewLabel={labels.previewLabel}
                    actionLabel={labels.replaceImage}
                    placeholderLabel={labels.profilePhotoPlaceholder}
                    alt={labels.profilePhotoPreviewAlt}
                  />
                  <UploadCard
                    title={labels.horoscope}
                    value={horoscopeImageUrl}
                    onChange={(event) => handleFileUpload(event, "horoscope")}
                    uploadedHint={labels.uploadedHint}
                    uploadHint={labels.uploadHint}
                    previewLabel={labels.previewLabel}
                    actionLabel={labels.replaceImage}
                    placeholderLabel={labels.horoscopePlaceholder}
                    alt={labels.horoscopePreviewAlt}
                  />
                </div>
              </Section>

              <Section
                id="interests"
                title={labels.interests}
                description={labels.interestsDescription}
              >
                <InterestsSelector
                  selectedInterests={selectedInterests}
                  onInterestsChange={setSelectedInterests}
                />
              </Section>

              <div className="panel-surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{labels.saveTitle}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {labels.saveDescription}
                  </p>
                </div>

                <button type="submit" disabled={isSaving} className="btn-primary">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{labels.saving}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{labels.saveChanges}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="panel-surface scroll-mt-28 p-6 md:p-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-[13px] font-medium text-slate-600">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function UploadCard({
  title,
  value,
  onChange,
  uploadedHint,
  uploadHint,
  previewLabel,
  actionLabel,
  placeholderLabel,
  alt,
}: {
  title: string;
  value: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadedHint: string;
  uploadHint: string;
  previewLabel: string;
  actionLabel: string;
  placeholderLabel: string;
  alt: string;
}) {
  return (
    <label className="panel-muted block cursor-pointer p-4 transition-all duration-200 hover:border-slate-300 hover:bg-white">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          <div className="mt-1 text-xs text-slate-400">
            {value ? uploadedHint : uploadHint}
          </div>
        </div>
        <span className="btn-ghost px-3 py-2 text-xs">{actionLabel}</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[#B91C1C]/10 bg-[#FBF7F0]">
        {value ? (
          <img src={value} alt={alt} className="aspect-[5/4] w-full object-cover" />
        ) : (
          <div className="flex aspect-[5/4] flex-col items-center justify-center gap-2 text-center text-slate-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#B91C1C] shadow-sm">
              <ImagePlus className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium text-slate-500">{placeholderLabel}</div>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {previewLabel}
      </div>
      <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
    </label>
  );
}

function labelsByLanguage(language: "en" | "ta") {
  return language === "ta"
    ? {
        invalidImage: "சரியான படிமக் கோப்பை பதிவேற்றவும்.",
        imageTooLarge: "2 MB-க்கு குறைவான படத்தை பதிவேற்றவும்.",
        readFileError: "தேர்ந்தெடுத்த கோப்பை வாசிக்க முடியவில்லை.",
        uploadError: "படத்தை பதிவேற்ற முடியவில்லை.",
        updateSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
        updateError: "சுயவிவரத்தை புதுப்பிக்க முடியவில்லை.",
        sectionLabel: "சுயவிவர திருத்தி",
        title: "சுயவிவரத்தைத் திருத்தவும்",
        description:
          "உங்கள் சுயவிவரத்தை நேர்மையாகவும், முழுமையாகவும், பரிசீலனைக்கு தயாராகவும் வைத்திருக்க இந்த பணிமனை உதவுகிறது. முக்கிய திருத்தங்களுக்குப் பிறகு அங்கீகரிக்கப்பட்ட சுயவிவரங்கள் மீண்டும் பரிசீலனைக்கு செல்லும்.",
        personal: "தனிப்பட்ட தகவல்",
        personalDescription:
          "அடிப்படை அடையாளம், வயது, மற்றும் திருமணச் சுயவிவர விவரங்களைத் துல்லியமாக வைத்திருக்கவும்.",
        community: "சமூகம் மற்றும் இடம்",
        communityDescription:
          "குடும்ப பின்னணி, சமூக விவரங்கள், மற்றும் தற்போதைய இருப்பிடத்தை சீர்படுத்தவும்.",
        professional: "தொழில் மற்றும் குடும்ப விவரங்கள்",
        professionalDescription:
          "கல்வி, தொழில், வருமானம், மற்றும் குடும்ப அமைப்பு போன்ற தகவல்களைப் புதுப்பிக்கவும்.",
        lifestyle: "வாழ்க்கை முறை மற்றும் சுயவிவரக் கதை",
        lifestyleDescription:
          "உங்கள் குரல், வாழ்க்கை முறை, மற்றும் தனிப்பட்ட கதை உறுப்பினர்களுக்கு எப்படி தெரியவேண்டும் என்பதை எழுதவும்.",
        partner: "இணைவர் விருப்பங்கள்",
        partnerDescription:
          "உங்கள் எதிர்பார்ப்புகளை தெளிவாகச் சொல்வதால் சரியான பொருத்தங்களைத் தேர்ந்தெடுக்க உதவும்.",
        contact: "தொடர்பு மற்றும் சுயவிவர ஆவணங்கள்",
        contactDescription:
          "உங்கள் தொடர்பு விவரங்களைச் சரியாக வைத்துக் கொண்டு, சுயவிவரப் படம் மற்றும் ஜாதகப் படத்தை முன்னோட்டத்துடன் சேர்க்கவும்.",
        interests: "விருப்பங்கள்",
        interestsDescription:
          "உங்கள் தனிப்பட்ட விருப்பங்கள், ஆர்வங்கள், மற்றும் வாழ்க்கை முறை சுட்டிகளைக் குறிக்கவும்.",
        fullName: "முழுப் பெயர்",
        gender: "பாலினம்",
        male: "ஆண்",
        female: "பெண்",
        dob: "பிறந்த தேதி",
        maritalStatus: "திருமண நிலை",
        neverMarried: "திருமணம் ஆகாதவர்",
        divorced: "விவாகரத்து",
        widowed: "விதவை / விதவன்",
        height: "உயரம்",
        selectHeight: "உயரத்தைத் தேர்ந்தெடுக்கவும்",
        weight: "எடை (கிலோ)",
        communityLabel: "சமூகம்",
        religion: "மதம்",
        caste: "சாதி",
        subCaste: "உபசாதி",
        gothram: "கோத்திரம்",
        star: "நட்சத்திரம்",
        raasi: "ராசி",
        country: "நாடு",
        state: "மாநிலம்",
        city: "நகரம்",
        residency: "வசிப்பு நிலை",
        education: "கல்வி",
        employedIn: "பணிபுரியும் துறை",
        occupation: "தொழில்",
        income: "வருடாந்திர வருமானம்",
        familyStatus: "குடும்ப நிலை",
        familyType: "குடும்ப வகை",
        fatherOccupation: "தந்தையின் தொழில்",
        motherOccupation: "தாயின் தொழில்",
        brothers: "அண்ணன் / தம்பிகள்",
        sisters: "அக்கா / தங்கைகள்",
        diet: "உணவு பழக்கம்",
        drinking: "மதுபானம்",
        smoking: "புகைபிடித்தல்",
        hobbies: "விருப்ப செயல்கள்",
        hobbiesPlaceholder: "கமா கொண்டு பிரிக்கப்பட்ட விருப்பங்கள்",
        about: "உங்களைப் பற்றி",
        aboutPlaceholder: "உங்கள் குணம், வாழ்க்கை முறை, குடும்ப மதிப்புகள், மற்றும் எதிர்பார்ப்புகளை இயல்பாக எழுதுங்கள்.",
        partnerAgeFrom: "விருப்ப வயது தொடக்கம்",
        partnerAgeTo: "விருப்ப வயது முடிவு",
        partnerHeight: "விருப்ப உயரம்",
        partnerMaritalStatus: "விருப்ப திருமண நிலை",
        partnerEducation: "விருப்ப கல்வி",
        partnerOccupation: "விருப்ப தொழில்",
        partnerIncome: "விருப்ப வருமானம்",
        partnerLocation: "விருப்ப இடம்",
        partnerExpectations: "இணைவர் எதிர்பார்ப்புகள்",
        partnerExpectationsPlaceholder:
          "உங்களுக்கு பொருத்தமான இணைவரைப் பற்றி அன்பாகவும் தெளிவாகவும் எழுதுங்கள்.",
        email: "மின்னஞ்சல் முகவரி",
        phone: "தொலைபேசி எண்",
        profilePhoto: "சுயவிவரப் படம்",
        horoscope: "ஜாதக படம்",
        uploadedHint: "படம் பதிவேற்றப்பட்டது. மாற்ற புதிய கோப்பைத் தேர்ந்தெடுக்கவும்.",
        uploadHint: "2 MB-க்கு குறைவான JPG அல்லது PNG கோப்பை பதிவேற்றவும்.",
        previewLabel: "நேரடி முன்னோட்டம்",
        replaceImage: "படத்தை மாற்றவும்",
        profilePhotoPlaceholder: "சுயவிவரப் படம் முன்னோட்டம்",
        horoscopePlaceholder: "ஜாதகப் படம் முன்னோட்டம்",
        profilePhotoPreviewAlt: "சுயவிவரப் படம் முன்னோட்டம்",
        horoscopePreviewAlt: "ஜாதகப் படம் முன்னோட்டம்",
        completionTitle: "நிறைவு முன்னேற்றம்",
        completionDescription:
          "முழு உறுப்பினர் அனுபவத்தைத் திறக்க அத்தியாவசிய புலங்கள், கதை, மற்றும் ஊடகங்களை முடிக்கவும்.",
        requiredProgressLabel: "தேவையான புலங்கள்",
        onboardingTitle: "அடுத்ததாக நிரப்ப வேண்டியது",
        onboardingComplete:
          "அத்தியாவசிய நிறைவு சரியாக உள்ளது. இப்போது விருப்பமான கூடுதல் விவரங்களைச் சேர்த்து சுயவிவரத்தை வலுப்படுத்தலாம்.",
        jumpToTitle: "பிரிவுகளுக்குத் தாவவும்",
        saveTitle: "மாற்றங்களை சேமிக்க தயாராக உள்ளீர்களா?",
        saveDescription:
          "முக்கிய மாற்றங்களுக்குப் பிறகு உங்கள் சுயவிவரம் மீண்டும் பரிசீலனை வரிசைக்குச் செல்லலாம்.",
        saving: "சுயவிவரம் சேமிக்கிறது",
        saveChanges: "மாற்றங்களைச் சேமிக்கவும்",
        profileReady: "சுயவிவரம் தயார்",
        completeSuffix: "முடிந்தது",
        previewFallbackName: "உங்கள் பெயர்",
        previewFallbackRole: "உங்கள் தொழில் இங்கே தோன்றும்",
        previewFallbackLocation: "இட விவரம் சேர்க்கவும்",
      }
    : {
        invalidImage: "Please upload a valid image file.",
        imageTooLarge: "Please upload an image smaller than 2 MB.",
        readFileError: "Unable to read the selected file.",
        uploadError: "Unable to upload image.",
        updateSuccess: "Profile updated successfully.",
        updateError: "Unable to update profile.",
        sectionLabel: "Profile editor",
        title: "Edit profile",
        description:
          "This workspace helps you keep your profile accurate, complete, and review-ready. Approved profiles return to the review queue after material edits so member trust stays high.",
        personal: "Personal information",
        personalDescription:
          "Keep your identity, age, and member basics accurate before members or admins review the profile.",
        community: "Community and location",
        communityDescription:
          "Refine community details, family background, and current location so the profile reads cleanly.",
        professional: "Professional and family details",
        professionalDescription:
          "Update education, occupation, income, and family details that help build trust.",
        lifestyle: "Lifestyle and profile narrative",
        lifestyleDescription:
          "Shape how your personality, habits, and story come through to other members.",
        partner: "Partner preferences",
        partnerDescription:
          "Clear expectations help the product surface more relevant conversations and reduce friction.",
        contact: "Contact and profile assets",
        contactDescription:
          "Keep contact details accurate and add profile media with live previews before you save.",
        interests: "Interests",
        interestsDescription:
          "Choose the interests and lifestyle cues that make the profile feel more specific and human.",
        fullName: "Full name",
        gender: "Gender",
        male: "Male",
        female: "Female",
        dob: "Date of birth",
        maritalStatus: "Marital status",
        neverMarried: "Never Married",
        divorced: "Divorced",
        widowed: "Widowed",
        height: "Height",
        selectHeight: "Select height",
        weight: "Weight (kg)",
        communityLabel: "Community",
        religion: "Religion",
        caste: "Caste",
        subCaste: "Sub-caste",
        gothram: "Gothram",
        star: "Star",
        raasi: "Raasi",
        country: "Country",
        state: "State",
        city: "City",
        residency: "Residency status",
        education: "Education",
        employedIn: "Employed in",
        occupation: "Occupation",
        income: "Annual income",
        familyStatus: "Family status",
        familyType: "Family type",
        fatherOccupation: "Father's occupation",
        motherOccupation: "Mother's occupation",
        brothers: "Brothers",
        sisters: "Sisters",
        diet: "Diet",
        drinking: "Drinking",
        smoking: "Smoking",
        hobbies: "Hobbies",
        hobbiesPlaceholder: "Comma-separated hobbies",
        about: "About you",
        aboutPlaceholder:
          "Write naturally about your personality, lifestyle, family values, and what makes your profile feel authentic.",
        partnerAgeFrom: "Preferred age from",
        partnerAgeTo: "Preferred age to",
        partnerHeight: "Preferred height",
        partnerMaritalStatus: "Preferred marital status",
        partnerEducation: "Preferred education",
        partnerOccupation: "Preferred occupation",
        partnerIncome: "Preferred income",
        partnerLocation: "Preferred location",
        partnerExpectations: "Partner expectations",
        partnerExpectationsPlaceholder:
          "Describe the kind of partner and shared values you genuinely hope to find.",
        email: "Email address",
        phone: "Phone number",
        profilePhoto: "Profile photo",
        horoscope: "Horoscope image",
        uploadedHint: "Image uploaded. Select a new file to replace it.",
        uploadHint: "Upload a JPG or PNG under 2 MB.",
        previewLabel: "Live preview",
        replaceImage: "Replace image",
        profilePhotoPlaceholder: "Profile photo preview",
        horoscopePlaceholder: "Horoscope preview",
        profilePhotoPreviewAlt: "Profile photo preview",
        horoscopePreviewAlt: "Horoscope preview",
        completionTitle: "Completion progress",
        completionDescription:
          "Finish the essential fields, story, and media that unlock the full member experience.",
        requiredProgressLabel: "Required fields",
        onboardingTitle: "What to add next",
        onboardingComplete:
          "The essential setup is in good shape. You can now add more optional detail to make the profile even stronger.",
        jumpToTitle: "Jump to sections",
        saveTitle: "Ready to save your edits?",
        saveDescription:
          "Material changes may send the profile back through the review queue so member trust stays strong.",
        saving: "Saving profile",
        saveChanges: "Save changes",
        profileReady: "Profile ready",
        completeSuffix: "complete",
        previewFallbackName: "Your name",
        previewFallbackRole: "Your occupation will appear here",
        previewFallbackLocation: "Add your location",
      };
}
