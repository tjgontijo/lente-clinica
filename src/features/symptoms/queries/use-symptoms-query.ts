import { useQuery } from "@tanstack/react-query";
import { listCategoriesWithSymptomsAction } from "../actions";

export const symptomsKeys = {
  all: ["symptoms"] as const,
  categories: () => [...symptomsKeys.all, "categories"] as const,
};

export function useSymptomsQuery() {
  return useQuery({
    queryKey: symptomsKeys.categories(),
    queryFn: () => listCategoriesWithSymptomsAction(),
  });
}
