import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const t = useTranslations("HomePage");
  const nextLocale =
    locale === routing.defaultLocale ? routing.locales[1] : routing.defaultLocale;

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-background px-6 py-24 text-foreground">
      <section className="w-full max-w-2xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-wide text-foreground/60">
          {locale}
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-foreground/70">
          {t("intro")}
        </p>
        <Link
          className="mt-10 inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:opacity-85"
          href="/"
          locale={nextLocale}
        >
          {t("switchLocale")}
        </Link>
      </section>
    </main>
  );
}
