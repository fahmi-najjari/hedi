"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ExpenseCategory } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  return getString(formData, key) || null;
}

function getAmount(formData: FormData, key: string) {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : 0;
}

function getDate(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value ? new Date(`${value}T00:00:00`) : new Date();
}

function getOptionalDate(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value ? new Date(`${value}T00:00:00`) : null;
}

function getExpenseCategory(value: string) {
  return Object.values(ExpenseCategory).includes(value as ExpenseCategory)
    ? (value as ExpenseCategory)
    : ExpenseCategory.OTHER;
}

function revalidateFinancePages() {
  revalidatePath("/admin");
  revalidatePath("/admin/employees");
  revalidatePath("/admin/expenses");
  revalidatePath("/admin/finance");
}

export async function createEmployee(formData: FormData) {
  await requireAdmin();

  const name = getString(formData, "name");
  const role = getString(formData, "role");
  const salary = getAmount(formData, "salary");

  if (!name || !role || salary < 0) {
    redirect("/admin/employees?error=employee");
  }

  await getPrisma().employee.create({
    data: {
      name,
      role,
      salary,
      phone: getOptionalString(formData, "phone"),
      startDate: getOptionalDate(formData, "startDate"),
      notes: getOptionalString(formData, "notes"),
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidateFinancePages();
  redirect("/admin/employees?employee=created");
}

export async function updateEmployee(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const name = getString(formData, "name");
  const role = getString(formData, "role");
  const salary = getAmount(formData, "salary");

  if (!id || !name || !role || salary < 0) {
    redirect("/admin/employees?error=employee");
  }

  await getPrisma().employee.update({
    where: { id },
    data: {
      name,
      role,
      salary,
      phone: getOptionalString(formData, "phone"),
      startDate: getOptionalDate(formData, "startDate"),
      notes: getOptionalString(formData, "notes"),
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidateFinancePages();
  redirect("/admin/employees?employee=updated");
}

export async function softRemoveEmployee(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/employees");
  }

  await getPrisma().employee.update({
    where: { id },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });

  revalidateFinancePages();
  redirect("/admin/employees?employee=removed");
}

export async function createExpense(formData: FormData) {
  await requireAdmin();

  const title = getString(formData, "title");
  const amount = getAmount(formData, "amount");
  const employeeId = getOptionalString(formData, "employeeId");

  if (!title || amount <= 0) {
    redirect("/admin/expenses?error=expense");
  }

  await getPrisma().expense.create({
    data: {
      title,
      amount,
      category: getExpenseCategory(getString(formData, "category")),
      employeeId,
      expenseDate: getDate(formData, "expenseDate"),
      notes: getOptionalString(formData, "notes"),
    },
  });

  revalidateFinancePages();
  redirect("/admin/expenses?expense=created");
}

export async function cancelExpense(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirect("/admin/expenses");
  }

  await getPrisma().expense.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidateFinancePages();
  redirect("/admin/expenses?expense=cancelled");
}
