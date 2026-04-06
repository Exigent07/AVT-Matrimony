import { ProfileStatus, UserRole } from "@prisma/client";
import type { z } from "zod";
import {
  normalizeAnnualIncome,
  normalizeMaritalStatus,
} from "@/lib/constants/profile-options";
import {
  buildProfileCompletion,
  genderToDb,
  parseHeightToCentimeters,
} from "@/lib/profile-utils";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { hashPassword, verifyPassword } from "@/server/auth";
import { userWithProfileInclude } from "@/server/services/mappers";
import {
  adminLoginSchema,
  loginSchema,
  registerSchema,
} from "@/server/validation";

type LoginInput = z.infer<typeof loginSchema>;
type AdminLoginInput = z.infer<typeof adminLoginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

export async function authenticateMember(input: LoginInput) {
  const user = await db.user.findUnique({
    where: {
      email: input.email,
    },
    include: userWithProfileInclude,
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.role !== UserRole.MEMBER) {
    throw new AppError("Use the admin portal to access administrator accounts.", 403);
  }

  if (user.accountStatus === "BLOCKED") {
    throw new AppError("This account has been blocked. Please contact support.", 403);
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
    include: userWithProfileInclude,
  });
}

export async function authenticateAdmin(input: AdminLoginInput) {
  const user = await db.user.findUnique({
    where: {
      email: input.email,
    },
    include: userWithProfileInclude,
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.role !== UserRole.ADMIN) {
    throw new AppError("This account does not have administrator access.", 403);
  }

  if (user.accountStatus === "BLOCKED") {
    throw new AppError("This administrator account has been blocked.", 403);
  }

  const passwordMatches = await verifyPassword(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
    include: userWithProfileInclude,
  });
}

export async function registerMember(input: RegisterInput) {
  const existingUser = await db.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError("An account with this email address already exists.", 409);
  }

  const passwordHash = await hashPassword(input.password);
  const heightCm = parseHeightToCentimeters(input.height);
  const maritalStatus = normalizeMaritalStatus(input.maritalStatus) ?? input.maritalStatus;
  const annualIncome = normalizeAnnualIncome(input.income) ?? input.income;
  const isProfileComplete = buildProfileCompletion({
    fullName: input.fullName,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    height: input.height,
    maritalStatus,
    caste: input.caste,
    city: input.city,
    state: input.state,
    education: input.education,
    occupation: input.occupation,
    email: input.email,
    phone: input.phone,
    profilePhotoUrl: null,
    about: null,
    partnerExpectations: null,
    annualIncome,
    community: input.community,
  });

  return db.user.create({
    data: {
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      // input.phone has already been normalized by phoneSchema's .transform()
      phone: input.phone,
      role: UserRole.MEMBER,
      profile: {
        create: {
          profileFor: input.profileFor,
          community: input.community || null,
          gender: genderToDb(input.gender),
          dateOfBirth: new Date(input.dateOfBirth),
          heightCm,
          heightLabel: input.height,
          maritalStatus,
          // Religion is intentionally left null at registration; the member
          // fills it in when completing their profile via edit-profile.
          religion: null,
          caste: input.caste,
          country: "India",
          state: input.state,
          city: input.city,
          education: input.education,
          occupation: input.occupation,
          annualIncome,
          about: null,
          partnerExpectations: null,
          isProfileComplete,
          status: ProfileStatus.PENDING,
        },
      },
    },
    include: userWithProfileInclude,
  });
}
