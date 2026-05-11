import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { CartContent } from "@/components/cart-content";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ordered?: string }>;
};

export default function CartPage({ params, searchParams }: Props) {
  const { locale } = use(params);
  const { ordered } = use(searchParams);
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-1 bg-background px-4 py-8 text-foreground md:px-6">
      <CartContent locale={locale} ordered={ordered} />
    </main>
  );
}
