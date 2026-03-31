import { Gender, InterestRequestStatus, ProfileStatus } from "@prisma/client";

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

export function buildProfileCompletion(input: {
  fullName?: string | null;
  dateOfBirth?: string | Date | null;
  gender?: string | null;
  city?: string | null;
  state?: string | null;
  education?: string | null;
  occupation?: string | null;
  about?: string | null;
}) {
  return Boolean(
    input.fullName &&
      input.dateOfBirth &&
      input.gender &&
      input.city &&
      input.state &&
      input.education &&
      input.occupation &&
      input.about,
  );
}
