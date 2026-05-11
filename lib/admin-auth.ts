import "server-only";

import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";

const sessionCookieName = "admin_session";
const sessionDurationMs = 1000 * 60 * 60 * 24 * 7;

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string | null;
};

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const hashedBuffer = Buffer.from(hash, "hex");
  const passwordBuffer = scryptSync(password, salt, 64);

  return (
    hashedBuffer.length === passwordBuffer.length &&
    timingSafeEqual(hashedBuffer, passwordBuffer)
  );
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getConfiguredAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
}

export async function createAdminSession(adminId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + sessionDurationMs);

  await getPrisma().adminSession.create({
    data: {
      adminId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (token) {
    await getPrisma().adminSession.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  }

  cookieStore.delete(sessionCookieName);
}

export async function getCurrentAdmin(): Promise<AdminSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  const session = await getPrisma().adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { admin: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    await clearAdminSession();
    return null;
  }

  const configuredAdminEmail = getConfiguredAdminEmail();

  if (
    !configuredAdminEmail ||
    session.admin.email.toLowerCase() !== configuredAdminEmail
  ) {
    await clearAdminSession();
    return null;
  }

  return {
    id: session.admin.id,
    email: session.admin.email,
    name: session.admin.name,
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/signin");
  }

  return admin;
}
