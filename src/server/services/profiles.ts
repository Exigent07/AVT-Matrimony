import {
  AccountStatus,
  InterestRequestStatus,
  ProfileStatus,
} from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";
import {
  normalizeAnnualIncome,
  normalizeBodyType,
  normalizeComplexion,
  normalizeDiet,
  normalizeEmployedIn,
  normalizeFamilyStatus,
  normalizeFamilyType,
  normalizeHabitFrequency,
  normalizeMaritalStatus,
  normalizePhysicalStatus,
  normalizeResidencyStatus,
} from "@/lib/constants/profile-options";
import {
  buildProfileCompletion,
  buildProfileCompletionState,
  genderToDb,
  normalizePhone,
  optionalInt,
  optionalString,
  parseHeightToCentimeters,
} from "@/lib/profile-utils";
import type { DashboardData, ProfileCard } from "@/types/domain";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import {
  buildInterestItem,
  buildProfileCard,
  buildProfileDetail,
  buildSessionViewer,
  interestRequestInclude,
  userWithProfileInclude,
} from "@/server/services/mappers";
import {
  interestActionSchema,
  profileUpdateSchema,
  sendInterestSchema,
} from "@/server/validation";

type SendInterestInput = z.infer<typeof sendInterestSchema>;
type InterestActionInput = z.infer<typeof interestActionSchema>;
type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

interface RelationshipState {
  visibleStatus: InterestRequestStatus | null;
  canInitiate: boolean;
}

async function getUserWithProfileOrThrow(
  userId: string,
  options?: { allowAdminWithoutProfile?: boolean },
) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: userWithProfileInclude,
  });

  if (!user) {
    throw new AppError("Profile not found.", 404);
  }

  if (!user.profile && !(options?.allowAdminWithoutProfile && user.role === "ADMIN")) {
    throw new AppError("Profile not found.", 404);
  }

  return user;
}

async function getViewerUserOrThrow(userId: string) {
  return getUserWithProfileOrThrow(userId, { allowAdminWithoutProfile: true });
}

async function syncProfileInterests(
  tx: Prisma.TransactionClient,
  profileId: string,
  labels: string[],
) {
  await tx.profileInterest.deleteMany({
    where: {
      profileId,
    },
  });

  if (labels.length === 0) {
    return;
  }

  const interestTags = await tx.interestTag.findMany({
    where: {
      label: {
        in: labels,
      },
    },
  });

  await tx.profileInterest.createMany({
    data: interestTags.map((interest) => ({
      profileId,
      interestId: interest.id,
    })),
  });
}

function deriveRelationshipState(
  requests: Array<{
    fromUserId: string;
    toUserId: string;
    status: InterestRequestStatus;
  }>,
  viewerId: string,
  counterpartId: string,
): RelationshipState {
  const sentRequest =
    requests.find(
      (request) =>
        request.fromUserId === viewerId && request.toUserId === counterpartId,
    ) ?? null;
  const receivedRequest =
    requests.find(
      (request) =>
        request.fromUserId === counterpartId && request.toUserId === viewerId,
    ) ?? null;

  if (
    receivedRequest &&
    receivedRequest.status !== InterestRequestStatus.DECLINED
  ) {
    return {
      visibleStatus: receivedRequest.status,
      canInitiate: false,
    };
  }

  if (sentRequest) {
    return {
      visibleStatus: sentRequest.status,
      canInitiate: false,
    };
  }

  return {
    visibleStatus: null,
    canInitiate: true,
  };
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const user = await getUserWithProfileOrThrow(userId);
  const profile = user.profile!;

  // Single query fetches everything needed — interestedInYou is derived in memory.
  const interestRequests = await db.interestRequest.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    include: interestRequestInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Derive "interested in you" from the already-fetched requests (subset):
  // requests where this user is the recipient and the sender hasn't been declined.
  const interestedInYou = interestRequests
    .filter(
      (request) =>
        request.toUserId === userId &&
        request.status !== InterestRequestStatus.DECLINED,
    )
    .slice(0, 6);

  const recentMatchesMap = new Map<string, ProfileCard>();
  interestRequests
    .filter(
      (request) =>
        request.status === InterestRequestStatus.ACCEPTED ||
        request.status === InterestRequestStatus.CONTACT_SHARED,
    )
    .forEach((request) => {
      const counterpart = request.fromUserId === userId ? request.toUser : request.fromUser;
      recentMatchesMap.set(counterpart.id, buildProfileCard(counterpart));
    });

  return {
    viewer: buildSessionViewer(user),
    profile: buildProfileDetail(user, { canViewContact: true }),
    counts: {
      interestsSent: interestRequests.filter((request) => request.fromUserId === userId).length,
      interestsReceived: interestRequests.filter((request) => request.toUserId === userId).length,
      mutualMatches: Array.from(recentMatchesMap.values()).length,
      pendingProfileReview: profile.status === ProfileStatus.PENDING ? 1 : 0,
    },
    interestedInYou: interestedInYou.map((request) => buildInterestItem(request, userId)),
    recentMatches: Array.from(recentMatchesMap.values()).slice(0, 4),
  };
}

