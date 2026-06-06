import { useInfiniteQuery } from "@tanstack/react-query";
import { listMedicationsAction } from "../actions";

const PAGE_SIZE = 50;

export const medicationsKeys = {
  all: ["medications"] as const,
  search: (search?: string) => [...medicationsKeys.all, { search }] as const,
};

export function useMedicationsQuery(search?: string) {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: medicationsKeys.search(search),
    queryFn: ({ pageParam }) =>
      listMedicationsAction({
        search,
        offset: pageParam,
        limit: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
}
