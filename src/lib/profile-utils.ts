import { Gender, InterestRequestStatus, ProfileStatus } from "@prisma/client";

export type ProfileCompletionSectionKey =
  | "identity"
  | "background"
  | "career"
  | "story"
  | "contact";

export type ProfileCompletionFieldKey =
  | "fullName"
  | "gender"
  | "dateOfBirth"
  | "height"
  | "maritalStatus"
  | "profilePhotoUrl"
  | "community"
  | "religion"
  | "caste"
  | "city"
  | "state"
  | "education"
  | "occupation"
  | "annualIncome"
  | "about"
  | "hobbies"
  | "selectedInterests"
  | "partnerExpectations"
  | "email"
  | "phone"
  | "horoscopeImageUrl";

export interface ProfileCompletionInput {
  fullName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | Date | null;
  height?: string | number | null;
  maritalStatus?: string | null;
  profilePhotoUrl?: string | null;
  community?: string | null;
  religion?: string | null;
  caste?: string | null;
  city?: string | null;
  state?: string | null;
  education?: string | null;
  occupation?: string | null;
  annualIncome?: string | null;
  about?: string | null;
  hobbies?: string | null;
  selectedInterests?: string[] | null;
  partnerExpectations?: string | null;
  email?: string | null;
  phone?: string | null;
  horoscopeImageUrl?: string | null;
}

export interface ProfileCompletionItem {
  key: ProfileCompletionFieldKey;
  section: ProfileCompletionSectionKey;
  required: boolean;
  complete: boolean;
}

export interface ProfileCompletionState {
  items: ProfileCompletionItem[];
  completedCount: number;
  totalCount: number;
  requiredCompletedCount: number;
  requiredCount: number;
  percentage: number;
  isComplete: boolean;
}

const PROFILE_PLACEHOLDER_VALUES = new Set([
  "",
  "not specified",
  "not provided",
  "no profile introduction has been added yet.",
  "no partner preferences have been added yet.",
]);

export function optionalString(value: string | null | undefined) {
  const nextValue = value?.trim();
  return nextValue ? nextValue : null;
}

