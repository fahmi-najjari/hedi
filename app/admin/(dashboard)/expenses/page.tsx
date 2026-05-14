import { AdminStatus } from "@/app/admin/(dashboard)/admin-status";
import { formatMoney } from "@/app/admin/(dashboard)/format";
import {
  cancelExpense,
  createExpense,
} from "@/app/admin/finance-actions";
import { ExpenseCategory } from "@/generated/prisma/enums";
import { expenseCategoryLabels } from "@/lib/finance";
import { getPrisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    expense?: string;
    error?: string;
  }>;
};

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminExpensesPage({ searchParams }: Props) {
  const [{ expense, error }, employees, expenses] = await Promise.all([
    searchParams,
    getPrisma().employee.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: "asc" },
    }),
    getPrisma().expense.findMany({
      where: { deletedAt: null },
      include: { employee: true },
      orderBy: { expenseDate: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Depenses</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enregistrez les salaires, loyer, aliments, factures et autres couts.
        </p>
      </div>

      <AdminStatus
        messages={[
          expense === "created" && "Depense ajoutee.",
          expense === "cancelled" && "Depense annulee.",
          error && "Impossible de sauvegarder la depense.",
        ]}
      />

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Ajouter une depense
        </h2>
        <form action={createExpense} className="mt-3 grid gap-3 md:grid-cols-4">
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Titre</span>
            <input name="title" required className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Categorie</span>
            <select name="category" className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950">
              {Object.values(ExpenseCategory).map((category) => (
                <option key={category} value={category}>
                  {expenseCategoryLabels[category]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Montant (TND)</span>
            <input name="amount" type="number" min="0.01" step="0.01" required className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Date</span>
            <input name="expenseDate" type="date" defaultValue={todayInput()} className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Employe lie</span>
            <select name="employeeId" className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950">
              <option value="">Aucun</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-3">
            <span className="text-xs font-medium text-zinc-800">Notes</span>
            <input name="notes" className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <button className="h-9 rounded-md bg-zinc-950 px-4 text-xs font-medium text-white transition hover:bg-zinc-800 md:col-span-4">
            Ajouter la depense
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Depenses recentes
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-180 text-left text-xs">
            <thead className="border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Titre</th>
                <th className="py-2">Categorie</th>
                <th className="py-2">Employe</th>
                <th className="py-2">Montant</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {expenses.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 text-zinc-600">
                    {item.expenseDate.toLocaleDateString("fr-FR")}
                  </td>
                  <td className="py-2 font-medium text-zinc-950">{item.title}</td>
                  <td className="py-2 text-zinc-600">
                    {expenseCategoryLabels[item.category]}
                  </td>
                  <td className="py-2 text-zinc-600">
                    {item.employee?.name ?? "-"}
                  </td>
                  <td className="py-2 font-semibold text-zinc-950">
                    {formatMoney(item.amount)}
                  </td>
                  <td className="py-2 text-right">
                    <form action={cancelExpense}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
                        Annuler
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 ? (
                <tr>
                  <td className="py-4 text-zinc-600" colSpan={6}>
                    Aucune depense.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
