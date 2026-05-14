import { formatMoney } from "@/app/admin/(dashboard)/format";
import { updateOrderStatus } from "@/app/admin/order-actions";
import { OrderStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ order?: string }>;
};

const statusLabels: Record<OrderStatus, string> = {
  NEW: "Traitement",
  CONFIRMED: "Acceptee",
  PREPARING: "Preparation",
  DELIVERED: "Completee",
  CANCELLED: "Annulee",
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { order: orderMessage } = await searchParams;
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

      {orderMessage ? (
        <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700">
          Statut de commande mis a jour.
        </div>
      ) : null}

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
                <div className="mt-3 flex flex-col gap-2 rounded-md bg-zinc-50 p-2 md:flex-row md:items-center md:justify-between">
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-zinc-700">
                    {statusLabels[order.status]}
                  </span>
                  <form
                    action={updateOrderStatus}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input type="hidden" name="id" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs outline-none transition focus:border-zinc-950"
                    >
                      {Object.values(OrderStatus).map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                    <button className="h-8 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white transition hover:bg-zinc-800">
                      Mettre a jour
                    </button>
                  </form>
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
