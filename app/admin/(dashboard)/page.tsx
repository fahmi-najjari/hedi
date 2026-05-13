import Link from "next/link";
import { formatMoney } from "@/app/admin/(dashboard)/format";
import { getPrisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, orderCount, latestOrders] =
    await Promise.all([
      getPrisma().product.count(),
      getPrisma().productCategory.count(),
      getPrisma().order.count(),
      getPrisma().order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Vue rapide de la boutique et raccourcis de gestion.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard label="Produits" value={productCount} href="/admin/products" />
        <SummaryCard
          label="Categories"
          value={categoryCount}
          href="/admin/categories"
        />
        <SummaryCard label="Commandes" value={orderCount} href="/admin/orders" />
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-zinc-950">
            Dernieres commandes
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-zinc-600 hover:text-zinc-950"
          >
            Voir tout
          </Link>
        </div>
        <div className="mt-3 grid gap-2">
          {latestOrders.length === 0 ? (
            <p className="text-xs text-zinc-600">Aucune commande.</p>
          ) : null}
          {latestOrders.map((order) => (
            <article
              key={order.id}
              className="grid gap-2 rounded-md border border-zinc-100 bg-zinc-50 p-3 text-xs md:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-semibold text-zinc-950">
                  {order.customerName}
                </p>
                <p className="mt-0.5 text-zinc-600">
                  {order.customerPhone} - {order.items.length} article(s)
                </p>
              </div>
              <p className="font-semibold text-zinc-950">
                {formatMoney(order.subtotal)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:bg-zinc-50"
    >
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </Link>
  );
}
