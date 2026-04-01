"use client";

import { useTvShows } from "@/hooks/useTvShows";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";

export default function Home() {
  const { data: tvShows, isLoading, error } = useTvShows();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Séries em Destaque</h1>
          <p className="text-muted-foreground">
            Catálogo completo de TV Shows da GoLedger.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Série
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <p className="text-muted-foreground animate-pulse">Carregando catálogo...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 text-red-500 rounded-md border border-red-500/20">
          Erro ao carregar as séries. Verifique sua conexão e credenciais.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tvShows?.map((show) => (
          <Card key={show["@key"]} className="flex flex-col border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
            <CardHeader>
              <CardTitle className="line-clamp-1">{show.title}</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-500">
                Idade Recomendada: {show.recommendedAge}+
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {show.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button variant="secondary" size="icon" title="Editar série">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" title="Excluir série">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {tvShows?.length === 0 && !isLoading && (
          <p className="text-muted-foreground col-span-full text-center py-10">
            Nenhuma série cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}