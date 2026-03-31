import { NextResponse } from "next/server";
import { createSession } from "@/server/auth";
import { apiError } from "@/server/api";
import { authenticateMember } from "@/server/services/auth";
import { buildSessionViewer } from "@/server/services/mappers";
import { loginSchema } from "@/server/validation";

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const user = await authenticateMember(payload);
    await createSession(user.id);

    return NextResponse.json({
      viewer: buildSessionViewer(user),
    });
  } catch (error) {
    return apiError(error);
  }
}
