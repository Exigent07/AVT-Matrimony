import type { z } from "zod";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { reportSchema, supportTicketSchema } from "@/server/validation";

type SupportTicketInput = z.infer<typeof supportTicketSchema>;
type ReportInput = z.infer<typeof reportSchema>;

export async function createSupportTicket(
  userId: string | null,
  input: SupportTicketInput,
) {
  return db.supportTicket.create({
    data: {
      userId,
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
    },
  });
}

export async function createUserReport(userId: string | null, input: ReportInput) {
  const reportedUser =
    (await db.user.findFirst({
      where: {
        OR: [{ id: input.profileId }, { profile: { id: input.profileId } }],
      },
    })) ?? null;

  if (!reportedUser && input.reason !== "OTHER") {
    throw new AppError("We could not find a member with that profile reference.", 404);
  }

  return db.userReport.create({
    data: {
      reporterUserId: userId,
      reportedUserId: reportedUser?.id ?? null,
      reportedProfileReference: input.profileId,
      reason: input.reason,
      details: input.details,
    },
  });
}
