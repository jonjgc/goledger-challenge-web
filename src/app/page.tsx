export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Séries em Destaque</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao catálogo da GoLedger. Explore as melhores séries, temporadas e episódios.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <p className="text-sm text-muted-foreground">Carregando catálogo...</p>
      </div>
    </div>
  );
}