import type { Prisma } from "@prisma/client";
import {
  type SupportTicket,
} from "@prisma/client";
import {
  buildProfileCompletionState,
  calculateAge,
  displayGender,
  formatHeight,
} from "@/lib/profile-utils";
import type {
  AdminInterestItem,
  AdminUserItem,
  InterestItem,
  ProfileCard,
  ProfileDetail,
  ReportItem,
  SessionViewer,
  SupportTicketItem,
} from "@/types/domain";

export const userWithProfileInclude = {
  profile: {
    include: {
      interests: {
        include: {
          interest: true,
        },
      },
    },
  },
} as const satisfies Prisma.UserInclude;

export const interestRequestInclude = {
  fromUser: {
    include: userWithProfileInclude,
  },
  toUser: {
    include: userWithProfileInclude,
  },
} as const satisfies Prisma.InterestRequestInclude;

export const reportInclude = {
  reporter: true,
  reportedUser: true,
} as const satisfies Prisma.UserReportInclude;

export type UserWithProfile = Prisma.UserGetPayload<{
  include: typeof userWithProfileInclude;
}>;

export type InterestRequestWithUsers = Prisma.InterestRequestGetPayload<{
  include: typeof interestRequestInclude;
}>;

export type ReportWithUsers = Prisma.UserReportGetPayload<{
  include: typeof reportInclude;
}>;

function getInterestLabels(user: UserWithProfile) {
  return user.profile?.interests.map(({ interest }) => interest.label) ?? [];
}

function ensureProfile(user: UserWithProfile) {
  if (!user.profile) {
    throw new Error(`Profile not found for user ${user.id}.`);
  }

  return user.profile;
}

