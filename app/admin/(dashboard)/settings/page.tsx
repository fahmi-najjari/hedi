export default function AdminSettingsPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Parametres</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Les parametres avances seront ajoutes ici.
        </p>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold text-zinc-950">
          Prochaines sections
        </h2>
        <div className="mt-3 grid gap-2 text-sm text-zinc-600">
          <p>Employes</p>
          <p>Loyer</p>
          <p>Factures</p>
          <p>Couts</p>
          <p>Rapports</p>
        </div>
      </section>
    </div>
  );
}
