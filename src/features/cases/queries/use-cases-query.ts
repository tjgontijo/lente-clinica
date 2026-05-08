import { useQuery } from "@tanstack/react-query";
import { listCasesAction } from "../actions";

export const casesKeys = {
	all: ["cases"] as const,
	list: () => [...casesKeys.all, "list"] as const,
};

export function useCasesQuery() {
	return useQuery({
		queryKey: casesKeys.list(),
		queryFn: () => listCasesAction(),
	});
}
