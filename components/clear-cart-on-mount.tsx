"use client";

import { useEffect } from "react";
import { clearCart } from "@/components/cart-store";

export function ClearCartOnMount() {
  useEffect(() => {
    clearCart();
  }, []);

  return null;
}
