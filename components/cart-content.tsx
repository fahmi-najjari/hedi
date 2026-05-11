"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { createOrder } from "@/app/[locale]/checkout/actions";
import {
  clearCart,
  getCartItemCount,
  readCart,
  writeCart,
  type CartItem,
} from "@/components/cart-store";
import { Money, PriceWithUnit } from "@/components/money";
import { PaymentMethod } from "@/generated/prisma/enums";

function formatUnit(unit: string) {
  const units: Record<string, string> = {
    PIECE: "piece",
    KG: "kg",
    TRAY: "plateau",
    BAG: "sac",
  };

  return units[unit] ?? unit.toLowerCase();
}

export function CartContent({
  locale,
  ordered,
}: {
  locale: string;
  ordered?: string;
}) {
  const [items, setItems] = useState<CartItem[]>(() =>
    ordered || typeof window === "undefined" ? [] : readCart(),
  );
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const itemCount = getCartItemCount(items);
  const itemCountLabel =
    locale === "ar"
      ? `${itemCount} منتج في السلة`
      : locale === "fr"
        ? `${itemCount} article${itemCount === 1 ? "" : "s"} dans le panier`
        : `${itemCount} item${itemCount === 1 ? "" : "s"} in cart`;

  useEffect(() => {
    if (ordered) {
      clearCart();
    }
  }, [ordered]);

  function updateQuantity(productId: string, quantity: number) {
    const nextItems = items
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) }
          : item,
      )
      .filter((item) => item.quantity > 0);

    setItems(nextItems);
    writeCart(nextItems);
  }

  function removeItem(productId: string) {
    const nextItems = items.filter((item) => item.id !== productId);
    setItems(nextItems);
    writeCart(nextItems);
  }

  if (ordered) {
    return (
      <section className="mx-auto w-full max-w-xl rounded-lg border border-emerald-200 bg-white p-5 text-card-foreground shadow-sm">
        <p className="font-mono text-xs uppercase text-emerald-700">
          Commande recue
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-normal">
          Merci
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Votre commande a ete envoyee. Nous vous contacterons pour confirmer la
          disponibilite et la livraison.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-lg border border-card-border bg-white text-card-foreground shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              Panier
            </p>
            <h1 className="text-xl font-semibold tracking-normal">
              Votre commande
            </h1>
          </div>
          <p className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            {itemCountLabel}
          </p>
        </div>

        {items.length === 0 ? (
          <p className="px-4 py-5 text-sm leading-6 text-muted-foreground">
            Votre panier est vide pour le moment.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-serif text-base font-bold">
                    {item.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <PriceWithUnit
                      value={item.price}
                      unit={formatUnit(item.unit)}
                    />
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="inline-flex h-8 items-center rounded-full border border-border bg-background">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center text-muted-foreground transition hover:text-foreground"
                      aria-label="Reduire la quantite"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.id, Number(event.target.value))
                      }
                      className="h-8 w-9 border-x border-border bg-transparent text-center text-xs font-semibold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center text-muted-foreground transition hover:text-foreground"
                      aria-label="Augmenter la quantite"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-lg border border-card-border bg-white text-card-foreground shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-serif text-lg font-bold">Finaliser</h2>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xl font-bold">
              <Money value={subtotal} />
            </span>
          </div>
        </div>

        <form action={createOrder} className="grid gap-3 p-4">
          <input type="hidden" name="locale" value={locale} />
          <input
            type="hidden"
            name="cart"
            value={JSON.stringify(
              items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            )}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Nom
            </span>
            <input
              name="customerName"
              required
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Telephone
            </span>
            <input
              name="customerPhone"
              required
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Email
            </span>
            <input
              name="customerEmail"
              type="email"
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Adresse
            </span>
            <textarea
              name="address"
              required
              rows={2}
              className="mt-1 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Paiement
            </span>
            <select
              name="paymentMethod"
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
            >
              <option value={PaymentMethod.CASH_ON_DELIVERY}>
                Paiement a la livraison
              </option>
              <option value={PaymentMethod.CASH_ON_SITE}>Paiement sur place</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">
              Notes
            </span>
            <textarea
              name="notes"
              rows={2}
              className="mt-1 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <button
            disabled={items.length === 0}
            className="h-9 w-full rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Envoyer la commande
          </button>
        </form>
      </aside>
    </section>
  );
}
