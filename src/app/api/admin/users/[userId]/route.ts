import { NextResponse } from "next/server";
import { apiError, requireApiViewer } from "@/server/api";
import { deleteUserByAdmin, updateUserByAdmin } from "@/server/services/admin";
import { buildAdminUserItem } from "@/server/services/mappers";
import { db } from "@/server/db";
import { adminUserUpdateSchema } from "@/server/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await requireApiViewer("ADMIN");
    const { userId } = await context.params;
    const payload = adminUserUpdateSchema.parse(await request.json());
    const user = await updateUserByAdmin(userId, payload);

    // Query the actual interest count for this user rather than hard-coding 0.
    const interestCount = await db.interestRequest.count({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
    });

    return NextResponse.json({
      user: buildAdminUserItem(user, interestCount),
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    await requireApiViewer("ADMIN");
    const { userId } = await context.params;
    await deleteUserByAdmin(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
