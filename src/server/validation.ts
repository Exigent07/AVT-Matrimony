import { z } from "zod";
import { INTEREST_LABELS } from "@/lib/constants/interests";
import { isAdult, normalizePhone } from "@/lib/profile-utils";

const emailSchema = z.email().trim().toLowerCase();
const phoneSchema = z
  .string()
  .trim()
  .transform((value) => normalizePhone(value))
  .refine((value) => value.length === 10, "Enter a valid 10-digit phone number.");

const optionalText = z.string().trim().optional().transform((value) => value || "");

const interestSchema = z.array(z.string().trim()).max(15).refine(
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
    fullName: z.string().trim().min(2, "Enter your full name."),
    gender: z.enum(["male", "female"]),
    dateOfBirth: z.string().date(),
    community: optionalText,
    email: emailSchema,
    phone: phoneSchema,
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    height: z.string().trim().min(1, "Select your height."),
    maritalStatus: z.string().trim().min(1, "Select your marital status."),
    education: z.string().trim().min(2, "Enter your education."),
    occupation: z.string().trim().min(2, "Enter your occupation."),
    income: optionalText,
    city: z.string().trim().min(2, "Enter your city."),
    state: z.string().trim().min(2, "Enter your state."),
    caste: z.string().trim().min(2, "Enter your caste."),
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
    fullName: z.string().trim().min(2, "Enter your full name."),
    gender: z.enum(["male", "female"]),
    dateOfBirth: z.string().date(),
    community: optionalText,
    maritalStatus: z.string().trim().min(1, "Select your marital status."),
    height: z.string().trim().min(1, "Select your height."),
    weight: optionalText,
    bodyType: optionalText,
    complexion: optionalText,
    physicalStatus: optionalText,
    religion: optionalText,
    caste: z.string().trim().min(2, "Enter your caste."),
    subCaste: optionalText,
    gothram: optionalText,
    star: optionalText,
    raasi: optionalText,
    country: optionalText,
    state: z.string().trim().min(2, "Enter your state."),
    city: z.string().trim().min(2, "Enter your city."),
    residencyStatus: optionalText,
    education: z.string().trim().min(2, "Enter your education."),
    employedIn: optionalText,
    occupation: z.string().trim().min(2, "Enter your occupation."),
    income: optionalText,
    familyStatus: optionalText,
    familyType: optionalText,
    fatherOccupation: optionalText,
    motherOccupation: optionalText,
    brothers: optionalText,
    sisters: optionalText,
    diet: optionalText,
    drinking: optionalText,
    smoking: optionalText,
    hobbies: optionalText,
    about: z.string().trim().min(20, "Tell members a little more about yourself."),
    partnerAgeFrom: optionalText,
    partnerAgeTo: optionalText,
    partnerHeight: optionalText,
    partnerMaritalStatus: optionalText,
    partnerEducation: optionalText,
    partnerOccupation: optionalText,
    partnerIncome: optionalText,
    partnerLocation: optionalText,
    partnerExpectations: z
      .string()
      .trim()
      .min(12, "Describe your partner expectations."),
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
  action: z.enum(["accept", "decline", "withdraw", "share-contact"]),
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
