import { useQuery } from "@tanstack/react-query";
import { getCaseDetailsAction } from "../actions";
import { casesKeys } from "./use-cases-query";

export const caseDetailsKeys = {
  all: ["case-details"] as const,
  detail: (caseId: string) => [...caseDetailsKeys.all, caseId] as const,
};

export function useCaseDetailsQuery(caseId: string) {
  return useQuery({
    queryKey: caseDetailsKeys.detail(caseId),
    queryFn: () => getCaseDetailsAction(caseId),
    enabled: !!caseId,
  });
}
