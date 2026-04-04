"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEpisodes } from "@/hooks/useEpisodes";
import { useSeasons } from "@/hooks/useSeasons";
import { useTvShows } from "@/hooks/useTvShows";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { EpisodeDialog } from "@/components/EpisodeDialog";
import { deleteEpisode, Episode } from "@/services/episodes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function EpisodesContent() {
  const { data: episodes, isLoading: isLoadingEpisodes } = useEpisodes();
  const { data: seasons } = useSeasons();
  const { data: tvShows } = useTvShows();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [episodeToEdit, setEpisodeToEdit] = useState<Episode | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteEpisode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
      toast.success("Episódio excluído com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir o episódio.")
  });

  const handleAddClick = () => {
    setEpisodeToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (episode: Episode) => {
    setEpisodeToEdit(episode);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (key: string) => {
    if (confirm("Tem certeza que deseja excluir este episódio?")) {
      deleteMutation.mutate(key);
    }
  };

  const filteredEpisodes = episodes?.filter(episode => {
    const parentSeason = seasons?.find(s => s["@key"] === episode.season["@key"]);
    const parentShow = tvShows?.find(ts => ts["@key"] === parentSeason?.tvShow["@key"]);
    const showName = parentShow ? parentShow.title.toLowerCase() : "";

    return episode.title.toLowerCase().includes(searchQuery) ||
           (episode.description && episode.description.toLowerCase().includes(searchQuery)) ||
           showName.includes(searchQuery);
  }).sort((a, b) => {
    const dataA = (a as any)["@lastUpdated"] ? new Date((a as any)["@lastUpdated"]).getTime() : 0;
    const dataB = (b as any)["@lastUpdated"] ? new Date((b as any)["@lastUpdated"]).getTime() : 0;
    return dataB - dataA;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Episódios</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de episódios.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddClick}>
          <Plus className="w-4 h-4" />
          Adicionar Episódio
        </Button>
      </div>

      {isLoadingEpisodes && <p className="text-muted-foreground animate-pulse text-center py-10">Carregando episódios...</p>}
      
      {!isLoadingEpisodes && filteredEpisodes?.length === 0 && (
         <p className="text-center text-muted-foreground py-10">Nenhum episódio encontrado para "{searchQuery}".</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEpisodes?.map((episode) => {
          const parentSeason = seasons?.find(s => s["@key"] === episode.season["@key"]);
          const parentShow = tvShows?.find(ts => ts["@key"] === parentSeason?.tvShow["@key"]);
          const showName = parentShow ? parentShow.title : "Série desconhecida";
          const seasonNumber = parentSeason ? parentSeason.number : "?";

          let formattedDate = "Data inválida";
          try {
            formattedDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(episode.releaseDate));
          } catch (e) { }

          return (
            <Card key={episode["@key"]} className="flex flex-col border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{episode.episodeNumber}. {episode.title}</CardTitle>
                  {episode.rating !== undefined && (
                    <span className="text-xs font-bold bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded">
                      ★ {episode.rating}
                    </span>
                  )}
                </div>
                <CardDescription className="text-primary line-clamp-1" title={`${showName} - T${seasonNumber}`}>
                  {showName} - Temporada {seasonNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground">Estreia: {formattedDate}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {episode.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="secondary" size="icon" onClick={() => handleEditClick(episode)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" disabled={deleteMutation.isPending} onClick={() => handleDeleteClick(episode["@key"])}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <EpisodeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} episodeToEdit={episodeToEdit} />
    </div>
  );
}

export default function EpisodesPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Carregando...</p>}>
      <EpisodesContent />
    </Suspense>
  );
}