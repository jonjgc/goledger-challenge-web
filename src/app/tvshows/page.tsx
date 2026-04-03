"use client";

import { useState } from "react";
import { useTvShows } from "@/hooks/useTvShows";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { TvShowDialog } from "@/components/TvShowDialog";
import { deleteTvShow, TvShow } from "@/services/tvShows";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {
  const { data: tvShows, isLoading, error } = useTvShows();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showToEdit, setShowToEdit] = useState<TvShow | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteTvShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tvShows"] });
      toast.success("Série excluída com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir a série.");
    }
  });

  const handleAddClick = () => {
    setShowToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (show: TvShow) => {
    setShowToEdit(show);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (key: string) => {
    if (confirm("Tem certeza que deseja excluir esta série?")) {
      deleteMutation.mutate(key);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Séries em Destaque</h1>
          <p className="text-muted-foreground">Catálogo completo de TV Shows da GoLedger.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddClick}>
          <Plus className="w-4 h-4" />
          Adicionar Série
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground animate-pulse text-center py-10">Carregando catálogo...</p>}
      
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
              <p className="text-sm text-muted-foreground line-clamp-3">{show.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button variant="secondary" size="icon" onClick={() => handleEditClick(show)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" disabled={deleteMutation.isPending} onClick={() => handleDeleteClick(show["@key"])}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <TvShowDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        tvShowToEdit={showToEdit} 
      />
    </div>
  );
}