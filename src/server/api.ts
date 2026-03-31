import { NextResponse } from "next/server";
import { getCurrentViewer } from "@/server/auth";
import { AppError, getErrorMessage } from "@/server/errors";

export async function requireApiViewer(role?: "MEMBER" | "ADMIN") {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    throw new AppError("You must be logged in to continue.", 401);
  }

  if (role && viewer.role !== role) {
    throw new AppError("You do not have permission to perform this action.", 403);
  }

  return viewer;
}

export function apiError(error: unknown) {
  const statusCode =
    error instanceof AppError
      ? error.statusCode
      : typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2025"
        ? 404
        : typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
          ? 409
          : 500;
  const message =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
      ? "The requested record could not be found."
      : typeof error === "object" &&
          error !== null &&
          "code" in error &&
          error.code === "P2002"
        ? "A record with the same information already exists."
        : getErrorMessage(error);

  return NextResponse.json(
    {
      error: message,
    },
    {
      status: statusCode,
    },
  );
}
