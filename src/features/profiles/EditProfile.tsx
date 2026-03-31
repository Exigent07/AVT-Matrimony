"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/layout/AuthHeader";
import { InterestsSelector } from "@/components/shared/InterestsSelector";
import { PageTransition } from "@/components/shared/PageTransition";
import { requestJson } from "@/lib/client-request";
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

export function EditProfile({ viewer, profile }: EditProfileProps) {
  const router = useRouter();
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
    community: profile.community === "Not specified" ? "" : profile.community,
    maritalStatus: profile.maritalStatus,
    height: profile.height,
    weight: profile.weightKg?.toString() ?? "",
    bodyType: profile.bodyType === "Not specified" ? "" : profile.bodyType,
    complexion: profile.complexion === "Not specified" ? "" : profile.complexion,
    physicalStatus: profile.physicalStatus === "Not specified" ? "" : profile.physicalStatus,
    religion: profile.religion === "Not specified" ? "" : profile.religion,
    caste: profile.caste === "Not specified" ? "" : profile.caste,
    subCaste: profile.subCaste === "Not specified" ? "" : profile.subCaste,
    gothram: profile.gothram === "Not specified" ? "" : profile.gothram,
    star: profile.star === "Not specified" ? "" : profile.star,
    raasi: profile.raasi === "Not specified" ? "" : profile.raasi,
    country: profile.country === "Not specified" ? "India" : profile.country,
    state: profile.state,
    city: profile.city,
    residencyStatus:
      profile.residencyStatus === "Not specified" ? "" : profile.residencyStatus,
    education: profile.education,
    employedIn: profile.employedIn === "Not specified" ? "" : profile.employedIn,
    occupation: profile.occupation,
    income: profile.annualIncome === "Not specified" ? "" : profile.annualIncome,
    familyStatus: profile.familyStatus === "Not specified" ? "" : profile.familyStatus,
    familyType: profile.familyType === "Not specified" ? "" : profile.familyType,
    fatherOccupation:
      profile.fatherOccupation === "Not specified" ? "" : profile.fatherOccupation,
    motherOccupation:
      profile.motherOccupation === "Not specified" ? "" : profile.motherOccupation,
    brothers: profile.brothers?.toString() ?? "",
    sisters: profile.sisters?.toString() ?? "",
    diet: profile.diet === "Not specified" ? "" : profile.diet,
    drinking: profile.drinking === "Not specified" ? "" : profile.drinking,
    smoking: profile.smoking === "Not specified" ? "" : profile.smoking,
    hobbies: profile.hobbies === "Not specified" ? "" : profile.hobbies,
    about: profile.about,
    partnerAgeFrom: profile.partnerAgeFrom?.toString() ?? "",
    partnerAgeTo: profile.partnerAgeTo?.toString() ?? "",
    partnerHeight: profile.partnerHeight === "Not specified" ? "" : profile.partnerHeight,
    partnerMaritalStatus:
      profile.partnerMaritalStatus === "Not specified" ? "" : profile.partnerMaritalStatus,
    partnerEducation:
      profile.partnerEducation === "Not specified" ? "" : profile.partnerEducation,
    partnerOccupation:
      profile.partnerOccupation === "Not specified" ? "" : profile.partnerOccupation,
    partnerIncome: profile.partnerIncome === "Not specified" ? "" : profile.partnerIncome,
    partnerLocation:
      profile.partnerLocation === "Not specified" ? "" : profile.partnerLocation,
    partnerExpectations: profile.partnerExpectations,
    email: profile.email ?? "",
    phone: profile.phone ?? "",
  });

  const heightOptions = useMemo(() => buildHeightOptions(), []);

  function updateField<K extends keyof typeof formData>(key: K, value: string) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  async function readFile(file: File) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please upload a valid image file.");
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Please upload an image smaller than 2 MB.");
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Unable to read the selected file."));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
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
      toast.error(error instanceof Error ? error.message : "Unable to upload image.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      toast.success("Profile updated successfully.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PageTransition>
      <div className="page-shell">
        <AuthHeader viewer={viewer} backTo="/dashboard" backLabel="Dashboard" />

        <div className="section-shell-narrow section-block pt-4 md:pt-6">
          <div className="hero-surface p-6 md:p-8 lg:p-10">
            <div className="max-w-3xl">
              <span className="section-label">Profile editor</span>
              <h1 className="mt-3 text-4xl text-slate-900 md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Edit profile</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Keep your profile current, well written, and review-ready. Approved profiles will
                return to the review queue after material edits so the experience stays trustworthy
                for all members.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-10">
              <Section title="Personal information">
                <FieldGrid>
                  <Field label="Full name">
                    <input
                      value={formData.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="Gender">
                    <select
                      value={formData.gender}
                      onChange={(event) => updateField("gender", event.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </Field>
                  <Field label="Date of birth">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(event) => updateField("dateOfBirth", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="Marital status">
                    <select
                      value={formData.maritalStatus}
                      onChange={(event) => updateField("maritalStatus", event.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="Never Married">Never Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </Field>
                  <Field label="Height">
                    <select
                      value={formData.height}
                      onChange={(event) => updateField("height", event.target.value)}
                      className="input-field"
                      required
                    >
                      {heightOptions.map((height) => (
                        <option key={height} value={height}>
                          {height}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Weight (kg)">
                    <input
                      value={formData.weight}
                      onChange={(event) => updateField("weight", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section title="Community and location">
                <FieldGrid>
                  <Field label="Community">
                    <input
                      value={formData.community}
                      onChange={(event) => updateField("community", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Religion">
                    <input
                      value={formData.religion}
                      onChange={(event) => updateField("religion", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Caste">
                    <input
                      value={formData.caste}
                      onChange={(event) => updateField("caste", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="Sub-caste">
                    <input
                      value={formData.subCaste}
                      onChange={(event) => updateField("subCaste", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Gothram">
                    <input
                      value={formData.gothram}
                      onChange={(event) => updateField("gothram", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Star">
                    <input
                      value={formData.star}
                      onChange={(event) => updateField("star", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Raasi">
                    <input
                      value={formData.raasi}
                      onChange={(event) => updateField("raasi", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      value={formData.country}
                      onChange={(event) => updateField("country", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="State">
                    <input
                      value={formData.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="City">
                    <input
                      value={formData.city}
                      onChange={(event) => updateField("city", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="Residency status">
                    <input
                      value={formData.residencyStatus}
                      onChange={(event) => updateField("residencyStatus", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section title="Professional and family details">
                <FieldGrid>
                  <Field label="Education">
                    <input
                      value={formData.education}
                      onChange={(event) => updateField("education", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="Employed in">
                    <input
                      value={formData.employedIn}
                      onChange={(event) => updateField("employedIn", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Occupation">
                    <input
                      value={formData.occupation}
                      onChange={(event) => updateField("occupation", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="Annual income">
                    <input
                      value={formData.income}
                      onChange={(event) => updateField("income", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Family status">
                    <input
                      value={formData.familyStatus}
                      onChange={(event) => updateField("familyStatus", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Family type">
                    <input
                      value={formData.familyType}
                      onChange={(event) => updateField("familyType", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Father's occupation">
                    <input
                      value={formData.fatherOccupation}
                      onChange={(event) => updateField("fatherOccupation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Mother's occupation">
                    <input
                      value={formData.motherOccupation}
                      onChange={(event) => updateField("motherOccupation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Brothers">
                    <input
                      value={formData.brothers}
                      onChange={(event) => updateField("brothers", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Sisters">
                    <input
                      value={formData.sisters}
                      onChange={(event) => updateField("sisters", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section title="Lifestyle and profile narrative">
                <FieldGrid>
                  <Field label="Diet">
                    <input
                      value={formData.diet}
                      onChange={(event) => updateField("diet", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Drinking">
                    <input
                      value={formData.drinking}
                      onChange={(event) => updateField("drinking", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Smoking">
                    <input
                      value={formData.smoking}
                      onChange={(event) => updateField("smoking", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Hobbies" className="md:col-span-2">
                    <input
                      value={formData.hobbies}
                      onChange={(event) => updateField("hobbies", event.target.value)}
                      className="input-field"
                      placeholder="Comma-separated hobbies"
                    />
                  </Field>
                  <Field label="About you" className="md:col-span-2">
                    <textarea
                      value={formData.about}
                      onChange={(event) => updateField("about", event.target.value)}
                      className="input-field min-h-32"
                      required
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section title="Partner preferences">
                <FieldGrid>
                  <Field label="Preferred age from">
                    <input
                      value={formData.partnerAgeFrom}
                      onChange={(event) => updateField("partnerAgeFrom", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Preferred age to">
                    <input
                      value={formData.partnerAgeTo}
                      onChange={(event) => updateField("partnerAgeTo", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Preferred height">
                    <input
                      value={formData.partnerHeight}
                      onChange={(event) => updateField("partnerHeight", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Preferred marital status">
                    <input
                      value={formData.partnerMaritalStatus}
                      onChange={(event) =>
                        updateField("partnerMaritalStatus", event.target.value)
                      }
                      className="input-field"
                    />
                  </Field>
                  <Field label="Preferred education">
                    <input
                      value={formData.partnerEducation}
                      onChange={(event) => updateField("partnerEducation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Preferred occupation">
                    <input
                      value={formData.partnerOccupation}
                      onChange={(event) => updateField("partnerOccupation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Preferred income">
                    <input
                      value={formData.partnerIncome}
                      onChange={(event) => updateField("partnerIncome", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Preferred location">
                    <input
                      value={formData.partnerLocation}
                      onChange={(event) => updateField("partnerLocation", event.target.value)}
                      className="input-field"
                    />
                  </Field>
                  <Field label="Partner expectations" className="md:col-span-2">
                    <textarea
                      value={formData.partnerExpectations}
                      onChange={(event) =>
                        updateField("partnerExpectations", event.target.value)
                      }
                      className="input-field min-h-28"
                      required
                    />
                  </Field>
                </FieldGrid>
              </Section>

              <Section title="Contact and profile assets">
                <FieldGrid>
                  <Field label="Email address">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="input-field"
                      required
                    />
                  </Field>
                  <Field label="Phone number">
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
                    title="Profile photo"
                    value={profilePhotoUrl}
                    onChange={(event) => handleFileUpload(event, "profile")}
                  />
                  <UploadCard
                    title="Horoscope image"
                    value={horoscopeImageUrl}
                    onChange={(event) => handleFileUpload(event, "horoscope")}
                  />
                </div>
              </Section>

              <Section title="Interests">
                <InterestsSelector
                  selectedInterests={selectedInterests}
                  onInterestsChange={setSelectedInterests}
                />
              </Section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving profile</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save changes</span>
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
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-100 pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-2xl text-slate-900" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
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
}: {
  title: string;
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="panel-muted block cursor-pointer border-dashed p-4 transition-colors hover:border-slate-300">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#B91C1C] shadow-sm">
          <ImagePlus className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-800">{title}</div>
          <div className="mt-0.5 text-xs text-slate-400">
            {value ? "Image uploaded. Select a new file to replace it." : "Upload a JPG or PNG under 2 MB."}
          </div>
        </div>
      </div>
      <input type="file" accept="image/*" className="mt-4 w-full text-sm" onChange={onChange} />
    </label>
  );
}
