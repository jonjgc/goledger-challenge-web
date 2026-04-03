"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSeason, updateSeason, Season } from "@/services/seasons";
import { useTvShows } from "@/hooks/useTvShows";
import { toast } from "sonner";

const formSchema = z.object({
  number: z.any().transform(Number).refine(val => val > 0, "O número deve ser maior que 0"),
  year: z.any().transform(Number).refine(val => val > 1900, "Ano inválido"),
  tvShowKey: z.string().min(1, "Selecione uma série"),
});

type FormValues = z.input<typeof formSchema>;

interface SeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seasonToEdit?: Season | null;
}

export function SeasonDialog({ open, onOpenChange, seasonToEdit }: SeasonDialogProps) {
  const queryClient = useQueryClient();
  const { data: tvShows } = useTvShows();
  const isEditing = !!seasonToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 1,
      year: new Date().getFullYear(),
      tvShowKey: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        number: seasonToEdit?.number || 1,
        year: seasonToEdit?.year || new Date().getFullYear(),
        tvShowKey: seasonToEdit?.tvShow?.["@key"] || "",
      });
    }
  }, [seasonToEdit, open, form]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const payload = {
        number: data.number,
        year: data.year,
        tvShow: {
          "@assetType": "tvShows" as const,
          "@key": data.tvShowKey
        }
      };

      if (isEditing) {
        return updateSeason({ ...seasonToEdit, ...payload } as Season);
      }
      return createSeason(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      onOpenChange(false);
      toast.success(isEditing ? "Temporada atualizada!" : "Temporada criada!");
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar a temporada. Tente novamente.");
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Temporada" : "Adicionar Temporada"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="tvShowKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Série (TV Show)</FormLabel>
                  <Select disabled={isEditing} onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a qual série pertence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tvShows?.map((show) => (
                        <SelectItem key={show["@key"]} value={show["@key"]}>
                          {show.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Número da Temporada</FormLabel>
                    <FormControl><Input type="number" disabled={isEditing} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ano de Lançamento</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar Temporada"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}