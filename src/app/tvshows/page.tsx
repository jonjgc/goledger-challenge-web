"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTvShows } from "@/hooks/useTvShows";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { TvShowDialog } from "@/components/TvShowDialog";
import { deleteTvShow, TvShow } from "@/services/tvShows";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PaginationControls } from "@/components/PaginationControls";

const ITEMS_PER_PAGE = 20;

function TvShowsContent() {
  const { data: tvShows, isLoading } = useTvShows();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tvShowToEdit, setTvShowToEdit] = useState<TvShow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const deleteMutation = useMutation({
    mutationFn: deleteTvShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tvShows"] });
      toast.success("Série excluída com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir a série. Ela pode ter temporadas vinculadas.")
  });

  const handleAddClick = () => {
    setTvShowToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (tvShow: TvShow) => {
    setTvShowToEdit(tvShow);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (key: string) => {
    if (confirm("Tem certeza que deseja excluir esta série?")) {
      deleteMutation.mutate(key);
    }
  };

  const filteredShows = tvShows?.filter(show =>
    show.title.toLowerCase().includes(searchQuery) ||
    (show.description && show.description.toLowerCase().includes(searchQuery))
  ).sort((a, b) => {
    const dataA = (a as any)["@lastUpdated"] ? new Date((a as any)["@lastUpdated"]).getTime() : 0;
    const dataB = (b as any)["@lastUpdated"] ? new Date((b as any)["@lastUpdated"]).getTime() : 0;
    return dataB - dataA;
  });

  const totalPages = Math.ceil((filteredShows?.length || 0) / ITEMS_PER_PAGE);
  const paginatedShows = filteredShows?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

      {isLoading && <p className="text-muted-foreground animate-pulse text-center py-10">Carregando séries...</p>}

      {!isLoading && filteredShows?.length === 0 && (
        <p className="text-center text-muted-foreground py-10">Nenhuma série encontrada para "{searchQuery}".</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedShows?.map((tvShow) => (
          <Card key={tvShow["@key"]} className="flex flex-col border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-colors">
            <CardHeader>
              <CardTitle className="line-clamp-1" title={tvShow.title}>{tvShow.title}</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-500 font-medium">
                Classificação: {tvShow.recommendedAge === "L" ? "Livre" : `${tvShow.recommendedAge} anos`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3" title={tvShow.description}>
                {tvShow.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button variant="secondary" size="icon" onClick={() => handleEditClick(tvShow)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" disabled={deleteMutation.isPending} onClick={() => handleDeleteClick(tvShow["@key"])}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <TvShowDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tvShowToEdit={tvShowToEdit}
      />
    </div>
  );
}

export default function TvShowsPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Carregando...</p>}>
      <TvShowsContent />
    </Suspense>
  );
}