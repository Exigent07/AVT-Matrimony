import { NextResponse } from "next/server";
import { apiError, requireApiViewer } from "@/server/api";
import { updateReportStatus } from "@/server/services/admin";
import { buildReportItem } from "@/server/services/mappers";
import { adminReportUpdateSchema } from "@/server/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ reportId: string }> },
) {
  try {
    await requireApiViewer("ADMIN");
    const { reportId } = await context.params;
    const payload = adminReportUpdateSchema.parse({
      ...(await request.json()),
      reportId,
    });

    // updateReportStatus now returns the full report with related users
    // included, so no separate re-fetch is needed.
    const report = await updateReportStatus(payload);

    return NextResponse.json({
      report: buildReportItem(report),
    });
  } catch (error) {
    return apiError(error);
  }
}
