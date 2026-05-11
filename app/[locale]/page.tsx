import { use } from "react";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { catalogImages } from "@/lib/catalog";
import { defaultHomeContent } from "@/lib/home-content";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedFields } from "@/lib/translations";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

const features = [
  { key: "fresh", Icon: Leaf },
  { key: "quality", Icon: ShieldCheck },
  { key: "delivery", Icon: Truck },
] as const;

export default function Home({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("HomePage");
  const [homeContent, homeCategories, featuredProducts] = use(
    Promise.all([
      getPrisma().homeContent.findUnique({ where: { id: "home" } }),
      getPrisma().productCategory.findMany({
        where: {
          isActive: true,
          showOnHome: true,
        },
        include: { translations: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        take: 8,
      }),
      getPrisma().product.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        include: { category: { include: { translations: true } }, translations: true },
        orderBy: [{ featuredSortOrder: "asc" }, { name: "asc" }],
        take: 8,
      }),
    ]),
  );
  const content = homeContent ?? defaultHomeContent;

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--secondary)/0.5),transparent_28rem),radial-gradient(circle_at_80%_15%,hsl(var(--accent)/0.28),transparent_24rem)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-7 px-4 py-9 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {content.heroBadge}
            </div>
            <h1 className="mt-3 max-w-2xl font-serif text-2xl font-bold leading-tight tracking-normal text-foreground md:text-3xl lg:text-4xl">
              {content.heroTitle}{" "}
              <span className="text-primary">{content.heroHighlight}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {content.heroIntro}
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-[0_14px_26px_-18px_hsl(var(--primary)/0.95)] transition hover:bg-accent hover:text-accent-foreground"
              >
                {t("hero.shop")}
                <ArrowRight
                  className="h-3.5 w-3.5 rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
              <a
                href="tel:+213000000000"
                className="inline-flex h-9 items-center justify-center rounded-full bg-secondary px-4 text-xs font-semibold text-secondary-foreground transition hover:opacity-90"
              >
                {t("hero.call")}
              </a>
            </div>
          </div>

          <div className="relative aspect-5/3 overflow-hidden rounded-xl bg-card shadow-xl">
            <Image
              src={content.heroImageUrl || catalogImages.chickenPieces}
              alt={content.heroVisualTitle}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="font-serif text-xl font-bold">
                {content.heroVisualTitle}
              </p>
              <p className="mt-1 text-xs font-medium text-white/85">
                {content.heroVisualText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-8">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 md:grid-cols-3 md:px-6">
          {features.map(({ key, Icon }) => (
            <div key={key} className="flex gap-3 rounded-lg bg-background p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t(`features.${key}.text`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase text-primary">
            {content.categoriesEyebrow}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold tracking-normal">
            {content.categoriesTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {content.categoriesIntro}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {homeCategories.map((category) => {
            const categoryText = getLocalizedFields(category, locale);

            return (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group overflow-hidden rounded-lg bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-5/4 overflow-hidden">
                <Image
                  src={category.imageUrl || catalogImages.chicken}
                  alt={categoryText.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 to-black/5" />
              </div>
              <div className="p-3">
                <h3 className="font-serif text-base font-bold leading-snug">
                  {categoryText.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {categoryText.description || content.categoriesIntro}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/15 py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase text-primary">
                {content.productsEyebrow}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold tracking-normal">
                {content.productsTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {content.productsIntro}
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-accent-foreground transition hover:bg-primary"
            >
              {t("products.viewAll")}
              <ArrowRight
                className="h-3.5 w-3.5 rtl:rotate-180"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const productText = getLocalizedFields(product, locale);
              const categoryText = getLocalizedFields(product.category, locale);

              return (
              <article
                key={product.id}
                className="rounded-lg bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-5/4 overflow-hidden rounded-md bg-muted">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={productText.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary/30 px-3 text-center text-xs font-semibold text-muted-foreground">
                      {productText.name}
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {categoryText.name}
                  </span>
                  <h3 className="mt-2 font-serif text-base font-bold leading-snug">
                    {productText.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {productText.description}
                  </p>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <div className="rounded-xl bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--primary)))] p-5 text-primary-foreground md:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                {content.paymentTitle}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-foreground/85">
                {content.paymentText}
              </p>
            </div>
            <Link
              href="/cart"
              className="inline-flex h-9 items-center justify-center rounded-full bg-secondary px-4 text-xs font-semibold text-secondary-foreground transition hover:opacity-90"
            >
              {content.paymentCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
