"use client";

import {
  Languages,
  Menu,
  Search,
  ShoppingBasket,
  Sprout,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  cartUpdatedEvent,
  getCartItemCount,
  readCart,
} from "@/components/cart-store";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const navItems = [
  { key: "home", href: "/" },
  { key: "shop", href: "/shop" },
] as const;

function isActivePath(pathname: string, href: string, locale: string) {
  const localizedHref = href === "/" ? `/${locale}` : `/${locale}${href}`;

  return pathname === localizedHref;
}

function getLocaleSwitchHref(
  pathname: string,
  locale: string,
  searchParams: URLSearchParams,
) {
  const localeRoot = `/${locale}`;
  const unlocalizedPath =
    pathname === localeRoot
      ? "/"
      : pathname.startsWith(`${localeRoot}/`)
        ? pathname.slice(localeRoot.length)
        : pathname;
  const queryString = searchParams.toString();

  return queryString ? `${unlocalizedPath}?${queryString}` : unlocalizedPath;
}

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const nextLocale =
    locale === routing.defaultLocale ? routing.locales[1] : routing.defaultLocale;
  const localeSwitchHref = getLocaleSwitchHref(pathname, locale, searchParams);

  useEffect(() => {
    function updateCartItems() {
      setCartItems(getCartItemCount(readCart()));
    }

    updateCartItems();
    window.addEventListener(cartUpdatedEvent, updateCartItems);
    window.addEventListener("storage", updateCartItems);

    return () => {
      window.removeEventListener(cartUpdatedEvent, updateCartItems);
      window.removeEventListener("storage", updateCartItems);
    };
  }, []);

  return (
    <header className="site-navbar sticky top-0 z-50 w-full backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="site-navbar-logo grid h-11 w-11 place-items-center rounded-lg text-primary-foreground transition-transform group-hover:-rotate-3">
              <Sprout className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="font-serif text-xl font-bold leading-5 tracking-normal text-primary">
                {t("brand")}
              </span>
              <span className="hidden text-xs font-semibold text-accent sm:inline">
                {t("tagline")}
              </span>
            </span>
          </Link>

          <nav className="site-navbar-tabs hidden items-center rounded-full p-1 text-sm font-medium md:flex">
            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href, locale);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-[0_8px_18px_-14px_hsl(var(--accent)/0.9)]"
                      : "text-accent hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </div>

        <form
          action={`/${locale}/shop`}
          className="site-navbar-search hidden h-11 flex-1 items-center gap-2 rounded-full px-4 lg:flex"
        >
          <Search className="h-4 w-4 text-primary" aria-hidden="true" />
          <input
            name="q"
            type="search"
            placeholder={t("searchPlaceholder")}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </form>

        <nav className="ms-auto flex items-center gap-2">
          <Link
            href={localeSwitchHref}
            locale={nextLocale}
            className="site-navbar-language hidden h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary md:inline-flex"
          >
            <Languages className="h-4 w-4 text-primary" aria-hidden="true" />
            {t("language")}
          </Link>

          <Link
            href="/cart"
            className="hover-elevate relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_12px_24px_-16px_hsl(var(--primary)/0.95)] transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={t("cart")}
          >
            <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t("cart")}</span>
            {cartItems > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartItems}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="site-navbar-menu-button inline-flex h-10 w-10 items-center justify-center rounded-full text-secondary-foreground transition-colors hover:bg-secondary md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>

      {mobileMenuOpen ? (
        <div className="site-navbar-mobile-wrap px-4 pb-5 md:hidden">
          <div className="site-navbar-mobile-panel mx-auto flex max-w-6xl flex-col gap-3 rounded-xl p-3">
            <form
              action={`/${locale}/shop`}
              className="site-navbar-search flex h-11 items-center gap-2 rounded-full px-4"
            >
              <Search className="h-4 w-4 text-primary" aria-hidden="true" />
              <input
                name="q"
                type="search"
                placeholder={t("searchPlaceholder")}
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </form>

            <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = isActivePath(pathname, item.href, locale);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm ${
                    isActive
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <div className="my-1 h-px bg-border" />
            <Link
              href={localeSwitchHref}
              locale={nextLocale}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              <Languages className="h-4 w-4 text-primary" aria-hidden="true" />
              {t("language")}
            </Link>
          </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
