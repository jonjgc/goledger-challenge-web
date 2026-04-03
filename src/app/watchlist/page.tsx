"use client";

import { useState } from "react";
import { useWatchlists } from "@/hooks/useWatchlists";
import { useTvShows } from "@/hooks/useTvShows";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Film } from "lucide-react";
import { WatchlistDialog } from "@/components/WatchlistDialog";
import { deleteWatchlist, Watchlist } from "@/services/watchlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function WatchlistPage() {
  const { data: watchlists, isLoading } = useWatchlists();
  const { data: tvShows } = useTvShows();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<Watchlist | null>(null);

   const deleteMutation = useMutation({
      mutationFn: deleteWatchlist,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tvShows"] });
        toast.success("Série excluída da lista de desejos!");
      },
      onError: () => {
        toast.error("Erro ao excluir a série.");
      }
    });

  const handleAddClick = () => {
    setListToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (list: Watchlist) => {
    setListToEdit(list);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (key: string) => {
    if (confirm("Tem certeza que deseja excluir esta Watchlist?")) {
      deleteMutation.mutate(key);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minha Watchlist</h1>
          <p className="text-muted-foreground">Suas listas de séries para assistir.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddClick}>
          <Plus className="w-4 h-4" />
          Criar Lista
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground animate-pulse text-center py-10">Carregando listas...</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlists?.map((list) => {
          return (
            <Card key={list["@key"]} className="flex flex-col border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
              <CardHeader>
                <CardTitle className="line-clamp-1">{list.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {list.description || "Sem descrição"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Séries na lista ({list.tvShows?.length || 0})
                  </p>
                  <ul className="space-y-1">
                    {list.tvShows?.map((showRef) => {
                      const showDetails = tvShows?.find(t => t["@key"] === showRef["@key"]);
                      return (
                        <li key={showRef["@key"]} className="text-sm flex items-center gap-2 text-foreground/80">
                          <Film className="w-3 h-3 text-yellow-500" />
                          {showDetails ? showDetails.title : "Série desconhecida"}
                        </li>
                      );
                    })}
                    {(!list.tvShows || list.tvShows.length === 0) && (
                      <p className="text-sm text-muted-foreground italic">Nenhuma série adicionada.</p>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="secondary" size="icon" onClick={() => handleEditClick(list)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" disabled={deleteMutation.isPending} onClick={() => handleDeleteClick(list["@key"])}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <WatchlistDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        watchlistToEdit={listToEdit} 
      />
    </div>
  );
}