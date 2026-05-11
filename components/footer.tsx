import { Mail, MapPin, Phone, ShieldCheck, Sprout } from "lucide-react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const shopLinks = [
  { key: "whole", href: "/shop?category=whole" },
  { key: "cuts", href: "/shop?category=cuts" },
  { key: "eggs", href: "/shop?category=eggs" },
  { key: "chicks", href: "/shop?category=chicks" },
  { key: "feed", href: "/shop?category=feed" },
] as const;

const infoLinks = [
  { key: "home", href: "/" },
  { key: "shop", href: "/shop" },
  { key: "cart", href: "/cart" },
] as const;

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="site-navbar-logo grid h-11 w-11 place-items-center rounded-lg text-primary-foreground transition-transform group-hover:-rotate-3">
                <Sprout className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="font-serif text-xl font-bold leading-5 tracking-normal text-primary">
                  {t("brand")}
                </span>
                <span className="text-xs font-semibold text-accent">
                  {t("tagline")}
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold">{t("shop.title")}</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {shopLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {t(`shop.links.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold">{t("info.title")}</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {infoLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {t(`info.links.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold">
              {t("contact.title")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t("contact.address")}</span>
              </li>
              <li>
                <a
                  href="tel:+213000000000"
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t("contact.phone")}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@hedimchaabfarm.com"
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t("contact.email")}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year })}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/shop" className="transition-colors hover:text-primary">
              {t("bottom.order")}
            </Link>
            <Link href="/cart" className="transition-colors hover:text-primary">
              {t("bottom.cart")}
            </Link>
            <NextLink
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground shadow-[0_12px_24px_-16px_hsl(var(--primary)/0.95)] transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {t("bottom.admin")}
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
