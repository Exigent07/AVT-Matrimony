import { InterestRequestStatus, UserRole } from "@prisma/client";
import type { z } from "zod";
import { buildProfileCompletion, normalizePhone } from "@/lib/profile-utils";
import type { AdminDashboardData } from "@/types/domain";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import {
  buildAdminInterestItem,
  buildAdminUserItem,
  buildReportItem,
  buildSupportTicketItem,
  buildSessionViewer,
  interestRequestInclude,
  reportInclude,
  userWithProfileInclude,
} from "@/server/services/mappers";
import {
  adminReportUpdateSchema,
  adminTicketUpdateSchema,
  adminUserUpdateSchema,
} from "@/server/validation";

type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
type AdminTicketUpdateInput = z.infer<typeof adminTicketUpdateSchema>;
type AdminReportUpdateInput = z.infer<typeof adminReportUpdateSchema>;

export async function getAdminDashboardData(userId: string): Promise<AdminDashboardData> {
  const [viewer, users, interestRequests, tickets, reports] = await Promise.all([
    db.user.findUnique({
      where: {
        id: userId,
      },
      include: userWithProfileInclude,
    }),
    db.user.findMany({
      where: {
        role: UserRole.MEMBER,
      },
      include: userWithProfileInclude,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.interestRequest.findMany({
      include: interestRequestInclude,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.supportTicket.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    }),
    db.userReport.findMany({
      include: reportInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    }),
  ]);

  if (!viewer) {
    throw new AppError("Admin account not found.", 404);
  }

  const interestCountByUserId = new Map<string, number>();
  interestRequests.forEach((request) => {
    interestCountByUserId.set(
      request.fromUserId,
      (interestCountByUserId.get(request.fromUserId) ?? 0) + 1,
    );
    interestCountByUserId.set(
      request.toUserId,
      (interestCountByUserId.get(request.toUserId) ?? 0) + 1,
    );
  });

  return {
    viewer: buildSessionViewer(viewer),
    stats: {
      totalUsers: users.length,
      pendingProfiles: users.filter((user) => user.profile?.status === "PENDING").length,
      pendingInterests: interestRequests.filter((request) => request.status === "PENDING").length,
      sharedContacts: interestRequests.filter((request) => request.status === "CONTACT_SHARED")
        .length,
      openTickets: tickets.filter((ticket) => ticket.status !== "CLOSED").length,
      openReports: reports.filter((report) => report.status !== "RESOLVED").length,
    },
    users: users.map((user) =>
      buildAdminUserItem(user, interestCountByUserId.get(user.id) ?? 0),
    ),
    interests: interestRequests.map((request) => buildAdminInterestItem(request)),
    tickets: tickets.map((ticket) => buildSupportTicketItem(ticket)),
    reports: reports.map((report) => buildReportItem(report)),
  };
}

export async function updateUserByAdmin(userId: string, input: AdminUserUpdateInput) {
  const existingUser = await db.user.findUnique({
    where: { id: userId },
    include: userWithProfileInclude,
  });

  if (!existingUser || !existingUser.profile) {
    throw new AppError("User not found.", 404);
  }

  if (existingUser.role === UserRole.ADMIN) {
    throw new AppError("Administrator accounts cannot be edited here.", 403);
  }

  if (input.email && input.email !== existingUser.email) {
    const emailOwner = await db.user.findUnique({
      where: { email: input.email },
    });

    if (emailOwner && emailOwner.id !== userId) {
      throw new AppError("This email address is already in use.", 409);
    }
  }

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone ? normalizePhone(input.phone) : input.phone,
      accountStatus: input.accountStatus,
      profile: {
        update: {
          city: input.city,
          occupation: input.occupation,
          status: input.profileStatus,
        },
      },
    },
    include: userWithProfileInclude,
  });

  // Recalculate isProfileComplete whenever admin changes fields that affect
  // completion (city, occupation, email, phone, fullName). Using the returned
  // user ensures we reflect the merged state of all profile fields.
  const profile = updatedUser.profile!;
  const isProfileComplete = buildProfileCompletion({
    fullName: updatedUser.fullName,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    height: profile.heightLabel ?? profile.heightCm,
    maritalStatus: profile.maritalStatus,
    profilePhotoUrl: profile.profilePhotoUrl,
    community: profile.community,
    religion: profile.religion,
    caste: profile.caste,
    city: profile.city,
    state: profile.state,
    education: profile.education,
    occupation: profile.occupation,
    annualIncome: profile.annualIncome,
    familyStatus: profile.familyStatus,
    familyType: profile.familyType,
    about: profile.about,
    hobbies: profile.hobbies,
    selectedInterests: profile.interests.map(({ interest }) => interest.label),
    partnerLocation: profile.partnerLocation,
    partnerExpectations: profile.partnerExpectations,
    email: updatedUser.email,
    phone: updatedUser.phone,
    horoscopeImageUrl: profile.horoscopeImageUrl,
  });

  if (profile.isProfileComplete !== isProfileComplete) {
    await db.profile.update({
      where: { id: profile.id },
      data: { isProfileComplete },
    });
    // Return fresh user with the updated completion flag.
    return db.user.findUniqueOrThrow({
      where: { id: userId },
      include: userWithProfileInclude,
    });
  }

  return updatedUser;
}

export async function deleteUserByAdmin(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError("Administrator accounts cannot be deleted here.", 403);
  }

  await db.user.delete({
    where: {
      id: userId,
    },
  });
}

export async function shareContactByAdmin(interestId: string) {
  const request = await db.interestRequest.findUnique({
    where: {
      id: interestId,
    },
  });

  if (!request) {
    throw new AppError("Interest request not found.", 404);
  }

  if (request.status !== InterestRequestStatus.ACCEPTED) {
    throw new AppError(
      "Contact details can only be shared after the recipient has accepted the request.",
      400,
    );
  }

  return db.interestRequest.update({
    where: {
      id: interestId,
    },
    data: {
      status: InterestRequestStatus.CONTACT_SHARED,
      contactSharedAt: new Date(),
    },
    include: interestRequestInclude,
  });
}

export async function updateTicketStatus(input: AdminTicketUpdateInput) {
  const ticket = await db.supportTicket.findUnique({
    where: { id: input.ticketId },
    select: { id: true },
  });

  if (!ticket) {
    throw new AppError("Support ticket not found.", 404);
  }

  return db.supportTicket.update({
    where: { id: input.ticketId },
    data: { status: input.status },
  });
}

export async function updateReportStatus(input: AdminReportUpdateInput) {
  const report = await db.userReport.findUnique({
    where: { id: input.reportId },
    select: { id: true },
  });

  if (!report) {
    throw new AppError("Report not found.", 404);
  }

  // Return the updated report with its related users so callers
  // don't need a separate fetch to build the response DTO.
  return db.userReport.update({
    where: { id: input.reportId },
    data: { status: input.status },
    include: reportInclude,
  });
}
