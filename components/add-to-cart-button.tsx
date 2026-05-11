"use client";

import { Check, ShoppingBasket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { readCart, writeCart } from "@/components/cart-store";

type CartProduct = {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string | null;
};

export function AddToCartButton({
  product,
  label,
  addedLabel = "Added",
  tone = "default",
  disabled,
}: {
  product: CartProduct;
  label: string;
  addedLabel?: string;
  tone?: "default" | "organic";
  disabled?: boolean;
}) {
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function addToCart() {
    const cart = readCart();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    writeCart(cart);
    setJustAdded(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  }

  return (
    <div className="mt-3 space-y-1">
      <button
        type="button"
        onClick={addToCart}
        disabled={disabled}
        className={`inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          tone === "organic"
            ? "bg-emerald-700 text-white hover:bg-emerald-800"
            : "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        {justAdded ? (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ShoppingBasket className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {justAdded ? addedLabel : label}
      </button>
      <p
        aria-live="polite"
        className={`min-h-4 text-center text-[11px] font-semibold transition ${
          justAdded
            ? tone === "organic"
              ? "text-emerald-700"
              : "text-primary"
            : "text-transparent"
        }`}
      >
        {addedLabel}
      </p>
    </div>
  );
}
