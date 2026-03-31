import { NextResponse } from "next/server";
import { apiError } from "@/server/api";
import { getCurrentViewer } from "@/server/auth";
import { createSupportTicket } from "@/server/services/support";
import { supportTicketSchema } from "@/server/validation";

export async function POST(request: Request) {
  try {
    const viewer = await getCurrentViewer();
    const payload = supportTicketSchema.parse(await request.json());
    const ticket = await createSupportTicket(viewer?.id ?? null, payload);

    return NextResponse.json({
      ticketId: ticket.id,
    });
  } catch (error) {
    return apiError(error);
  }
}
