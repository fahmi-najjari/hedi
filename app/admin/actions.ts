"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  hashPassword,
} from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

const minimumAdminPasswordLength = 8;

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function getPassword(value: FormDataEntryValue | null) {
  return String(value ?? "");
}

function getConfiguredAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME?.trim() || null;

  if (!email || password.length < minimumAdminPasswordLength) {
    return null;
  }

  return { email, password, name };
}

export async function signInAdmin(formData: FormData) {
  const configuredAdmin = getConfiguredAdminCredentials();

  if (!configuredAdmin) {
    redirect("/admin/signin?error=config");
  }

  const email = normalizeEmail(formData.get("email"));
  const password = getPassword(formData.get("password"));

  if (!email || !password) {
    redirect("/admin/signin?error=missing");
  }

  if (
    email !== configuredAdmin.email ||
    password !== configuredAdmin.password
  ) {
    redirect("/admin/signin?error=invalid");
  }

  const admin = await getPrisma().admin.upsert({
    where: { email: configuredAdmin.email },
    create: {
      email: configuredAdmin.email,
      name: configuredAdmin.name,
      passwordHash: hashPassword(configuredAdmin.password),
    },
    update: {
      name: configuredAdmin.name,
      passwordHash: hashPassword(configuredAdmin.password),
    },
  });

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function signOutAdmin() {
  await clearAdminSession();
  redirect("/admin/signin");
}
