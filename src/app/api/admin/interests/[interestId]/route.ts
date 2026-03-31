import { NextResponse } from "next/server";
import { apiError, requireApiViewer } from "@/server/api";
import { shareContactByAdmin } from "@/server/services/admin";
import { buildAdminInterestItem } from "@/server/services/mappers";

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ interestId: string }> },
) {
  try {
    await requireApiViewer("ADMIN");
    const { interestId } = await context.params;
    const interest = await shareContactByAdmin(interestId);

    return NextResponse.json({
      interest: buildAdminInterestItem(interest),
    });
  } catch (error) {
    return apiError(error);
  }
}