export async function getSearchProfiles(userId: string) {
  const user = await getUserWithProfileOrThrow(userId);
  const profile = user.profile!;
  const targetGender = profile.gender === "MALE" ? "FEMALE" : "MALE";
  const baseWhere = {
    id: {
      not: userId,
    },
    role: "MEMBER" as const,
    accountStatus: AccountStatus.ACTIVE,
  };

  const [compatibleProfiles, requests] = await Promise.all([
    db.user.findMany({
      where: {
        ...baseWhere,
        profile: {
          is: {
            gender: targetGender,
            status: ProfileStatus.APPROVED,
          },
        },
      },
      include: userWithProfileInclude,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.interestRequest.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
    }),
  ]);

  const profiles =
    compatibleProfiles.length > 0
      ? compatibleProfiles
      : await db.user.findMany({
          where: {
            ...baseWhere,
            profile: {
              is: {
                status: ProfileStatus.APPROVED,
              },
            },
          },
          include: userWithProfileInclude,
          orderBy: {
            createdAt: "desc",
          },
        });

  const requestStatusByUserId = new Map<string, InterestRequestStatus>();

  profiles.forEach((targetUser) => {
    const relationship = deriveRelationshipState(
      requests,
      userId,
      targetUser.id,
    );

    if (relationship.visibleStatus) {
      requestStatusByUserId.set(targetUser.id, relationship.visibleStatus);
    }
  });

  return {
    viewer: buildSessionViewer(user),
    profiles: profiles.map((profile) => buildProfileCard(profile)),
    requestStatusByUserId,
    directoryMode:
      compatibleProfiles.length > 0
        ? ("compatible" as const)
        : ("broader-directory" as const),
  };
}

