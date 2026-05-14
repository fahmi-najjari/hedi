import { AlertTriangle } from "lucide-react";
import { ProductUnit, StockStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedFields } from "@/lib/translations";

function formatQty(value: unknown, unit: ProductUnit) {
  return `${Number(value ?? 0).toFixed(2)} ${unit}`;
}

function getInventoryState(product: {
  stockQuantity: unknown;
  lowStockThreshold: unknown;
  stockStatus: StockStatus;
  isActive: boolean;
}) {
  const stock = Number(product.stockQuantity);
  const threshold = Number(product.lowStockThreshold);

  if (stock < 0) {
    return { label: "Survente", tone: "danger" };
  }

  if (stock <= 0 && product.isActive) {
    return { label: "Visible sans stock", tone: "danger" };
  }

  if (stock <= 0 || product.stockStatus === StockStatus.OUT_OF_STOCK) {
    return { label: "Rupture", tone: "danger" };
  }

  if (threshold > 0 && stock <= threshold) {
    return { label: "Stock bas", tone: "warning" };
  }

  return { label: "OK", tone: "ok" };
}

export default async function AdminInventoryPage() {
  const products = await getPrisma().product.findMany({
    include: {
      category: { include: { translations: true } },
      translations: true,
      orderItems: {
        select: {
          quantity: true,
          order: { select: { status: true } },
        },
      },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });

  const rows = products.map((product) => {
    const soldQuantity = product.orderItems
      .filter((item) => item.order.status !== "CANCELLED")
      .reduce((total, item) => total + item.quantity, 0);
    const state = getInventoryState(product);

    return { product, soldQuantity, state };
  });
  const alertCount = rows.filter((row) => row.state.tone !== "ok").length;

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Inventaire</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Suivez les quantites disponibles, vendues, ruptures et anomalies.
        </p>
      </div>

      {alertCount > 0 ? (
        <section className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold">
              {alertCount} alerte(s) inventaire
            </h2>
            <p className="mt-1 text-xs opacity-80">
              Verifiez les produits en stock bas, rupture ou visibles sans stock.
            </p>
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-220 text-left text-xs">
            <thead className="border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="py-2">Produit</th>
                <th className="py-2">Categorie</th>
                <th className="py-2">Disponible</th>
                <th className="py-2">Vendu</th>
                <th className="py-2">Alerte basse</th>
                <th className="py-2">Statut</th>
                <th className="py-2">Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.map(({ product, soldQuantity, state }) => {
                const productText = getLocalizedFields(product, "fr");
                const categoryText = getLocalizedFields(product.category, "fr");
                const toneClass =
                  state.tone === "danger"
                    ? "bg-red-50 text-red-700"
                    : state.tone === "warning"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700";

                return (
                  <tr key={product.id}>
                    <td className="py-2 font-medium text-zinc-950">
                      {productText.name}
                    </td>
                    <td className="py-2 text-zinc-600">{categoryText.name}</td>
                    <td className="py-2 font-semibold text-zinc-950">
                      {formatQty(product.stockQuantity, product.unit)}
                    </td>
                    <td className="py-2 text-zinc-600">
                      {formatQty(soldQuantity, product.unit)}
                    </td>
                    <td className="py-2 text-zinc-600">
                      {formatQty(product.lowStockThreshold, product.unit)}
                    </td>
                    <td className="py-2 text-zinc-600">{product.stockStatus}</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-1 font-semibold ${toneClass}`}>
                        {state.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
