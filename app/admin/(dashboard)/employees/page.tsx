import { AdminStatus } from "@/app/admin/(dashboard)/admin-status";
import { formatMoney } from "@/app/admin/(dashboard)/format";
import {
  createEmployee,
  softRemoveEmployee,
  updateEmployee,
} from "@/app/admin/finance-actions";
import { getPrisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    employee?: string;
    error?: string;
  }>;
};

function formatDateInput(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

export default async function AdminEmployeesPage({ searchParams }: Props) {
  const [{ employee, error }, employees] = await Promise.all([
    searchParams,
    getPrisma().employee.findMany({
      where: { deletedAt: null },
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Employes</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Gere les salaries, roles, salaires et notes internes.
        </p>
      </div>

      <AdminStatus
        messages={[
          employee === "created" && "Employe ajoute.",
          employee === "updated" && "Employe mis a jour.",
          employee === "removed" && "Employe retire.",
          error && "Impossible de sauvegarder l'employe.",
        ]}
      />

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Ajouter un employe
        </h2>
        <form action={createEmployee} className="mt-3 grid gap-3 md:grid-cols-4">
          <Field name="name" label="Nom" required />
          <Field name="role" label="Role" required />
          <Field name="phone" label="Telephone" />
          <Field name="salary" label="Salaire mensuel (TND)" type="number" min="0" step="0.01" />
          <Field name="startDate" label="Date de debut" type="date" />
          <label className="flex items-center gap-1.5 text-xs text-zinc-700 md:pt-6">
            <input name="isActive" type="checkbox" defaultChecked />
            Actif
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-medium text-zinc-800">Notes</span>
            <input name="notes" className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <button className="h-9 rounded-md bg-zinc-950 px-4 text-xs font-medium text-white transition hover:bg-zinc-800 md:col-span-4">
            Ajouter l&apos;employe
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Liste des employes
        </h2>
        <div className="mt-3 grid gap-2">
          {employees.length === 0 ? (
            <p className="text-xs text-zinc-600">Aucun employe.</p>
          ) : null}
          {employees.map((item) => (
            <details
              key={item.id}
              className="rounded-md border border-zinc-200 bg-zinc-50"
            >
              <summary className="grid cursor-pointer gap-2 px-3 py-2 text-xs text-zinc-700 md:grid-cols-[1fr_140px_130px_80px] md:items-center">
                <span className="font-semibold text-zinc-950">{item.name}</span>
                <span>{item.role}</span>
                <span>{formatMoney(item.salary)}</span>
                <span>{item.isActive ? "Actif" : "Inactif"}</span>
              </summary>
              <form
                action={updateEmployee}
                className="grid gap-3 border-t border-zinc-200 bg-white p-3 md:grid-cols-4"
              >
                <input type="hidden" name="id" value={item.id} />
                <Field name="name" label="Nom" defaultValue={item.name} required />
                <Field name="role" label="Role" defaultValue={item.role} required />
                <Field name="phone" label="Telephone" defaultValue={item.phone ?? ""} />
                <Field name="salary" label="Salaire mensuel (TND)" type="number" min="0" step="0.01" defaultValue={Number(item.salary).toFixed(2)} />
                <Field name="startDate" label="Date de debut" type="date" defaultValue={formatDateInput(item.startDate)} />
                <label className="flex items-center gap-1.5 text-xs text-zinc-700 md:pt-6">
                  <input name="isActive" type="checkbox" defaultChecked={item.isActive} />
                  Actif
                </label>
                <label className="block md:col-span-2">
                  <span className="text-xs font-medium text-zinc-800">Notes</span>
                  <input name="notes" defaultValue={item.notes ?? ""} className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
                </label>
                <div className="flex gap-2 md:col-span-4 md:justify-end">
                  <button className="h-8 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white transition hover:bg-zinc-800">
                    Sauver
                  </button>
                  <button
                    formAction={softRemoveEmployee}
                    className="h-8 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Retirer
                  </button>
                </div>
              </form>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue = "",
  required,
  min,
  step,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-zinc-800">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        step={step}
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
      />
    </label>
  );
}
