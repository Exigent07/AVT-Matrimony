import { AccountStatus } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionViewer } from "@/types/domain";
import { db } from "@/server/db";
import { buildSessionViewer } from "@/server/services/mappers";

export const SESSION_COOKIE_NAME = "avt_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.session.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await db.session.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export const getCurrentViewer = cache(async (): Promise<SessionViewer | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    include: {
      user: {
        include: {
          profile: {
            include: {
              interests: {
                include: {
                  interest: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  if (session.expiresAt <= new Date() || session.user.accountStatus === AccountStatus.BLOCKED) {
    await db.session.delete({
      where: {
        id: session.id,
      },
    });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  await db.session.update({
    where: {
      id: session.id,
    },
    data: {
      lastSeenAt: new Date(),
    },
  });

  return buildSessionViewer(session.user);
});

export async function requireViewer() {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    redirect("/login");
  }

  return viewer;
}

export async function requireMemberViewer() {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    redirect("/login");
  }

  if (viewer.role !== "MEMBER") {
    redirect("/admin/dashboard");
  }

  return viewer;
}

export async function requireAdminViewer() {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    redirect("/admin/login");
  }

  if (viewer.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return viewer;
}
