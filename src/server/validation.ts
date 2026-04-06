import { z } from "zod";
import { INTEREST_LABELS } from "@/lib/constants/interests";
import {
  ANNUAL_INCOME_OPTIONS,
  BODY_TYPE_OPTIONS,
  COMPLEXION_OPTIONS,
  DIET_OPTIONS,
  EMPLOYED_IN_OPTIONS,
  FAMILY_STATUS_OPTIONS,
  FAMILY_TYPE_OPTIONS,
  HABIT_FREQUENCY_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PHYSICAL_STATUS_OPTIONS,
  RESIDENCY_STATUS_OPTIONS,
  isProfileOption,
} from "@/lib/constants/profile-options";
import { isAdult, normalizePhone } from "@/lib/profile-utils";

const emailSchema = z.email().trim().toLowerCase();
export const PASSWORD_RULE_MESSAGE =
  "Use 8-72 characters with uppercase, lowercase, number, and symbol.";
const phoneSchema = z
  .string()
  .trim()
  .transform((value) => normalizePhone(value))
  .refine((value) => value.length === 10, "Enter a valid 10-digit phone number.");
const passwordSchema = z
  .string()
  .trim()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,72}$/,
    PASSWORD_RULE_MESSAGE,
  );

const optionalText = z.string().trim().optional().transform((value) => value || "");
const optionalBoundedText = z
  .string()
  .trim()
  .max(80, "Keep this under 80 characters.")
  .optional()
  .transform((value) => value || "");

function hasFullNameParts(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter((part) => /[\p{L}]/u.test(part)).length >= 2;
}

function humanTextSchema(
  requiredMessage: string,
  options?: {
    min?: number;
    max?: number;
    allowNumbers?: boolean;
    invalidMessage?: string;
  },
) {
  const min = options?.min ?? 2;
  const max = options?.max ?? 80;
  const invalidMessage =
    options?.invalidMessage ?? "Use letters, spaces, and common punctuation only.";
  const pattern = options?.allowNumbers
    ? /^[\p{L}\p{N}&/.,'()\- ]+$/u
    : /^[\p{L}&/.,'()\- ]+$/u;

  return z
    .string()
    .trim()
    .min(min, requiredMessage)
    .max(max, `Keep this under ${max} characters.`)
    .refine((value) => /[\p{L}\p{N}]/u.test(value), requiredMessage)
    .refine((value) => !/[<>]/.test(value), invalidMessage)
    .refine((value) => pattern.test(value), invalidMessage);
}

const nameSchema = humanTextSchema("Enter your full name.", {
  max: 80,
  invalidMessage: "Use letters, spaces, and common punctuation for your name.",
}).refine((value) => hasFullNameParts(value), "Enter your first and last name.");

const educationSchema = humanTextSchema("Enter your education.", {
  allowNumbers: true,
});

const occupationSchema = humanTextSchema("Enter your occupation.", {
  allowNumbers: true,
});

function requiredOptionSchema<T extends readonly string[]>(
  options: T,
  requiredMessage: string,
) {
  return z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine((value) => isProfileOption(value, options), requiredMessage);
}

function optionalOptionSchema<T extends readonly string[]>(
  options: T,
  invalidMessage: string,
) {
  return z
    .string()
    .trim()
    .optional()
    .transform((value) => value || "")
    .refine((value) => !value || isProfileOption(value, options), invalidMessage);
}

const incomeSchema = optionalOptionSchema(
  ANNUAL_INCOME_OPTIONS,
  "Select a valid annual income range.",
);

const citySchema = humanTextSchema("Enter your city.");
const stateSchema = humanTextSchema("Enter your state.");
const casteSchema = humanTextSchema("Enter your caste.");
const communitySchema = humanTextSchema("Enter your community.");
const religionSchema = humanTextSchema("Enter your religion.");
const familyStatusSchema = humanTextSchema("Enter your family status.", {
  allowNumbers: true,
});
const familyTypeSchema = humanTextSchema("Enter your family type.", {
  allowNumbers: true,
});
const partnerLocationSchema = humanTextSchema("Enter your preferred location.", {
  allowNumbers: true,
});

const interestSchema = z.array(z.string().trim()).min(3, "Select at least 3 interests.").max(15).refine(
  (interests) => interests.every((interest) => INTEREST_LABELS.has(interest)),
  "One or more selected interests are invalid.",
);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const adminLoginSchema = loginSchema;

export const registerSchema = z
  .object({
    profileFor: z.string().trim().min(1, "Select who this profile is for."),
    fullName: nameSchema,
    gender: z.enum(["male", "female"]),
    dateOfBirth: z.string().date(),
    community: optionalBoundedText,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    height: z.string().trim().min(1, "Select your height."),
    maritalStatus: requiredOptionSchema(
      MARITAL_STATUS_OPTIONS,
      "Select your marital status.",
    ),
    education: educationSchema,
    occupation: occupationSchema,
    income: incomeSchema,
    city: citySchema,
    state: stateSchema,
    caste: casteSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    if (!isAdult(data.dateOfBirth)) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "You must be at least 18 years old to register.",
      });
    }
  });

