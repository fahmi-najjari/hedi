import { AdminStatus } from "@/app/admin/(dashboard)/admin-status";
import { formatMoney } from "@/app/admin/(dashboard)/format";
import {
  createProduct,
  seedStarterCatalog,
  toggleProductActive,
  updateProduct,
} from "@/app/admin/product-actions";
import { ProductUnit, StockStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedFields } from "@/lib/translations";

type Props = {
  searchParams: Promise<{
    created?: string;
    seeded?: string;
    error?: string;
    product?: string;
  }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const [{ created, seeded, error, product }, activeCategories, products] =
    await Promise.all([
      searchParams,
      getPrisma().productCategory.findMany({
        where: { isActive: true },
        include: { translations: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      getPrisma().product.findMany({
        include: {
          category: { include: { translations: true } },
          translations: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: 100,
      }),
    ]);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Produits</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Ajoutez et modifiez les produits de la boutique.
        </p>
      </div>

      <AdminStatus
        messages={[
          created && "Produit ajoute.",
          seeded && "Catalogue de depart ajoute.",
          product && "Produit mis a jour.",
          error && "Impossible de sauvegarder le produit. Verifiez les champs.",
        ]}
      />

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Ajouter un produit
            </h2>
            <p className="mt-0.5 text-xs text-zinc-600">
              Ces produits apparaissent directement dans la boutique.
            </p>
          </div>
          <form action={seedStarterCatalog}>
            <button className="h-8 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100">
              Ajouter le catalogue de depart
            </button>
          </form>
        </div>

        <form action={createProduct} className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Nom FR</span>
            <input name="nameFr" required className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Nom AR</span>
            <input name="nameAr" dir="rtl" className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Categorie</span>
            <select name="categoryId" required className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950">
              <option value="">Choisir</option>
              {activeCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getLocalizedFields(category, "fr").name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Prix (TND)</span>
            <input name="price" type="number" min="0.01" step="0.01" required className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Unite</span>
            <select name="unit" defaultValue={ProductUnit.PIECE} className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950">
              {Object.values(ProductUnit).map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-zinc-800">Stock</span>
            <select name="stockStatus" defaultValue={StockStatus.AVAILABLE} className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950">
              {Object.values(StockStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-medium text-zinc-800">Image URL</span>
            <input name="imageUrl" type="url" className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-medium text-zinc-800">Description FR</span>
            <textarea name="descriptionFr" required rows={2} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-medium text-zinc-800">Description AR</span>
            <textarea name="descriptionAr" dir="rtl" rows={2} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950" />
          </label>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <label className="flex items-center gap-1.5 text-xs text-zinc-700"><input name="isOrganic" type="checkbox" /> Biologique</label>
            <label className="flex items-center gap-1.5 text-xs text-zinc-700"><input name="isFreeRange" type="checkbox" /> Plein air</label>
            <label className="flex items-center gap-1.5 text-xs text-zinc-700"><input name="isActive" type="checkbox" defaultChecked /> Visible</label>
          </div>
          <button className="h-9 rounded-md bg-zinc-950 px-4 text-xs font-medium text-white transition hover:bg-zinc-800 md:col-span-2">
            Ajouter le produit
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Gestion des produits
        </h2>
        <div className="mt-3 grid gap-2">
          {products.map((item) => {
            const productFr = getLocalizedFields(item, "fr");
            const productAr = getLocalizedFields(item, "ar");
            const categoryText = getLocalizedFields(item.category, "fr");

            return (
              <details key={item.id} className="rounded-md border border-zinc-200 bg-zinc-50">
                <summary className="grid cursor-pointer gap-2 px-3 py-2 text-xs text-zinc-700 md:grid-cols-[minmax(0,1fr)_150px_110px_100px] md:items-center">
                  <span className="truncate font-semibold text-zinc-950">{productFr.name}</span>
                  <span className="truncate">{categoryText.name}</span>
                  <span>{formatMoney(item.price)} / {item.unit}</span>
                  <span>{item.isActive ? "Visible" : "Masque"}</span>
                </summary>

                <form action={updateProduct} className="grid gap-3 border-t border-zinc-200 bg-white p-3 md:grid-cols-4">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="currentIsActive" value={String(item.isActive)} />
                  <label className="block"><span className="text-xs font-medium text-zinc-800">Nom FR</span><input name="nameFr" defaultValue={productFr.name} required className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950" /></label>
                  <label className="block"><span className="text-xs font-medium text-zinc-800">Nom AR</span><input name="nameAr" dir="rtl" defaultValue={productAr.name} className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950" /></label>
                  <label className="block">
                    <span className="text-xs font-medium text-zinc-800">Categorie</span>
                    <select name="categoryId" defaultValue={item.categoryId} className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950">
                      {activeCategories.map((category) => (
                        <option key={category.id} value={category.id}>{getLocalizedFields(category, "fr").name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block"><span className="text-xs font-medium text-zinc-800">Prix (TND)</span><input name="price" type="number" min="0.01" step="0.01" defaultValue={Number(item.price).toFixed(2)} required className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950" /></label>
                  <label className="block"><span className="text-xs font-medium text-zinc-800">Unite</span><select name="unit" defaultValue={item.unit} className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950">{Object.values(ProductUnit).map((unit) => (<option key={unit} value={unit}>{unit}</option>))}</select></label>
                  <label className="block"><span className="text-xs font-medium text-zinc-800">Stock</span><select name="stockStatus" defaultValue={item.stockStatus} className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950">{Object.values(StockStatus).map((status) => (<option key={status} value={status}>{status}</option>))}</select></label>
                  <label className="block md:col-span-2"><span className="text-xs font-medium text-zinc-800">Image URL</span><input name="imageUrl" type="url" defaultValue={item.imageUrl ?? ""} className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950" /></label>
                  <label className="block md:col-span-2"><span className="text-xs font-medium text-zinc-800">Description FR</span><textarea name="descriptionFr" defaultValue={productFr.description} required rows={2} className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-2 text-xs outline-none transition focus:border-zinc-950" /></label>
                  <label className="block md:col-span-2"><span className="text-xs font-medium text-zinc-800">Description AR</span><textarea name="descriptionAr" dir="rtl" defaultValue={productAr.description} rows={2} className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-2 text-xs outline-none transition focus:border-zinc-950" /></label>
                  <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                    <label className="flex items-center gap-1.5 text-xs text-zinc-700"><input name="isOrganic" type="checkbox" defaultChecked={item.isOrganic} /> Biologique</label>
                    <label className="flex items-center gap-1.5 text-xs text-zinc-700"><input name="isFreeRange" type="checkbox" defaultChecked={item.isFreeRange} /> Plein air</label>
                    <label className="flex items-center gap-1.5 text-xs text-zinc-700"><input name="isActive" type="checkbox" defaultChecked={item.isActive} /> Visible</label>
                  </div>
                  <div className="flex gap-2 md:col-span-2 md:justify-end">
                    <button className="h-8 rounded-md bg-zinc-950 px-3 text-xs font-medium text-white transition hover:bg-zinc-800">Sauver le produit</button>
                    <button formAction={toggleProductActive} className="h-8 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100">{item.isActive ? "Masquer" : "Afficher"}</button>
                  </div>
                </form>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
