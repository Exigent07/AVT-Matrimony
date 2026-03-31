import { NextResponse } from "next/server";
import { apiError } from "@/server/api";
import { getCurrentViewer } from "@/server/auth";
import { createUserReport } from "@/server/services/support";
import { reportSchema } from "@/server/validation";

export async function POST(request: Request) {
  try {
    const viewer = await getCurrentViewer();
    const payload = reportSchema.parse(await request.json());
    const report = await createUserReport(viewer?.id ?? null, payload);

    return NextResponse.json({
      reportId: report.id,
    });
  } catch (error) {
    return apiError(error);
  }
}