export async function getProfileDetailById(userId: string, targetId: string) {
  const viewer = await getViewerUserOrThrow(userId);
  const viewerProfile = viewer.profile;

  if (viewer.role === "MEMBER" && !viewerProfile) {
    throw new AppError("Profile not found.", 404);
  }
  const isOwnProfile = targetId === "me" || targetId === userId;

  const targetUser = isOwnProfile
    ? viewer
    : await db.user.findFirst({
        where: {
          OR: [{ id: targetId }, { profile: { id: targetId } }],
        },
        include: userWithProfileInclude,
      });

  if (!targetUser || !targetUser.profile) {
    throw new AppError("Profile not found.", 404);
  }

  if (
    !isOwnProfile &&
    viewer.role !== "ADMIN" &&
    (targetUser.accountStatus !== AccountStatus.ACTIVE ||
      targetUser.profile.status !== ProfileStatus.APPROVED)
  ) {
    throw new AppError("This profile is not currently available.", 404);
  }

  const pairRequests = isOwnProfile
    ? []
    : await db.interestRequest.findMany({
        where: {
          OR: [
            {
              fromUserId: userId,
              toUserId: targetUser.id,
            },
            {
              fromUserId: targetUser.id,
              toUserId: userId,
            },
          ],
        },
      });
  const relationship = isOwnProfile
    ? {
        visibleStatus: null,
        canInitiate: false,
      }
    : deriveRelationshipState(pairRequests, userId, targetUser.id);

  const canViewContact =
    isOwnProfile ||
    viewer.role === "ADMIN" ||
    relationship.visibleStatus === InterestRequestStatus.CONTACT_SHARED;
  const isCompatibleGender = viewer.role === "MEMBER" && viewerProfile
    ? viewerProfile.gender !== targetUser.profile.gender
    : false;

  return {
    viewer: buildSessionViewer(viewer),
    isOwnProfile,
    profile: buildProfileDetail(targetUser, { canViewContact }),
    interestStatus: relationship.visibleStatus,
    canSendInterest:
      !isOwnProfile &&
      viewer.role === "MEMBER" &&
      isCompatibleGender &&
      relationship.canInitiate &&
      targetUser.accountStatus === AccountStatus.ACTIVE &&
      targetUser.profile.status === ProfileStatus.APPROVED,
  };
}

export async function getInterestItems(userId: string) {
  // Verify the user exists before querying their interest requests.
  const userExists = await db.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!userExists) {
    throw new AppError("User not found.", 404);
  }

  const requests = await db.interestRequest.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    include: interestRequestInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests.map((request) => buildInterestItem(request, userId));
}

