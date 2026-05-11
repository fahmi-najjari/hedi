import { redirect } from "next/navigation";
import { signInAdmin } from "@/app/admin/actions";
import { getCurrentAdmin } from "@/lib/admin-auth";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function ErrorMessage({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  const message =
    error === "config"
      ? "Les identifiants admin ne sont pas configures sur le serveur."
      : error === "missing"
        ? "Email et mot de passe requis."
        : "Identifiants incorrects.";

  return (
    <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}

export default async function AdminSignInPage({ searchParams }: Props) {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <section className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="font-mono text-sm uppercase text-zinc-500">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Connexion admin
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Connectez-vous avec les identifiants admin configures sur le serveur.
        </p>

        <form action={signInAdmin} className="mt-8 space-y-5">
          <ErrorMessage error={error} />

          <label className="block">
            <span className="text-sm font-medium text-zinc-800">Email</span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-800">
              Mot de passe
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none transition focus:border-zinc-950"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="flex h-11 w-full items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800">
            Se connecter
          </button>
        </form>
      </section>
    </main>
  );
}