export function buildSessionViewer(user: UserWithProfile): SessionViewer {
  const completion = buildProfileCompletionState({
    fullName: user.fullName,
    gender: user.profile?.gender,
    dateOfBirth: user.profile?.dateOfBirth,
    height: user.profile?.heightLabel ?? user.profile?.heightCm,
    maritalStatus: user.profile?.maritalStatus,
    profilePhotoUrl: user.profile?.profilePhotoUrl,
    community: user.profile?.community,
    religion: user.profile?.religion,
    caste: user.profile?.caste,
    city: user.profile?.city,
    state: user.profile?.state,
    education: user.profile?.education,
    occupation: user.profile?.occupation,
    annualIncome: user.profile?.annualIncome,
    about: user.profile?.about,
    hobbies: user.profile?.hobbies,
    selectedInterests: getInterestLabels(user),
    partnerExpectations: user.profile?.partnerExpectations,
    email: user.email,
    phone: user.phone,
    horoscopeImageUrl: user.profile?.horoscopeImageUrl,
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    profilePhotoUrl: user.profile?.profilePhotoUrl ?? null,
    role: user.role,
    accountStatus: user.accountStatus,
    profileStatus: user.profile?.status ?? null,
    profileComplete: completion.isComplete,
    profileCompletionPercentage: completion.percentage,
    gender: displayGender(user.profile?.gender),
    city: user.profile?.city ?? null,
    selectedInterests: getInterestLabels(user),
  };
}

export function buildProfileCard(user: UserWithProfile): ProfileCard {
  const profile = ensureProfile(user);

  return {
    userId: user.id,
    profileId: profile.id,
    fullName: user.fullName,
    age: calculateAge(profile.dateOfBirth),
    gender: displayGender(profile.gender) ?? "Male",
    city: profile.city ?? "Not specified",
    state: profile.state ?? "Not specified",
    occupation: profile.occupation ?? "Not specified",
    education: profile.education ?? "Not specified",
    annualIncome: profile.annualIncome ?? "Not specified",
    height: formatHeight(profile.heightCm, profile.heightLabel),
    caste: profile.caste ?? "Not specified",
    maritalStatus: profile.maritalStatus ?? "Not specified",
    religion: profile.religion ?? "Not specified",
    star: profile.star ?? "Not specified",
    diet: profile.diet ?? "Not specified",
    smoking: profile.smoking ?? "Not specified",
    drinking: profile.drinking ?? "Not specified",
    about: profile.about ?? "No profile introduction has been added yet.",
    interests: getInterestLabels(user),
    profilePhotoUrl: profile.profilePhotoUrl ?? null,
    profileStatus: profile.status,
  };
}

export function buildProfileDetail(
  user: UserWithProfile,
  options?: { canViewContact?: boolean },
): ProfileDetail {
  const profile = ensureProfile(user);
  const card = buildProfileCard(user);

  return {
    ...card,
    dateOfBirth: profile.dateOfBirth.toISOString().slice(0, 10),
    email: options?.canViewContact ? user.email : null,
    phone: options?.canViewContact ? user.phone : null,
    community: profile.community ?? "Not specified",
    subCaste: profile.subCaste ?? "Not specified",
    gothram: profile.gothram ?? "Not specified",
    raasi: profile.raasi ?? "Not specified",
    country: profile.country ?? "India",
    residencyStatus: profile.residencyStatus ?? "Not specified",
    employedIn: profile.employedIn ?? "Not specified",
    familyStatus: profile.familyStatus ?? "Not specified",
    familyType: profile.familyType ?? "Not specified",
    fatherOccupation: profile.fatherOccupation ?? "Not specified",
    motherOccupation: profile.motherOccupation ?? "Not specified",
    brothers: profile.brothers,
    sisters: profile.sisters,
    weightKg: profile.weightKg,
    bodyType: profile.bodyType ?? "Not specified",
    complexion: profile.complexion ?? "Not specified",
    physicalStatus: profile.physicalStatus ?? "Not specified",
    hobbies: profile.hobbies ?? "Not specified",
    partnerAgeFrom: profile.partnerAgeFrom,
    partnerAgeTo: profile.partnerAgeTo,
    partnerHeight: formatHeight(profile.partnerHeightCm),
    partnerMaritalStatus: profile.partnerMaritalStatus ?? "Not specified",
    partnerEducation: profile.partnerEducation ?? "Not specified",
    partnerOccupation: profile.partnerOccupation ?? "Not specified",
    partnerIncome: profile.partnerIncome ?? "Not specified",
    partnerLocation: profile.partnerLocation ?? "Not specified",
    partnerExpectations:
      profile.partnerExpectations ?? "No partner preferences have been added yet.",
    horoscopeImageUrl: profile.horoscopeImageUrl ?? null,
    canViewContact: options?.canViewContact ?? false,
  };
}

export function buildInterestItem(
  request: InterestRequestWithUsers,
  viewerId: string,
): InterestItem {
  const isSent = request.fromUserId === viewerId;
  const counterpart = isSent ? request.toUser : request.fromUser;
  const canViewContact = request.status === "CONTACT_SHARED";

  return {
    id: request.id,
    direction: isSent ? "sent" : "received",
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    contactSharedAt: request.contactSharedAt?.toISOString() ?? null,
    counterpart: buildProfileCard(counterpart),
    contactDetails: canViewContact
      ? {
          email: counterpart.email,
          phone: counterpart.phone,
        }
      : null,
  };
}

export function buildAdminUserItem(
  user: UserWithProfile,
  interestCount: number,
): AdminUserItem {
  const profile = ensureProfile(user);

  return {
    userId: user.id,
    profileId: profile.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    gender: displayGender(profile.gender) ?? "Male",
    city: profile.city ?? "Not specified",
    occupation: profile.occupation ?? "Not specified",
    createdAt: user.createdAt.toISOString(),
    accountStatus: user.accountStatus,
    profileStatus: profile.status,
    interestCount,
  };
}

export function buildAdminInterestItem(
  request: InterestRequestWithUsers,
): AdminInterestItem {
  return {
    id: request.id,
    status: request.status,
    createdAt: request.createdAt.toISOString(),
    contactSharedAt: request.contactSharedAt?.toISOString() ?? null,
    fromUser: {
      id: request.fromUser.id,
      name: request.fromUser.fullName,
      email: request.fromUser.email,
      phone: request.fromUser.phone,
    },
    toUser: {
      id: request.toUser.id,
      name: request.toUser.fullName,
      email: request.toUser.email,
      phone: request.toUser.phone,
    },
  };
}

export function buildSupportTicketItem(ticket: SupportTicket): SupportTicketItem {
  return {
    id: ticket.id,
    name: ticket.name,
    email: ticket.email,
    subject: ticket.subject,
    message: ticket.message,
    status: ticket.status,
    createdAt: ticket.createdAt.toISOString(),
  };
}

export function buildReportItem(report: ReportWithUsers): ReportItem {
  return {
    id: report.id,
    reportedProfileReference: report.reportedProfileReference,
    reason: report.reason,
    details: report.details ?? "",
    status: report.status,
    createdAt: report.createdAt.toISOString(),
    reporterName: report.reporter?.fullName ?? "Anonymous member",
    reportedName: report.reportedUser?.fullName ?? null,
  };
}
