import { NextResponse } from "next/server";
import { destroySession } from "@/server/auth";
import { apiError } from "@/server/api";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
