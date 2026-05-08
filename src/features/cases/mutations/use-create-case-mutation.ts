import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCaseAction } from "../actions";
import { casesKeys } from "../queries/use-cases-query";

export function useCreateCaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: unknown) => createCaseAction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casesKeys.all });
      toast.success("Caso clínico cadastrado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cadastrar caso clínico: ${error.message}`);
    },
  });
}
