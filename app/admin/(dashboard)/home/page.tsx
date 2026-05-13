import { AdminStatus } from "@/app/admin/(dashboard)/admin-status";
import {
  updateFeaturedProducts,
  updateHomeContent,
} from "@/app/admin/content-actions";
import { defaultHomeContent } from "@/lib/home-content";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedFields } from "@/lib/translations";

type Props = {
  searchParams: Promise<{
    home?: string;
    featured?: string;
  }>;
};

export default async function AdminHomePage({ searchParams }: Props) {
  const [{ home, featured }, homeContent, products] = await Promise.all([
    searchParams,
    getPrisma().homeContent.findUnique({ where: { id: "home" } }),
    getPrisma().product.findMany({
      include: { translations: true },
      orderBy: [{ createdAt: "desc" }],
      take: 100,
    }),
  ]);
  const homeValues = homeContent ?? defaultHomeContent;

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">
          Page d&apos;accueil
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Modifiez le hero, les textes et les produits mis en avant.
        </p>
      </div>

      <AdminStatus
        messages={[
          home && "Page d'accueil mise a jour.",
          featured && "Produits mis en avant mis a jour.",
        ]}
      />

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">Contenu</h2>
        <form
          action={updateHomeContent}
          className="mt-3 grid gap-3 md:grid-cols-3"
        >
          <Field name="heroBadge" label="Badge" value={homeValues.heroBadge} />
          <Field name="heroTitle" label="Titre hero" value={homeValues.heroTitle} />
          <Field
            name="heroHighlight"
            label="Mot en couleur"
            value={homeValues.heroHighlight}
          />
          <Textarea
            name="heroIntro"
            label="Introduction"
            value={homeValues.heroIntro}
            className="md:col-span-2"
          />
          <Field
            name="heroImageUrl"
            label="Image hero URL"
            value={homeValues.heroImageUrl ?? ""}
            type="url"
          />
          <Field
            name="heroVisualTitle"
            label="Titre image"
            value={homeValues.heroVisualTitle}
          />
          <Field
            name="heroVisualText"
            label="Texte image"
            value={homeValues.heroVisualText}
            className="md:col-span-2"
          />
          <Field
            name="categoriesEyebrow"
            label="Eyebrow categories"
            value={homeValues.categoriesEyebrow}
          />
          <Field
            name="categoriesTitle"
            label="Titre categories"
            value={homeValues.categoriesTitle}
          />
          <Field
            name="categoriesIntro"
            label="Intro categories"
            value={homeValues.categoriesIntro}
          />
          <Field
            name="productsEyebrow"
            label="Eyebrow produits"
            value={homeValues.productsEyebrow}
          />
          <Field
            name="productsTitle"
            label="Titre produits"
            value={homeValues.productsTitle}
          />
          <Field
            name="productsIntro"
            label="Intro produits"
            value={homeValues.productsIntro}
          />
          <Field
            name="paymentTitle"
            label="Titre paiement"
            value={homeValues.paymentTitle}
          />
          <Field
            name="paymentCta"
            label="CTA paiement"
            value={homeValues.paymentCta}
          />
          <Textarea
            name="paymentText"
            label="Texte paiement"
            value={homeValues.paymentText}
            className="md:col-span-3"
          />
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
    </div>
  );
}

function Field({
  name,
  label,
  value,
  type = "text",
  className = "",
}: {
  name: string;
  label: string;
  value: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-zinc-800">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={value}
        className="mt-1 h-8 w-full rounded-md border border-zinc-300 px-2 text-xs outline-none transition focus:border-zinc-950"
      />
    </label>
  );
}

function Textarea({
  name,
  label,
  value,
  className = "",
}: {
  name: string;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-zinc-800">{label}</span>
      <textarea
        name={name}
        defaultValue={value}
        rows={2}
        className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-2 text-xs outline-none transition focus:border-zinc-950"
      />
    </label>
  );
}
