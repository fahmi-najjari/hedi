import { use } from "react";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { StockStatus } from "@/generated/prisma/enums";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PriceWithUnit } from "@/components/money";
import { Link } from "@/i18n/navigation";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedFields } from "@/lib/translations";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

function getSelectedFilter(category?: string) {
  return category || "all";
}

function formatUnit(unit: string) {
  const units: Record<string, string> = {
    PIECE: "piece",
    KG: "kg",
    TRAY: "plateau",
    BAG: "sac",
  };

  return units[unit] ?? unit.toLowerCase().replace("_", " ");
}

export default function ShopPage({ params, searchParams }: Props) {
  const { locale } = use(params);
  const { category } = use(searchParams);
  setRequestLocale(locale);
  const t = useTranslations("ShopPage");
  const selectedFilter = getSelectedFilter(category);
  const [categories, products] = use(
    Promise.all([
      getPrisma().productCategory.findMany({
        where: { isActive: true },
        include: { translations: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      getPrisma().product.findMany({
        where: {
          isActive: true,
          ...(selectedFilter === "organic" ? { isOrganic: true } : {}),
          ...(!["all", "organic"].includes(selectedFilter)
            ? { category: { slug: selectedFilter } }
            : {}),
        },
        include: { category: { include: { translations: true } }, translations: true },
        orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      }),
    ]),
  );

  return (
    <main className="min-h-screen flex-1 bg-background px-4 py-10 text-foreground md:px-6">
      <section className="mx-auto w-full max-w-7xl">
        <p className="font-mono text-xs uppercase text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-normal">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("intro")}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          <Link
            href="/shop"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              selectedFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            }`}
          >
            {t("filters.all")}
          </Link>
          <Link
            href="/shop?category=organic"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              selectedFilter === "organic"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            }`}
          >
            {t("filters.organic")}
          </Link>
          {categories.map((item) => {
            const categoryText = getLocalizedFields(item, locale);

            return (
            <Link
              key={item.id}
              href={`/shop?category=${item.slug}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedFilter === item.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              {categoryText.name}
            </Link>
            );
          })}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => {
            const productText = getLocalizedFields(product, locale);
            const categoryText = getLocalizedFields(product.category, locale);

            return (
            <article
              key={product.id}
              className="overflow-hidden rounded-lg bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-5/3 overflow-hidden bg-muted">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={productText.name}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary/30 px-3 text-center text-xs font-semibold text-muted-foreground">
                    {productText.name}
                  </div>
                )}
                <div className="absolute right-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap justify-end gap-1">
                  <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-zinc-900 shadow-sm backdrop-blur">
                    {categoryText.name}
                  </span>
                  {product.isOrganic ? (
                    <span className="rounded-full bg-emerald-700/95 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur">
                      {t("filters.organic")}
                    </span>
                  ) : null}
                  {product.isFreeRange ? (
                    <span className="rounded-full bg-emerald-700/95 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm backdrop-blur">
                      Plein air
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="p-3">
                <h2 className="font-serif text-base font-bold leading-snug">
                  {productText.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {productText.description}
                </p>
                <p className="mt-2 text-sm font-bold text-foreground">
                  <PriceWithUnit
                    value={Number(product.price)}
                    unit={formatUnit(product.unit)}
                  />
                </p>
                <AddToCartButton
                  label={
                    product.stockStatus === StockStatus.OUT_OF_STOCK
                      ? "Rupture"
                      : "Ajouter"
                  }
                  addedLabel={
                    locale === "ar"
                      ? "تمت الإضافة إلى السلة"
                      : locale === "fr"
                        ? "Ajoute au panier"
                        : "Added to cart"
                  }
                  disabled={product.stockStatus === StockStatus.OUT_OF_STOCK}
                  tone={product.isOrganic ? "organic" : "default"}
                  product={{
                    id: product.id,
                    name: productText.name,
                    price: Number(product.price),
                    unit: product.unit,
                    imageUrl: product.imageUrl,
                  }}
                />
              </div>
            </article>
            );
          })}
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-lg border border-card-border bg-card p-8 text-card-foreground">
            <h2 className="font-serif text-2xl font-bold">No products yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add products from the admin dashboard, or seed the starter catalog.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
