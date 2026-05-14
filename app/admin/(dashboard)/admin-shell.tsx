"use client";

import {
  Boxes,
  ClipboardList,
  CreditCard,
  DollarSign,
  Home,
  ListChecks,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Settings,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOutAdmin } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/home", label: "Accueil", icon: Home },
  { href: "/admin/orders", label: "Commandes", icon: ClipboardList },
  { href: "/admin/inventory", label: "Inventaire", icon: ListChecks },
  { href: "/admin/finance", label: "Finance", icon: DollarSign },
  { href: "/admin/expenses", label: "Depenses", icon: CreditCard },
  { href: "/admin/employees", label: "Employes", icon: Users },
  { href: "/admin/settings", label: "Parametres", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function AdminNav({
  onMobile,
  onNavigate,
}: {
  onMobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={onMobile ? "grid gap-1" : "grid gap-1 px-3"}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm transition ${
              active
                ? "bg-zinc-950 font-medium text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string;
  adminEmail: string;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white md:flex md:flex-col">
        <div className="border-b border-zinc-200 px-5 py-4">
          <p className="font-mono text-xs uppercase text-zinc-500">
            Hedi Mchaab Farm
          </p>
          <h1 className="mt-1 text-lg font-semibold">Admin</h1>
        </div>
        <div className="flex-1 py-3">
          <AdminNav />
        </div>
        <div className="border-t border-zinc-200 p-4">
          <p className="truncate text-xs font-medium text-zinc-950">
            {adminName}
          </p>
          <p className="mt-0.5 truncate text-xs text-zinc-500">{adminEmail}</p>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-14 items-center justify-between gap-3 px-4 md:px-6">
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-9 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800"
                aria-expanded={mobileMenuOpen}
                aria-controls="admin-mobile-menu"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
                Menu
              </button>
              {mobileMenuOpen ? (
                <div
                  id="admin-mobile-menu"
                  className="absolute left-0 top-11 z-50 w-64 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg"
                >
                  <AdminNav
                    onMobile
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                </div>
              ) : null}
            </div>

            <div className="hidden md:block">
              <p className="text-xs font-medium text-zinc-500">
                Tableau de bord
              </p>
              <p className="text-sm font-semibold text-zinc-950">
                {adminName}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/fr"
                className="inline-flex h-8 items-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100"
              >
                Voir le site
              </Link>
              <form action={signOutAdmin}>
                <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100">
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Se deconnecter</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6">
          {children}
        </div>
      </div>
    </main>
  );
}
