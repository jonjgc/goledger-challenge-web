"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTvShow, updateTvShow, TvShow } from "@/services/tvShows";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  recommendedAge: z.any().transform((val) => Number(val)).refine((val) => val >= 0, {
    message: "A idade não pode ser negativa",
  }),
});

type FormValues = z.input<typeof formSchema>;

interface TvShowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tvShowToEdit?: TvShow | null;
}

export function TvShowDialog({ open, onOpenChange, tvShowToEdit }: TvShowDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!tvShowToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: tvShowToEdit?.title || "",
      description: tvShowToEdit?.description || "",
      recommendedAge: tvShowToEdit?.recommendedAge || 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: tvShowToEdit?.title || "",
        description: tvShowToEdit?.description || "",
        recommendedAge: tvShowToEdit?.recommendedAge || 0,
      });
    }
  }, [tvShowToEdit, open, form]);

  form.watch();
  
  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return updateTvShow({ ...tvShowToEdit, ...data } as TvShow);
      }
      return createTvShow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tvShows"] });
      onOpenChange(false);
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Série" : "Adicionar Nova Série"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl><Input placeholder="Ex: Breaking Bad" disabled={isEditing} {...field} /></FormControl>
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
                  <FormControl><Textarea placeholder="Sinopse da série..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recommendedAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade Recomendada</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar Série"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}