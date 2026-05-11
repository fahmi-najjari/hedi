import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { CartPageClient } from "./cart-page-client";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ordered?: string | string[] }>;
};

export default async function CartPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-1 bg-background px-4 py-8 text-foreground md:px-6">
      <Suspense fallback={<CartPageFallback />}>
        <CartPageClient locale={locale} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

function CartPageFallback() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="h-56 rounded-lg border border-card-border bg-white shadow-sm" />
      <div className="h-72 rounded-lg border border-card-border bg-white shadow-sm" />
    </section>
  );
}
