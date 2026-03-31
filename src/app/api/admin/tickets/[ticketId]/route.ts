import { NextResponse } from "next/server";
import { apiError, requireApiViewer } from "@/server/api";
import { updateTicketStatus } from "@/server/services/admin";
import { buildSupportTicketItem } from "@/server/services/mappers";
import { adminTicketUpdateSchema } from "@/server/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ ticketId: string }> },
) {
  try {
    await requireApiViewer("ADMIN");
    const { ticketId } = await context.params;
    const payload = adminTicketUpdateSchema.parse({
      ...(await request.json()),
      ticketId,
    });
    const ticket = await updateTicketStatus(payload);

    return NextResponse.json({
      ticket: buildSupportTicketItem(ticket),
    });
  } catch (error) {
    return apiError(error);
  }
}