export async function updateProfile(userId: string, input: ProfileUpdateInput) {
  const currentUser = await getUserWithProfileOrThrow(userId);
  const currentProfile = currentUser.profile!;

  if (input.email !== currentUser.email) {
    const emailOwner = await db.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (emailOwner && emailOwner.id !== userId) {
      throw new AppError("This email address is already in use.", 409);
    }
  }

  const heightCm = parseHeightToCentimeters(input.height);
  const partnerHeightCm = parseHeightToCentimeters(input.partnerHeight);
  const dateOfBirth = new Date(input.dateOfBirth);
  const maritalStatus = normalizeMaritalStatus(input.maritalStatus) ?? input.maritalStatus;
  const annualIncome = normalizeAnnualIncome(input.income) ?? input.income;
  const residencyStatus =
    normalizeResidencyStatus(input.residencyStatus) ?? input.residencyStatus;
  const employedIn = normalizeEmployedIn(input.employedIn) ?? input.employedIn;
  const familyStatus = normalizeFamilyStatus(input.familyStatus) ?? input.familyStatus;
  const familyType = normalizeFamilyType(input.familyType) ?? input.familyType;
  const diet = normalizeDiet(input.diet) ?? input.diet;
  const drinking = normalizeHabitFrequency(input.drinking) ?? input.drinking;
  const smoking = normalizeHabitFrequency(input.smoking) ?? input.smoking;
  const bodyType = normalizeBodyType(input.bodyType) ?? input.bodyType;
  const complexion = normalizeComplexion(input.complexion) ?? input.complexion;
  const physicalStatus =
    normalizePhysicalStatus(input.physicalStatus) ?? input.physicalStatus;
  const partnerMaritalStatus =
    normalizeMaritalStatus(input.partnerMaritalStatus) ?? input.partnerMaritalStatus;
  const partnerIncome = normalizeAnnualIncome(input.partnerIncome) ?? input.partnerIncome;
  const nextStatus =
    currentProfile.status === ProfileStatus.APPROVED ||
    currentProfile.status === ProfileStatus.REJECTED
      ? ProfileStatus.PENDING
      : currentProfile.status;
  const isProfileComplete = buildProfileCompletion({
    fullName: input.fullName,
    gender: input.gender,
    dateOfBirth,
    height: input.height,
    maritalStatus,
    profilePhotoUrl: input.profilePhotoUrl,
    community: input.community,
    religion: input.religion,
    caste: input.caste,
    city: input.city,
    state: input.state,
    education: input.education,
    occupation: input.occupation,
    annualIncome,
    about: input.about,
    hobbies: input.hobbies,
    selectedInterests: input.selectedInterests,
    partnerExpectations: input.partnerExpectations,
    email: input.email,
    phone: input.phone,
    horoscopeImageUrl: input.horoscopeImageUrl,
  });

  const updatedUser = await db.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: normalizePhone(input.phone),
        profile: {
          update: {
            community: optionalString(input.community),
            gender: genderToDb(input.gender),
            dateOfBirth,
            maritalStatus,
            heightCm,
            heightLabel: input.height,
            weightKg: optionalInt(input.weight),
            bodyType: optionalString(bodyType),
            complexion: optionalString(complexion),
            physicalStatus: optionalString(physicalStatus),
            religion: optionalString(input.religion),
            caste: optionalString(input.caste),
            subCaste: optionalString(input.subCaste),
            gothram: optionalString(input.gothram),
            star: optionalString(input.star),
            raasi: optionalString(input.raasi),
            country: optionalString(input.country) ?? "India",
            state: input.state,
            city: input.city,
            residencyStatus: optionalString(residencyStatus),
            education: input.education,
            employedIn: optionalString(employedIn),
            occupation: input.occupation,
            annualIncome: optionalString(annualIncome),
            familyStatus: optionalString(familyStatus),
            familyType: optionalString(familyType),
            fatherOccupation: optionalString(input.fatherOccupation),
            motherOccupation: optionalString(input.motherOccupation),
            brothers: optionalInt(input.brothers),
            sisters: optionalInt(input.sisters),
            diet: optionalString(diet),
            drinking: optionalString(drinking),
            smoking: optionalString(smoking),
            hobbies: optionalString(input.hobbies),
            about: input.about,
            partnerAgeFrom: optionalInt(input.partnerAgeFrom),
            partnerAgeTo: optionalInt(input.partnerAgeTo),
            partnerHeightCm,
            partnerMaritalStatus: optionalString(partnerMaritalStatus),
            partnerEducation: optionalString(input.partnerEducation),
            partnerOccupation: optionalString(input.partnerOccupation),
            partnerIncome: optionalString(partnerIncome),
            partnerLocation: optionalString(input.partnerLocation),
            partnerExpectations: input.partnerExpectations,
            profilePhotoUrl: input.profilePhotoUrl || null,
            horoscopeImageUrl: input.horoscopeImageUrl || null,
            isProfileComplete,
            status: nextStatus,
          },
        },
      },
      include: userWithProfileInclude,
    });

    await syncProfileInterests(tx, user.profile!.id, input.selectedInterests);

    return tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: userWithProfileInclude,
    });
  });

  return updatedUser;
}

