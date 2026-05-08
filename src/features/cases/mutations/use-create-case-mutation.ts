import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCaseAction } from "../actions";
import { casesKeys } from "../queries/use-cases-query";
import { toast } from "sonner";

export function useCreateCaseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: unknown) => createCaseAction(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: casesKeys.all });
			toast.success("Paciente cadastrado com sucesso!");
		},
		onError: (error: Error) => {
			toast.error(`Erro ao cadastrar paciente: ${error.message}`);
		},
	});
}
