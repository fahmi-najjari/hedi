import { AdminStatus } from "@/app/admin/(dashboard)/admin-status";
import {
  createCategory,
  updateCategory,
} from "@/app/admin/content-actions";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedFields } from "@/lib/translations";

type Props = {
  searchParams: Promise<{
    category?: string;
    error?: string;
  }>;
};

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const [{ category, error }, categories] = await Promise.all([
    searchParams,
    getPrisma().productCategory.findMany({
      include: { translations: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Categories</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Ajoutez, renommez, changez l&apos;image, l&apos;ordre et la visibilite.
        </p>
      </div>

      <AdminStatus
        messages={[
          category && "Categorie mise a jour.",
          error && "Impossible de sauvegarder la categorie.",
        ]}
      />

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Ajouter une categorie
        </h2>
        <form action={createCategory} className="mt-3 grid gap-2 md:grid-cols-5">
          <input
            name="name"
            placeholder="Categorie FR"
            className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
            required
          />
          <input
            name="nameAr"
            dir="rtl"
            placeholder="Categorie AR"
            className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
          />
          <input
            name="imageUrl"
            type="url"
            placeholder="Image URL"
            className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
          />
          <input
            name="sortOrder"
            type="number"
            placeholder="Ordre"
            className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
          />
          <input name="showOnHome" type="hidden" value="on" />
          <input name="isActive" type="hidden" value="on" />
          <button className="h-8 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white transition hover:bg-zinc-800">
            Ajouter
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Gestion des categories
        </h2>
        <div className="mt-4 grid gap-2">
          {categories.map((item) => {
            const fr = getLocalizedFields(item, "fr");
            const ar = getLocalizedFields(item, "ar");

            return (
              <form
                key={item.id}
                action={updateCategory}
                className="grid gap-2 rounded-md border border-zinc-100 bg-zinc-50 p-2 md:grid-cols-[1fr_1fr_1fr_80px_auto_auto_auto]"
              >
                <input type="hidden" name="id" value={item.id} />
                <input
                  name="nameFr"
                  defaultValue={fr.name}
                  className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
                  required
                />
                <input
                  name="nameAr"
                  dir="rtl"
                  defaultValue={ar.name}
                  className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
                />
                <input
                  name="imageUrl"
                  type="url"
                  defaultValue={item.imageUrl ?? ""}
                  placeholder="Image URL"
                  className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
                />
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={item.sortOrder}
                  className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
                />
                <label className="flex items-center gap-1.5 text-xs text-zinc-700">
                  <input
                    name="showOnHome"
                    type="checkbox"
                    defaultChecked={item.showOnHome}
                  />
                  Accueil
                </label>
                <label className="flex items-center gap-1.5 text-xs text-zinc-700">
                  <input
                    name="isActive"
                    type="checkbox"
                    defaultChecked={item.isActive}
                  />
                  Visible
                </label>
                <button className="h-8 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100">
                  Sauver
                </button>
              </form>
            );
          })}
        </div>
      </section>
    </div>
  );
}
