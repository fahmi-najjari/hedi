"use client";

import { use } from "react";
import { CartContent } from "@/components/cart-content";

type CartSearchParams = {
  ordered?: string | string[];
};

export function CartPageClient({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: Promise<CartSearchParams>;
}) {
  const { ordered } = use(searchParams);
  const orderedValue = Array.isArray(ordered) ? ordered[0] : ordered;

  return <CartContent locale={locale} ordered={orderedValue} />;
}
