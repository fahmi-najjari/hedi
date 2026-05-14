import Link from "next/link";
import { formatMoney } from "@/app/admin/(dashboard)/format";
import { expenseCategoryLabels, getCurrentMonthRange } from "@/lib/finance";
import { getPrisma } from "@/lib/prisma";

export default async function AdminFinancePage() {
  const { start, end } = getCurrentMonthRange();
  const prisma = getPrisma();
  const [revenue, expenses, expenseGroups, recentExpenses] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: start, lt: end },
        status: { not: "CANCELLED" },
      },
      _sum: { subtotal: true },
    }),
    prisma.expense.aggregate({
      where: {
        deletedAt: null,
        expenseDate: { gte: start, lt: end },
      },
      _sum: { amount: true },
    }),
    prisma.expense.groupBy({
      by: ["category"],
      where: {
        deletedAt: null,
        expenseDate: { gte: start, lt: end },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    }),
    prisma.expense.findMany({
      where: { deletedAt: null },
      include: { employee: true },
      orderBy: { expenseDate: "desc" },
      take: 8,
    }),
  ]);

  const revenueTotal = Number(revenue._sum.subtotal ?? 0);
  const expenseTotal = Number(expenses._sum.amount ?? 0);
  const netTotal = revenueTotal - expenseTotal;
  const isPositive = netTotal >= 0;

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Finance</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Suivi du resultat mensuel, des depenses et du solde.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Revenus du mois" value={formatMoney(revenueTotal)} />
        <MetricCard label="Depenses du mois" value={formatMoney(expenseTotal)} />
        <MetricCard
          label="Resultat net"
          value={`${isPositive ? "+" : ""}${formatMoney(netTotal)}`}
          tone={isPositive ? "positive" : "negative"}
        />
      </div>

      <section
        className={`rounded-lg border p-4 ${
          isPositive
            ? "border-emerald-200 bg-emerald-50 text-emerald-950"
            : "border-red-200 bg-red-50 text-red-950"
        }`}
      >
        <h2 className="text-base font-semibold">
          {isPositive ? "La ferme est en positif ce mois-ci." : "La ferme est en rouge ce mois-ci."}
        </h2>
        <p className="mt-1 text-sm opacity-80">
          Revenus - depenses = {`${isPositive ? "+" : ""}${formatMoney(netTotal)}`}.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-zinc-950">
              Depenses par categorie
            </h2>
            <Link
              href="/admin/expenses"
              className="text-xs font-medium text-zinc-600 hover:text-zinc-950"
            >
              Ajouter
            </Link>
          </div>
          <div className="mt-3 grid gap-2">
            {expenseGroups.length === 0 ? (
              <p className="text-xs text-zinc-600">Aucune depense ce mois.</p>
            ) : null}
            {expenseGroups.map((group) => (
              <div
                key={group.category}
                className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2 text-xs"
              >
                <span className="font-medium text-zinc-700">
                  {expenseCategoryLabels[group.category]}
                </span>
                <span className="font-semibold text-zinc-950">
                  {formatMoney(group._sum.amount ?? 0)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold text-zinc-950">
            Dernieres depenses
          </h2>
          <div className="mt-3 grid gap-2">
            {recentExpenses.length === 0 ? (
              <p className="text-xs text-zinc-600">Aucune depense.</p>
            ) : null}
            {recentExpenses.map((item) => (
              <div
                key={item.id}
                className="grid gap-1 rounded-md bg-zinc-50 px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-zinc-950">
                    {item.title}
                  </span>
                  <span className="font-semibold text-zinc-950">
                    {formatMoney(item.amount)}
                  </span>
                </div>
                <p className="text-zinc-600">
                  {expenseCategoryLabels[item.category]} -{" "}
                  {item.expenseDate.toLocaleDateString("fr-FR")}
                  {item.employee ? ` - ${item.employee.name}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}) {
  const valueClass =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-zinc-950";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