export async function sendInterest(userId: string, input: SendInterestInput) {
  if (userId === input.targetUserId) {
    throw new AppError("You cannot express interest in your own profile.", 400);
  }

  const [viewer, targetUser, existingRequest, reverseRequest] = await Promise.all([
    getUserWithProfileOrThrow(userId),
    db.user.findUnique({
      where: {
        id: input.targetUserId,
      },
      include: userWithProfileInclude,
    }),
    db.interestRequest.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: userId,
          toUserId: input.targetUserId,
        },
      },
    }),
    db.interestRequest.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: input.targetUserId,
          toUserId: userId,
        },
      },
    }),
  ]);

  const viewerCompletion = buildProfileCompletionState({
    fullName: viewer.fullName,
    gender: viewer.profile?.gender,
    dateOfBirth: viewer.profile?.dateOfBirth,
    height: viewer.profile?.heightLabel ?? viewer.profile?.heightCm,
    maritalStatus: viewer.profile?.maritalStatus,
    profilePhotoUrl: viewer.profile?.profilePhotoUrl,
    community: viewer.profile?.community,
    religion: viewer.profile?.religion,
    caste: viewer.profile?.caste,
    city: viewer.profile?.city,
    state: viewer.profile?.state,
    education: viewer.profile?.education,
    occupation: viewer.profile?.occupation,
    annualIncome: viewer.profile?.annualIncome,
    familyStatus: viewer.profile?.familyStatus,
    familyType: viewer.profile?.familyType,
    about: viewer.profile?.about,
    hobbies: viewer.profile?.hobbies,
    selectedInterests: viewer.profile?.interests.map(({ interest }) => interest.label) ?? [],
    partnerLocation: viewer.profile?.partnerLocation,
    partnerExpectations: viewer.profile?.partnerExpectations,
    email: viewer.email,
    phone: viewer.phone,
    horoscopeImageUrl: viewer.profile?.horoscopeImageUrl,
  });

  if (!viewerCompletion.isComplete) {
    throw new AppError("Complete your profile before sending an interest request.", 400);
  }

  if (!viewer.profile) {
    throw new AppError("Profile not found.", 404);
  }

  if (
    !targetUser ||
    !targetUser.profile ||
    targetUser.accountStatus !== AccountStatus.ACTIVE ||
    targetUser.profile.status !== ProfileStatus.APPROVED
  ) {
    throw new AppError("This profile is not currently available for new interest requests.", 404);
  }

  if (viewer.profile.gender === targetUser.profile.gender) {
    throw new AppError("Interest requests are only available for compatible member profiles.", 400);
  }

  if (existingRequest) {
    throw new AppError("You have already expressed interest in this member.", 409);
  }

  if (reverseRequest && reverseRequest.status === InterestRequestStatus.PENDING) {
    throw new AppError(
      "This member has already expressed interest in you. Review it in My Interests.",
      409,
    );
  }

  if (
    reverseRequest &&
    (reverseRequest.status === InterestRequestStatus.ACCEPTED ||
      reverseRequest.status === InterestRequestStatus.CONTACT_SHARED)
  ) {
    throw new AppError("A connection already exists with this member.", 409);
  }

  return db.interestRequest.create({
    data: {
      fromUserId: userId,
      toUserId: input.targetUserId,
      status: InterestRequestStatus.PENDING,
    },
    include: interestRequestInclude,
  });
}

export async function handleInterestAction(userId: string, input: InterestActionInput) {
  const request = await db.interestRequest.findUnique({
    where: {
      id: input.interestId,
    },
    include: interestRequestInclude,
  });

  if (!request) {
    throw new AppError("Interest request not found.", 404);
  }

  // ── Withdraw: sender removes their own pending request ────────────────────
  if (input.action === "withdraw") {
    if (request.fromUserId !== userId) {
      throw new AppError("You can only withdraw interest requests you sent.", 403);
    }

    if (request.status !== InterestRequestStatus.PENDING) {
      throw new AppError("Only pending interest requests can be withdrawn.", 400);
    }

    await db.interestRequest.delete({
      where: { id: input.interestId },
    });

    return null;
  }

  // ── Accept / Decline: recipient responds to an incoming pending request ───
  if (request.toUserId !== userId) {
    throw new AppError("You can only respond to interest requests sent to you.", 403);
  }

  if (request.status === InterestRequestStatus.CONTACT_SHARED) {
    throw new AppError("This request has already been completed.", 400);
  }

  if (request.status !== InterestRequestStatus.PENDING) {
    throw new AppError("Only pending interest requests can be accepted or declined.", 400);
  }

  const nextStatus =
    input.action === "accept"
      ? InterestRequestStatus.ACCEPTED
      : InterestRequestStatus.DECLINED;

  return db.interestRequest.update({
    where: { id: input.interestId },
    data: { status: nextStatus },
    include: interestRequestInclude,
  });
}
