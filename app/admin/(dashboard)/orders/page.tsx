import { formatMoney } from "@/app/admin/(dashboard)/format";
import { getPrisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await getPrisma().order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Commandes</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Consultez les commandes clients recentes.
        </p>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="grid gap-3">
          {orders.length === 0 ? (
            <p className="text-xs text-zinc-600">Aucune commande.</p>
          ) : null}
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-md border border-zinc-200 p-3"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-950">
                    {order.customerName}
                  </h2>
                  <p className="text-xs text-zinc-600">
                    {order.customerPhone} - {order.address}
                  </p>
                  {order.customerEmail ? (
                    <p className="text-xs text-zinc-500">
                      {order.customerEmail}
                    </p>
                  ) : null}
                </div>
                <div className="text-xs font-semibold text-zinc-950">
                  {formatMoney(order.subtotal)}
                </div>
              </div>
              <ul className="mt-2 list-disc space-y-1 ps-5 text-xs text-zinc-600">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity} x {item.name} ({formatMoney(item.lineTotal)})
                  </li>
                ))}
              </ul>
              {order.notes ? (
                <p className="mt-2 rounded-md bg-zinc-50 p-2 text-xs text-zinc-600">
                  {order.notes}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
