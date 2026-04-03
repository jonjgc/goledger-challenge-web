"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEpisode, updateEpisode, Episode } from "@/services/episodes";
import { useTvShows } from "@/hooks/useTvShows";
import { useSeasons } from "@/hooks/useSeasons";
import { toast } from "sonner";

const formSchema = z.object({
  tvShowKey: z.string().min(1, "Selecione uma série"),
  seasonKey: z.string().min(1, "Selecione uma temporada"),
  episodeNumber: z.any().transform(Number).refine(val => val > 0, "Número inválido"),
  title: z.string().min(1, "Título obrigatório"),
  releaseDate: z.string().min(1, "Data obrigatória"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  rating: z.any().transform(Number).optional(),
});

type FormValues = z.input<typeof formSchema>;

interface EpisodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  episodeToEdit?: Episode | null;
}

export function EpisodeDialog({ open, onOpenChange, episodeToEdit }: EpisodeDialogProps) {
  const queryClient = useQueryClient();
  const { data: tvShows } = useTvShows();
  const { data: seasons } = useSeasons();
  const isEditing = !!episodeToEdit;
  const [filteredSeasons, setFilteredSeasons] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tvShowKey: "",
      seasonKey: "",
      episodeNumber: 1,
      title: "",
      releaseDate: "",
      description: "",
      rating: 0,
    },
  });

  const selectedTvShowKey = form.watch("tvShowKey");

  useEffect(() => {
    if (open) {
      const seasonKeyParts = episodeToEdit?.season?.["@key"]?.split(":") || [];
      const parentShowKey = seasonKeyParts.length > 0 ? `tvShows:${seasonKeyParts[1]}` : "";

      let formattedDate = "";
      if (episodeToEdit?.releaseDate) {
        try {
          const d = new Date(episodeToEdit.releaseDate);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');

          formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (e) {
          formattedDate = "";
        }
      }

      form.reset({
        tvShowKey: parentShowKey,
        seasonKey: episodeToEdit?.season?.["@key"] || "",
        episodeNumber: episodeToEdit?.episodeNumber || 1,
        title: episodeToEdit?.title || "",
        releaseDate: formattedDate,
        description: episodeToEdit?.description || "",
        rating: episodeToEdit?.rating || 0,
      });
    }
  }, [episodeToEdit, open, form]);

  useEffect(() => {
    if (selectedTvShowKey && seasons) {
      const filtered = seasons.filter(s => s.tvShow["@key"] === selectedTvShowKey);
      setFilteredSeasons(filtered);
    } else {
      setFilteredSeasons([]);
    }
  }, [selectedTvShowKey, seasons]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const utcDate = new Date(data.releaseDate).toISOString();

      const payload = {
        season: {
          "@assetType": "seasons" as const,
          "@key": data.seasonKey
        },
        episodeNumber: data.episodeNumber,
        title: data.title,
        releaseDate: utcDate,
        description: data.description,
        ...(data.rating && { rating: data.rating })
      };

      if (isEditing) {
        return updateEpisode({ ...episodeToEdit, ...payload } as Episode);
      }
      return createEpisode(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
      onOpenChange(false);
      toast.success(isEditing ? "Episódio atualizado com sucesso!" : "Episódio criado com sucesso!");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar o episódio. Tente novamente.");
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Episódio" : "Adicionar Episódio"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tvShowKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Série (TV Show)</FormLabel>
                    <Select disabled={isEditing} onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("seasonKey", "");
                    }} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tvShows?.map((show) => (
                          <SelectItem key={show["@key"]} value={show["@key"]}>{show.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seasonKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporada</FormLabel>
                    <Select disabled={isEditing || !selectedTvShowKey} onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredSeasons.map((season) => (
                          <SelectItem key={season["@key"]} value={season["@key"]}>
                            Temporada {season.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="episodeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl><Input type="number" disabled={isEditing} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avaliação (0-10)</FormLabel>
                    <FormControl><Input type="number" step="0.1" max="10" min="0" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Episódio</FormLabel>
                  <FormControl><Input placeholder="Ex: Pilot" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Lançamento</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl><Textarea placeholder="Sinopse..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar Episódio"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}