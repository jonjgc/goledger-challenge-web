"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTvShow, updateTvShow, TvShow } from "@/services/tvShows";
import { toast } from "sonner"; 

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  recommendedAge: z.enum(["L", "10", "12", "14", "16", "18"]),
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
      title: "",
      description: "",
      recommendedAge: "L",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: tvShowToEdit?.title || "",
        description: tvShowToEdit?.description || "",
        recommendedAge: (tvShowToEdit?.recommendedAge?.toString() || "L") as any,
      });
    }
  }, [tvShowToEdit, open, form]);

  useEffect(() => {
    if (open) {
      form.reset({
        title: tvShowToEdit?.title || "",
        description: tvShowToEdit?.description || "",
        recommendedAge: (tvShowToEdit?.recommendedAge?.toString() || "L") as any,
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
      toast.success(isEditing ? "Série atualizada com sucesso!" : "Série criada com sucesso!");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar a série. Tente novamente.");
    }
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
                  <FormLabel>Classificação Indicativa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a classificação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="L">L (Livre)</SelectItem>
                      <SelectItem value="10">10 anos</SelectItem>
                      <SelectItem value="12">12 anos</SelectItem>
                      <SelectItem value="14">14 anos</SelectItem>
                      <SelectItem value="16">16 anos</SelectItem>
                      <SelectItem value="18">18 anos</SelectItem>
                    </SelectContent>
                  </Select>
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