export const profileUpdateSchema = z
  .object({
    fullName: nameSchema,
    gender: z.enum(["male", "female"]),
    dateOfBirth: z.string().date(),
    community: communitySchema,
    maritalStatus: requiredOptionSchema(
      MARITAL_STATUS_OPTIONS,
      "Select your marital status.",
    ),
    height: z.string().trim().min(1, "Select your height."),
    weight: optionalText,
    bodyType: optionalOptionSchema(BODY_TYPE_OPTIONS, "Select a valid body type."),
    complexion: optionalOptionSchema(COMPLEXION_OPTIONS, "Select a valid complexion."),
    physicalStatus: optionalOptionSchema(
      PHYSICAL_STATUS_OPTIONS,
      "Select a valid physical status.",
    ),
    religion: religionSchema,
    caste: casteSchema,
    subCaste: optionalText,
    gothram: optionalText,
    star: optionalText,
    raasi: optionalText,
    country: optionalText,
    state: stateSchema,
    city: citySchema,
    residencyStatus: optionalOptionSchema(
      RESIDENCY_STATUS_OPTIONS,
      "Select a valid residency status.",
    ),
    education: educationSchema,
    employedIn: optionalOptionSchema(
      EMPLOYED_IN_OPTIONS,
      "Select a valid employment sector.",
    ),
    occupation: occupationSchema,
    income: requiredOptionSchema(
      ANNUAL_INCOME_OPTIONS,
      "Select your annual income.",
    ),
    familyStatus: requiredOptionSchema(
      FAMILY_STATUS_OPTIONS,
      "Select your family status.",
    ),
    familyType: requiredOptionSchema(
      FAMILY_TYPE_OPTIONS,
      "Select your family type.",
    ),
    fatherOccupation: optionalText,
    motherOccupation: optionalText,
    brothers: optionalText,
    sisters: optionalText,
    diet: optionalOptionSchema(DIET_OPTIONS, "Select a valid diet preference."),
    drinking: optionalOptionSchema(
      HABIT_FREQUENCY_OPTIONS,
      "Select a valid drinking preference.",
    ),
    smoking: optionalOptionSchema(
      HABIT_FREQUENCY_OPTIONS,
      "Select a valid smoking preference.",
    ),
    hobbies: optionalText,
    about: z
      .string()
      .trim()
      .min(20, "Tell members a little more about yourself.")
      .max(1200, "Keep your profile summary under 1200 characters."),
    partnerAgeFrom: optionalText,
    partnerAgeTo: optionalText,
    partnerHeight: optionalText,
    partnerMaritalStatus: optionalOptionSchema(
      MARITAL_STATUS_OPTIONS,
      "Select a valid preferred marital status.",
    ),
    partnerEducation: optionalText,
    partnerOccupation: optionalText,
    partnerIncome: optionalOptionSchema(
      ANNUAL_INCOME_OPTIONS,
      "Select a valid preferred income range.",
    ),
    partnerLocation: partnerLocationSchema,
    partnerExpectations: z
      .string()
      .trim()
      .min(12, "Describe your partner expectations.")
      .max(800, "Keep your partner expectations under 800 characters."),
    email: emailSchema,
    phone: phoneSchema,
    profilePhotoUrl: z.string().trim().nullable().optional(),
    horoscopeImageUrl: z.string().trim().nullable().optional(),
    selectedInterests: interestSchema,
  })
  .superRefine((data, ctx) => {
    if (!isAdult(data.dateOfBirth)) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "You must be at least 18 years old.",
      });
    }

    const fromAge = Number.parseInt(data.partnerAgeFrom || "", 10);
    const toAge = Number.parseInt(data.partnerAgeTo || "", 10);

    if (data.partnerAgeFrom && (!Number.isFinite(fromAge) || fromAge < 18)) {
      ctx.addIssue({
        code: "custom",
        path: ["partnerAgeFrom"],
        message: "Enter a valid minimum preferred age.",
      });
    }

    if (data.partnerAgeTo && (!Number.isFinite(toAge) || toAge < 18)) {
      ctx.addIssue({
        code: "custom",
        path: ["partnerAgeTo"],
        message: "Enter a valid maximum preferred age.",
      });
    }

    if (Number.isFinite(fromAge) && Number.isFinite(toAge) && fromAge > toAge) {
      ctx.addIssue({
        code: "custom",
        path: ["partnerAgeTo"],
        message: "Preferred maximum age must be greater than minimum age.",
      });
    }
  });

export const sendInterestSchema = z.object({
  targetUserId: z.string().trim().min(1, "Choose a profile first."),
});

export const interestActionSchema = z.object({
  interestId: z.string().trim().min(1),
  // "share-contact" is intentionally excluded: that action is admin-only and
  // handled by PATCH /api/admin/interests/[interestId] via shareContactByAdmin.
  // Including it here would allow any member to accidentally decline a request
  // (the fallback in handleInterestAction resolves unknown actions → DECLINED).
  action: z.enum(["accept", "decline", "withdraw"]),
});

export const supportTicketSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: emailSchema,
  subject: z.string().trim().min(3, "Enter a subject."),
  message: z.string().trim().min(10, "Enter a more detailed message."),
});

export const reportSchema = z.object({
  profileId: z.string().trim().min(1, "Enter the profile ID."),
  reason: z.enum([
    "FAKE_PROFILE",
    "INAPPROPRIATE_BEHAVIOR",
    "HARASSMENT",
    "SCAM",
    "OTHER",
  ]),
  details: z.string().trim().min(10, "Provide a few more details."),
});

export const adminUserUpdateSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  city: z.string().trim().min(2).optional(),
  occupation: z.string().trim().min(2).optional(),
  accountStatus: z.enum(["ACTIVE", "BLOCKED"]).optional(),
  profileStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export const adminTicketUpdateSchema = z.object({
  ticketId: z.string().trim().min(1),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});

export const adminReportUpdateSchema = z.object({
  reportId: z.string().trim().min(1),
  status: z.enum(["OPEN", "REVIEWED", "RESOLVED"]),
});
