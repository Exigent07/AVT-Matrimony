import { NextResponse } from "next/server";
import { createSession } from "@/server/auth";
import { apiError } from "@/server/api";
import { registerMember } from "@/server/services/auth";
import { buildSessionViewer } from "@/server/services/mappers";
import { registerSchema } from "@/server/validation";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());
    const user = await registerMember(payload);
    await createSession(user.id);

    return NextResponse.json({
      viewer: buildSessionViewer(user),
    });
  } catch (error) {
    return apiError(error);
  }
}
