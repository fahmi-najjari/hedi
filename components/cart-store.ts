"use client";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string | null;
  quantity: number;
};

export const cartStorageKey = "hedi_cart";
export const cartUpdatedEvent = "cart-updated";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(cartStorageKey);
    return value ? (JSON.parse(value) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event(cartUpdatedEvent));
}

export function clearCart() {
  window.localStorage.removeItem(cartStorageKey);
  window.dispatchEvent(new Event(cartUpdatedEvent));
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}
