import { useQuery } from "@tanstack/react-query";
import { listMedicationsAction } from "../actions";

export const medicationsKeys = {
  all: ["medications"] as const,
  search: (search?: string) => [...medicationsKeys.all, { search }] as const,
};

export function useMedicationsQuery(search?: string) {
  return useQuery({
    queryKey: medicationsKeys.search(search),
    queryFn: () => listMedicationsAction(search),
  });
}
