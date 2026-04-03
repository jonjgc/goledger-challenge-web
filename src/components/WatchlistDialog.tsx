"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWatchlist, updateWatchlist, Watchlist } from "@/services/watchlist";
import { useTvShows } from "@/hooks/useTvShows";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  tvShowsKeys: z.array(z.string()).default([]),
});

type FormValues = z.input<typeof formSchema>;

interface WatchlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchlistToEdit?: Watchlist | null;
}

export function WatchlistDialog({ open, onOpenChange, watchlistToEdit }: WatchlistDialogProps) {
  const queryClient = useQueryClient();
  const { data: tvShows } = useTvShows();
  const isEditing = !!watchlistToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tvShowsKeys: [],
    },
  });

  useEffect(() => {
    if (open) {
      const selectedKeys = watchlistToEdit?.tvShows?.map(show => show["@key"]) || [];

      form.reset({
        title: watchlistToEdit?.title || "",
        description: watchlistToEdit?.description || "",
        tvShowsKeys: selectedKeys,
      });
    }
  }, [watchlistToEdit, open, form]);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = {
        title: data.title,
        description: data.description || "",
        tvShows: (data.tvShowsKeys || []).map(key => ({
          "@assetType": "tvShows" as const,
          "@key": key
        }))
      };

      if (isEditing) {
        return updateWatchlist({ ...watchlistToEdit, ...payload } as Watchlist);
      }
      return createWatchlist(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      onOpenChange(false);
      toast.success(isEditing ? "Lista atualizada com sucesso!" : "Lista criada com sucesso!");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar a lista. Tente novamente.");
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Watchlist" : "Criar Watchlist"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Lista</FormLabel>
                  <FormControl><Input placeholder="Ex: Para maratonar no fds" disabled={isEditing} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl><Textarea placeholder="Sobre o que é essa lista?" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 border rounded-md p-4 bg-muted/20">
              <div className="mb-4">
                <FormLabel className="text-base">Séries (TV Shows)</FormLabel>
                <FormDescription>Selecione as séries para adicionar à lista.</FormDescription>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {tvShows?.map((show) => (
                  <FormField
                    key={show["@key"]}
                    control={form.control}
                    name="tvShowsKeys"
                    render={({ field }) => {
                      const currentValue = field.value || [];

                      return (
                        <FormItem key={show["@key"]} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentValue.includes(show["@key"])}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...currentValue, show["@key"]])
                                  : field.onChange(currentValue.filter((value) => value !== show["@key"]))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm cursor-pointer">
                            {show.title}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar Watchlist"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
