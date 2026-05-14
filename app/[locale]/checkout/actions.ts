"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PaymentMethod, StockStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getPaymentMethod(value: string) {
  return value === PaymentMethod.CASH_ON_SITE
    ? PaymentMethod.CASH_ON_SITE
    : PaymentMethod.CASH_ON_DELIVERY;
}

export async function createOrder(formData: FormData) {
  const locale = getString(formData, "locale") || "fr";
  const customerName = getString(formData, "customerName");
  const customerPhone = getString(formData, "customerPhone");
  const customerEmail = getString(formData, "customerEmail") || null;
  const address = getString(formData, "address");
  const notes = getString(formData, "notes") || null;
  const paymentMethod = getPaymentMethod(getString(formData, "paymentMethod"));
  const cartPayload = getString(formData, "cart");

  if (!customerName || !customerPhone || !address || !cartPayload) {
    redirect(`/${locale}/cart?error=missing`);
  }

  let cartItems: Array<{ productId: string; quantity: number }>;

  try {
    cartItems = JSON.parse(cartPayload);
  } catch {
    redirect(`/${locale}/cart?error=cart`);
  }

  const normalizedItems = cartItems
    .map((item) => ({
      productId: String(item.productId ?? ""),
      quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
    }))
    .filter((item) => item.productId);

  if (normalizedItems.length === 0) {
    redirect(`/${locale}/cart?error=cart`);
  }

  const prisma = getPrisma();
  const products = await prisma.product.findMany({
    where: {
      id: { in: normalizedItems.map((item) => item.productId) },
      isActive: true,
    },
  });

  const productById = new Map(products.map((product) => [product.id, product]));
  const orderItems = normalizedItems
    .map((item) => {
      const product = productById.get(item.productId);

      if (!product) {
        return null;
      }

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * item.quantity;
      const stockQuantity = Number(product.stockQuantity);

      if (stockQuantity < item.quantity) {
        redirect(`/${locale}/cart?error=stock`);
      }

      return {
        productId: product.id,
        name: product.name,
        unit: product.unit,
        quantity: item.quantity,
        unitPrice: unitPrice.toFixed(2),
        lineTotal: lineTotal.toFixed(2),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (orderItems.length === 0) {
    redirect(`/${locale}/cart?error=cart`);
  }

  const subtotal = orderItems.reduce(
    (total, item) => total + Number(item.lineTotal),
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        redirect(`/${locale}/cart?error=cart`);
      }

      const currentStock = Number(product.stockQuantity);

      if (currentStock < item.quantity) {
        redirect(`/${locale}/cart?error=stock`);
      }

      const nextStock = currentStock - item.quantity;
      const lowStockThreshold = Number(product.lowStockThreshold);

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: nextStock.toFixed(2),
          stockStatus:
            nextStock <= 0
              ? StockStatus.OUT_OF_STOCK
              : lowStockThreshold > 0 && nextStock <= lowStockThreshold
                ? StockStatus.LIMITED
                : StockStatus.AVAILABLE,
        },
      });
    }

    return tx.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        address,
        notes,
        paymentMethod,
        subtotal: subtotal.toFixed(2),
        items: {
          create: orderItems,
        },
      },
    });
  });

  revalidatePath("/[locale]/shop", "page");
  revalidatePath("/[locale]", "page");
  redirect(`/${locale}/cart?ordered=${order.id}`);
}
