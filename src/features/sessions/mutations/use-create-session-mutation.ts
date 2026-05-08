import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { caseDetailsKeys } from "@/features/cases/queries/use-case-details-query";
import { createSessionAction } from "../actions";

export function useCreateSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: unknown) => createSessionAction(input),
    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: caseDetailsKeys.detail(variables.caseId),
      });
      toast.success("Sessão clínica salva com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar sessão: ${error.message}`);
    },
  });
}
