import { signOutAdmin } from "@/app/admin/actions";
import {
  createCategory,
  updateCategory,
  updateFeaturedProducts,
  updateHomeContent,
} from "@/app/admin/content-actions";
import {
  createProduct,
  seedStarterCatalog,
  toggleProductActive,
} from "@/app/admin/product-actions";
import { ProductUnit, StockStatus } from "@/generated/prisma/enums";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { defaultHomeContent } from "@/lib/home-content";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedFields } from "@/lib/translations";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    created?: string;
    seeded?: string;
    error?: string;
    category?: string;
    home?: string;
    featured?: string;
  }>;
};

function formatMoney(value: unknown) {
  return `${Number(value).toFixed(2)} TND`;
}

export default async function AdminPage({ searchParams }: Props) {
  const admin = await requireAdmin();
  const [
    { created, seeded, error, category, home, featured },
    categories,
    activeCategories,
    products,
    orders,
    homeContent,
  ] = await Promise.all([
    searchParams,
    getPrisma().productCategory.findMany({
      include: { translations: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
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
      take: 50,
    }),
    getPrisma().order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    getPrisma().homeContent.findUnique({ where: { id: "home" } }),
  ]);
  const homeValues = homeContent ?? defaultHomeContent;

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div>
            <p className="font-mono text-xs uppercase text-zinc-500">
              Hedi Mchaab Farm
            </p>
            <h1 className="mt-0.5 text-xl font-semibold text-zinc-950">
              Tableau de bord
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/fr"
              className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Voir le site
            </Link>
            <form action={signOutAdmin}>
              <button className="h-8 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100">
                Se deconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-4 md:px-6">
        {created || seeded || error || category || home || featured ? (
          <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700">
            {created ? "Produit ajoute." : null}
            {seeded ? "Catalogue de depart ajoute." : null}
            {category ? "Categorie mise a jour." : null}
            {home ? "Page d'accueil mise a jour." : null}
            {featured ? "Produits mis en avant mis a jour." : null}
            {error
              ? "Impossible d'ajouter le produit. Verifiez les champs."
              : null}
          </div>
        ) : null}

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

          <form
            action={createProduct}
            className="mt-4 grid gap-3 md:grid-cols-4"
          >
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">Nom FR</span>
              <input
                name="nameFr"
                required
                className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">Nom AR</span>
              <input
                name="nameAr"
                dir="rtl"
                className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Categorie
              </span>
              <select
                name="categoryId"
                required
                className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
              >
                <option value="">Choisir</option>
                {activeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getLocalizedFields(category, "fr").name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Prix (TND)
              </span>
              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                required
                className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">Unite</span>
              <select
                name="unit"
                className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
                defaultValue={ProductUnit.PIECE}
              >
                {Object.values(ProductUnit).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">Stock</span>
              <select
                name="stockStatus"
                className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
                defaultValue={StockStatus.AVAILABLE}
              >
                {Object.values(StockStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-medium text-zinc-800">
                Image URL
              </span>
              <input
                name="imageUrl"
                type="url"
                className="mt-1 h-9 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-medium text-zinc-800">
                Description FR
              </span>
              <textarea
                name="descriptionFr"
                required
                rows={2}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-medium text-zinc-800">
                Description AR
              </span>
              <textarea
                name="descriptionAr"
                dir="rtl"
                rows={2}
                className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs text-zinc-700">
                <input name="isOrganic" type="checkbox" />
                Biologique
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-700">
                <input name="isFreeRange" type="checkbox" />
                Plein air
              </label>
              <label className="flex items-center gap-1.5 text-xs text-zinc-700">
                <input name="isActive" type="checkbox" defaultChecked />
                Visible
              </label>
            </div>
            <button className="h-9 rounded-md bg-zinc-950 px-4 text-xs font-medium text-white transition hover:bg-zinc-800 md:col-span-2">
              Ajouter le produit
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">
                Categories
              </h2>
              <p className="mt-0.5 text-xs text-zinc-600">
                Ajoutez, renommez, changez l&apos;image, l&apos;ordre et la
                visibilite.
              </p>
            </div>
            <form action={createCategory} className="grid gap-2 md:grid-cols-5">
              <input
                name="name"
                placeholder="Categorie FR"
                className="h-8 rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
                required
              />
              <input
                name="nameAr"
                dir="rtl"
                placeholder="التصنيف AR"
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
          </div>

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

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold text-zinc-950">
            Page d&apos;accueil
          </h2>
          <form
            action={updateHomeContent}
            className="mt-3 grid gap-3 md:grid-cols-3"
          >
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">Badge</span>
              <input
                name="heroBadge"
                defaultValue={homeValues.heroBadge}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Titre hero
              </span>
              <input
                name="heroTitle"
                defaultValue={homeValues.heroTitle}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Mot en couleur
              </span>
              <input
                name="heroHighlight"
                defaultValue={homeValues.heroHighlight}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-medium text-zinc-800">
                Introduction
              </span>
              <textarea
                name="heroIntro"
                defaultValue={homeValues.heroIntro}
                rows={2}
                className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Image hero URL
              </span>
              <input
                name="heroImageUrl"
                type="url"
                defaultValue={homeValues.heroImageUrl ?? ""}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Titre image
              </span>
              <input
                name="heroVisualTitle"
                defaultValue={homeValues.heroVisualTitle}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-medium text-zinc-800">
                Texte image
              </span>
              <input
                name="heroVisualText"
                defaultValue={homeValues.heroVisualText}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Eyebrow categories
              </span>
              <input
                name="categoriesEyebrow"
                defaultValue={homeValues.categoriesEyebrow}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Titre categories
              </span>
              <input
                name="categoriesTitle"
                defaultValue={homeValues.categoriesTitle}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Intro categories
              </span>
              <input
                name="categoriesIntro"
                defaultValue={homeValues.categoriesIntro}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Eyebrow produits
              </span>
              <input
                name="productsEyebrow"
                defaultValue={homeValues.productsEyebrow}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Titre produits
              </span>
              <input
                name="productsTitle"
                defaultValue={homeValues.productsTitle}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Intro produits
              </span>
              <input
                name="productsIntro"
                defaultValue={homeValues.productsIntro}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                Titre paiement
              </span>
              <input
                name="paymentTitle"
                defaultValue={homeValues.paymentTitle}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-zinc-800">
                CTA paiement
              </span>
              <input
                name="paymentCta"
                defaultValue={homeValues.paymentCta}
                className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <label className="block md:col-span-3">
              <span className="text-xs font-medium text-zinc-800">
                Texte paiement
              </span>
              <textarea
                name="paymentText"
                defaultValue={homeValues.paymentText}
                rows={2}
                className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-2 text-xs outline-none transition focus:border-zinc-950"
              />
            </label>
            <button className="h-9 rounded-md bg-zinc-950 px-4 text-xs font-medium text-white transition hover:bg-zinc-800 md:col-span-3">
              Sauver la page d&apos;accueil
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold text-zinc-950">
            Produits mis en avant
          </h2>
          <form
            action={updateFeaturedProducts}
            className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => {
              const productText = getLocalizedFields(product, "fr");

              return (
                <label
                  key={product.id}
                  className="flex items-center gap-2 rounded-md border border-zinc-100 bg-zinc-50 p-2 text-xs text-zinc-700"
                >
                  <input
                    name="featuredProductIds"
                    type="checkbox"
                    value={product.id}
                    defaultChecked={product.isFeatured}
                  />
                  <span className="truncate">{productText.name}</span>
                </label>
              );
            })}
            <button className="h-9 rounded-md bg-zinc-950 px-4 text-xs font-medium text-white transition hover:bg-zinc-800 sm:col-span-2 lg:col-span-4">
              Sauver la selection
            </button>
          </form>
        </section>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-500">Admin connecte</p>
            <p className="mt-1 text-sm font-semibold text-zinc-950">
              {admin.name || admin.email}
            </p>
            <p className="mt-0.5 truncate text-xs text-zinc-600">
              {admin.email}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-500">Produits</p>
            <p className="mt-1 text-xl font-semibold text-zinc-950">
              {products.length}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-500">Commandes</p>
            <p className="mt-1 text-xl font-semibold text-zinc-950">
              {orders.length}
            </p>
          </div>
        </div>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold text-zinc-950">
            Produits recents
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-190 text-left text-xs">
              <thead className="border-b border-zinc-200 text-zinc-500">
                <tr>
                  <th className="py-2">Produit</th>
                  <th className="py-2">Categorie</th>
                  <th className="py-2">Prix</th>
                  <th className="py-2">Stock</th>
                  <th className="py-2">Visible</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((product) => {
                  const productText = getLocalizedFields(product, "fr");
                  const categoryText = getLocalizedFields(
                    product.category,
                    "fr",
                  );

                  return (
                    <tr key={product.id}>
                      <td className="py-2 font-medium text-zinc-950">
                        {productText.name}
                      </td>
                      <td className="py-2 text-zinc-600">
                        {categoryText.name}
                      </td>
                      <td className="py-2 text-zinc-600">
                        {formatMoney(product.price)} / {product.unit}
                      </td>
                      <td className="py-2 text-zinc-600">
                        {product.stockStatus}
                      </td>
                      <td className="py-2 text-zinc-600">
                        {product.isActive ? "Oui" : "Non"}
                      </td>
                      <td className="py-2 text-right">
                        <form action={toggleProductActive}>
                          <input type="hidden" name="id" value={product.id} />
                          <input
                            type="hidden"
                            name="isActive"
                            value={String(product.isActive)}
                          />
                          <button className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
                            {product.isActive ? "Masquer" : "Afficher"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold text-zinc-950">
            Dernieres commandes
          </h2>
          <div className="mt-3 grid gap-3">
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
                    <h3 className="text-sm font-semibold text-zinc-950">
                      {order.customerName}
                    </h3>
                    <p className="text-xs text-zinc-600">
                      {order.customerPhone} - {order.address}
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-zinc-950">
                    {formatMoney(order.subtotal)}
                  </div>
                </div>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-xs text-zinc-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} x {item.name} (
                      {formatMoney(item.lineTotal)})
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
