import { NextResponse } from "next/server";
import { getCurrentViewer } from "@/server/auth";
import { apiError } from "@/server/api";

export async function GET() {
  try {
    const viewer = await getCurrentViewer();
    return NextResponse.json({ viewer });
  } catch (error) {
    return apiError(error);
  }
}
