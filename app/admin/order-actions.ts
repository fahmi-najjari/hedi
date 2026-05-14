"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getOrderStatus(value: string) {
  return Object.values(OrderStatus).includes(value as OrderStatus)
    ? (value as OrderStatus)
    : OrderStatus.NEW;
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const status = getOrderStatus(getString(formData, "status"));

  if (!id) {
    redirect("/admin/orders");
  }

  await getPrisma().order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/[locale]/order/[id]", "page");
  redirect("/admin/orders?order=updated");
}
