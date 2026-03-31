import { NextResponse } from "next/server";
import { createSession } from "@/server/auth";
import { apiError } from "@/server/api";
import { authenticateAdmin } from "@/server/services/auth";
import { buildSessionViewer } from "@/server/services/mappers";
import { adminLoginSchema } from "@/server/validation";

export async function POST(request: Request) {
  try {
    const payload = adminLoginSchema.parse(await request.json());
    const user = await authenticateAdmin(payload);
    await createSession(user.id);

    return NextResponse.json({
      viewer: buildSessionViewer(user),
    });
  } catch (error) {
    return apiError(error);
  }
}
