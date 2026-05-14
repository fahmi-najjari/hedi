import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CheckCircle2, Clock, PackageCheck, ShieldCheck, XCircle } from "lucide-react";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { Money } from "@/components/money";
import { OrderStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

const statusCopy: Record<
  OrderStatus,
  {
    eyebrow: string;
    title: string;
    text: string;
    Icon: typeof Clock;
    tone: string;
  }
> = {
  NEW: {
    eyebrow: "Commande envoyee",
    title: "Votre commande est en traitement",
    text: "Nous avons recu votre commande. L'equipe va verifier la disponibilite et vous contacter pour confirmation.",
    Icon: Clock,
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  CONFIRMED: {
    eyebrow: "Commande acceptee",
    title: "Votre commande est confirmee",
    text: "La commande a ete acceptee par l'administration. Elle sera preparee selon la disponibilite et la livraison.",
    Icon: ShieldCheck,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  PREPARING: {
    eyebrow: "Preparation",
    title: "Votre commande est en preparation",
    text: "L'equipe prepare actuellement les produits de votre commande.",
    Icon: PackageCheck,
    tone: "border-blue-200 bg-blue-50 text-blue-800",
  },
  DELIVERED: {
    eyebrow: "Commande completee",
    title: "Votre commande est terminee",
    text: "La commande a ete livree ou recue. Merci pour votre achat.",
    Icon: CheckCircle2,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  CANCELLED: {
    eyebrow: "Commande annulee",
    title: "Cette commande a ete annulee",
    text: "La commande ne sera pas traitee. Contactez-nous si vous pensez qu'il s'agit d'une erreur.",
    Icon: XCircle,
    tone: "border-red-200 bg-red-50 text-red-800",
  },
};

export default async function OrderStatusPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const order = await getPrisma().order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const status = statusCopy[order.status];
  const Icon = status.Icon;

  return (
    <main className="min-h-screen flex-1 bg-background px-4 py-10 text-foreground md:px-6">
      <ClearCartOnMount />
      <section className="mx-auto grid w-full max-w-3xl gap-4">
        <div className={`rounded-lg border p-5 ${status.tone}`}>
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-mono text-xs uppercase">{status.eyebrow}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal">
                {status.title}
              </h1>
              <p className="mt-2 text-sm leading-6 opacity-85">
                {status.text}
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-lg border border-card-border bg-white p-5 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Reference</p>
              <p className="mt-1 font-mono text-xs font-semibold text-foreground">
                {order.id}
              </p>
            </div>
            <div className="text-sm font-bold">
              <Money value={Number(order.subtotal)} />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2 text-sm"
              >
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span className="font-semibold">
                  <Money value={Number(item.lineTotal)} />
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              Retour a la boutique
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="inline-flex h-9 items-center justify-center rounded-full bg-secondary px-4 text-xs font-semibold text-secondary-foreground transition hover:opacity-90"
            >
              Voir le panier
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
