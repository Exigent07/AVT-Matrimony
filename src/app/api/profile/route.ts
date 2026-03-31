import { NextResponse } from "next/server";
import { apiError, requireApiViewer } from "@/server/api";
import { updateProfile } from "@/server/services/profiles";
import { buildProfileDetail, buildSessionViewer } from "@/server/services/mappers";
import { profileUpdateSchema } from "@/server/validation";

export async function PUT(request: Request) {
  try {
    const viewer = await requireApiViewer("MEMBER");
    const payload = profileUpdateSchema.parse(await request.json());
    const user = await updateProfile(viewer.id, payload);

    return NextResponse.json({
      viewer: buildSessionViewer(user),
      profile: buildProfileDetail(user, { canViewContact: true }),
    });
  } catch (error) {
    return apiError(error);
  }
}
