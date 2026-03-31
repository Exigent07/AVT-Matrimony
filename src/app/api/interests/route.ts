import { NextResponse } from "next/server";
import { apiError, requireApiViewer } from "@/server/api";
import {
  handleInterestAction,
  sendInterest,
} from "@/server/services/profiles";
import { buildInterestItem } from "@/server/services/mappers";
import { interestActionSchema, sendInterestSchema } from "@/server/validation";

export async function POST(request: Request) {
  try {
    const viewer = await requireApiViewer("MEMBER");
    const payload = sendInterestSchema.parse(await request.json());
    const interest = await sendInterest(viewer.id, payload);

    return NextResponse.json({
      interest: buildInterestItem(interest, viewer.id),
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const viewer = await requireApiViewer("MEMBER");
    const payload = interestActionSchema.parse(await request.json());
    const interest = await handleInterestAction(viewer.id, payload);

    return NextResponse.json({
      interest: interest ? buildInterestItem(interest, viewer.id) : null,
    });
  } catch (error) {
    return apiError(error);
  }
}