export function optionalInt(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value) : null;
  }

  const nextValue = value?.toString().trim();
  if (!nextValue) {
    return null;
  }

  const parsed = Number.parseInt(nextValue, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

export function isProfilePlaceholderValue(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  if (PROFILE_PLACEHOLDER_VALUES.has(normalized)) {
    return true;
  }

  return (
    normalized.startsWith("no profile introduction has been added") ||
    normalized.startsWith("no partner preferences have been added")
  );
}

function hasMeaningfulText(value: string | null | undefined, minimumLength = 1) {
  return !isProfilePlaceholderValue(value) && value!.trim().length >= minimumLength;
}

function hasMeaningfulDate(value: string | Date | null | undefined) {
  if (!value) {
    return false;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime());
}

function hasMeaningfulValue(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  return hasMeaningfulText(value);
}

function hasMeaningfulInterests(values: string[] | null | undefined) {
  return (values ?? []).filter((value) => hasMeaningfulText(value)).length >= 3;
}

function hasValidEmail(value: string | null | undefined) {
  return hasMeaningfulText(value, 3) && value!.includes("@");
}

function hasValidPhone(value: string | null | undefined) {
  return normalizePhone(value ?? "").length === 10;
}

export function calculateAge(dateOfBirth: Date | string) {
  const birthDate = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export function isAdult(dateOfBirth: string) {
  return calculateAge(dateOfBirth) >= 18;
}

export function parseHeightToCentimeters(value: string | null | undefined) {
  const nextValue = value?.trim();
  if (!nextValue) {
    return null;
  }

  const cmMatch = nextValue.match(/(\d{3})\s*cm/i);
  if (cmMatch) {
    return Number.parseInt(cmMatch[1], 10);
  }

  const feetInchesMatch = nextValue.match(/(\d)'\s*(\d{1,2})/);
  if (feetInchesMatch) {
    const feet = Number.parseInt(feetInchesMatch[1], 10);
    const inches = Number.parseInt(feetInchesMatch[2], 10);
    return Math.round((feet * 12 + inches) * 2.54);
  }

  return optionalInt(nextValue);
}

export function formatHeight(heightCm: number | null | undefined, fallback?: string | null) {
  if (fallback?.trim()) {
    return fallback;
  }

  if (!heightCm) {
    return "Not specified";
  }

  const totalInches = Math.round(heightCm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}" (${heightCm} cm)`;
}

export function genderToDb(value: string) {
  return value.toLowerCase() === "female" ? Gender.FEMALE : Gender.MALE;
}

export function displayGender(value: Gender | string | null | undefined) {
  if (!value) {
    return null;
  }

  return value === Gender.FEMALE || value.toString().toLowerCase() === "female"
    ? "Female"
    : "Male";
}

export function displayProfileStatus(value: ProfileStatus | string | null | undefined) {
  switch (value) {
    case ProfileStatus.APPROVED:
    case "APPROVED":
      return "Approved";
    case ProfileStatus.REJECTED:
    case "REJECTED":
      return "Rejected";
    case ProfileStatus.PENDING:
    case "PENDING":
    default:
      return "Pending";
  }
}

export function displayInterestStatus(value: InterestRequestStatus | string) {
  switch (value) {
    case InterestRequestStatus.ACCEPTED:
    case "ACCEPTED":
      return "Accepted";
    case InterestRequestStatus.DECLINED:
    case "DECLINED":
      return "Declined";
    case InterestRequestStatus.CONTACT_SHARED:
    case "CONTACT_SHARED":
      return "Contact Shared";
    case InterestRequestStatus.PENDING:
    case "PENDING":
    default:
      return "Pending";
  }
}

export function buildProfileCompletionState(
  input: ProfileCompletionInput,
): ProfileCompletionState {
  const items: ProfileCompletionItem[] = [
    {
      key: "fullName",
      section: "identity",
      required: true,
      complete: hasMeaningfulText(input.fullName, 2),
    },
    {
      key: "gender",
      section: "identity",
      required: true,
      complete: hasMeaningfulText(input.gender),
    },
    {
      key: "dateOfBirth",
      section: "identity",
      required: true,
      complete: hasMeaningfulDate(input.dateOfBirth),
    },
    {
      key: "height",
      section: "identity",
      required: true,
      complete: hasMeaningfulValue(input.height),
    },
    {
      key: "maritalStatus",
      section: "identity",
      required: true,
      complete: hasMeaningfulText(input.maritalStatus),
    },
    {
      key: "profilePhotoUrl",
      section: "identity",
      required: true,
      complete: hasMeaningfulText(input.profilePhotoUrl),
    },
    {
      key: "community",
      section: "background",
      required: false,
      complete: hasMeaningfulText(input.community, 2),
    },
    {
      key: "religion",
      section: "background",
      required: false,
      complete: hasMeaningfulText(input.religion, 2),
    },
    {
      key: "caste",
      section: "background",
      required: true,
      complete: hasMeaningfulText(input.caste, 2),
    },
    {
      key: "city",
      section: "background",
      required: true,
      complete: hasMeaningfulText(input.city, 2),
    },
    {
      key: "state",
      section: "background",
      required: true,
      complete: hasMeaningfulText(input.state, 2),
    },
    {
      key: "education",
      section: "career",
      required: true,
      complete: hasMeaningfulText(input.education, 2),
    },
    {
      key: "occupation",
      section: "career",
      required: true,
      complete: hasMeaningfulText(input.occupation, 2),
    },
    {
      key: "annualIncome",
      section: "career",
      required: false,
      complete: hasMeaningfulText(input.annualIncome, 2),
    },
    {
      key: "about",
      section: "story",
      required: true,
      complete: hasMeaningfulText(input.about, 20),
    },
    {
      key: "hobbies",
      section: "story",
      required: false,
      complete: hasMeaningfulText(input.hobbies, 3),
    },
    {
      key: "selectedInterests",
      section: "story",
      required: false,
      complete: hasMeaningfulInterests(input.selectedInterests),
    },
    {
      key: "partnerExpectations",
      section: "story",
      required: true,
      complete: hasMeaningfulText(input.partnerExpectations, 12),
    },
    {
      key: "email",
      section: "contact",
      required: true,
      complete: hasValidEmail(input.email),
    },
    {
      key: "phone",
      section: "contact",
      required: true,
      complete: hasValidPhone(input.phone),
    },
    {
      key: "horoscopeImageUrl",
      section: "contact",
      required: false,
      complete: hasMeaningfulText(input.horoscopeImageUrl),
    },
  ];

  const completedCount = items.filter((item) => item.complete).length;
  const requiredItems = items.filter((item) => item.required);
  const requiredCompletedCount = requiredItems.filter((item) => item.complete).length;

  return {
    items,
    completedCount,
    totalCount: items.length,
    requiredCompletedCount,
    requiredCount: requiredItems.length,
    percentage: Math.round((completedCount / items.length) * 100),
    isComplete: requiredCompletedCount === requiredItems.length,
  };
}

export function buildProfileCompletion(input: ProfileCompletionInput) {
  return buildProfileCompletionState(input).isComplete;
}
