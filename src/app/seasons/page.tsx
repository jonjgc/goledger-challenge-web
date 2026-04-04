"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSeasons } from "@/hooks/useSeasons";
import { useTvShows } from "@/hooks/useTvShows";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { SeasonDialog } from "@/components/SeasonDialog";
import { deleteSeason, Season } from "@/services/seasons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function SeasonsContent() {
  const { data: seasons, isLoading: isLoadingSeasons } = useSeasons();
  const { data: tvShows } = useTvShows();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [seasonToEdit, setSeasonToEdit] = useState<Season | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteSeason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      toast.success("Temporada excluída com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir a temporada.")
  });

  const handleAddClick = () => {
    setSeasonToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (season: Season) => {
    setSeasonToEdit(season);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (key: string) => {
    if (confirm("Tem certeza que deseja excluir esta temporada?")) {
      deleteMutation.mutate(key);
    }
  };

  const filteredSeasons = seasons?.filter(season => {
    const parentShow = tvShows?.find(show => show["@key"] === season.tvShow["@key"]);
    const showName = parentShow ? parentShow.title.toLowerCase() : "";
    return season.number.toString().includes(searchQuery) || showName.includes(searchQuery);
  }).sort((a, b) => {
    const dataA = (a as any)["@lastUpdated"] ? new Date((a as any)["@lastUpdated"]).getTime() : 0;
    const dataB = (b as any)["@lastUpdated"] ? new Date((b as any)["@lastUpdated"]).getTime() : 0;
    return dataB - dataA;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Temporadas (Seasons)</h1>
          <p className="text-muted-foreground">Gerencie as temporadas das suas séries favoritas.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddClick}>
          <Plus className="w-4 h-4" />
          Adicionar Temporada
        </Button>
      </div>

      {isLoadingSeasons && <p className="text-muted-foreground animate-pulse text-center py-10">Carregando temporadas...</p>}

      {!isLoadingSeasons && filteredSeasons?.length === 0 && (
        <p className="text-center text-muted-foreground py-10">Nenhuma temporada encontrada para "{searchQuery}".</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSeasons?.map((season) => {
          const parentShow = tvShows?.find(show => show["@key"] === season.tvShow["@key"]);
          const showName = parentShow ? parentShow.title : "Série não encontrada";

          return (
            <Card key={season["@key"]} className="flex flex-col border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
              <CardHeader>
                <CardTitle className="line-clamp-1">Temporada {season.number}</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-500 line-clamp-1" title={showName}>
                  {showName}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Ano de lançamento: <span className="font-semibold text-foreground">{season.year}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="secondary" size="icon" onClick={() => handleEditClick(season)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" disabled={deleteMutation.isPending} onClick={() => handleDeleteClick(season["@key"])}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <SeasonDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} seasonToEdit={seasonToEdit} />
    </div>
  );
}

export default function SeasonsPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Carregando...</p>}>
      <SeasonsContent />
    </Suspense>
  );
}