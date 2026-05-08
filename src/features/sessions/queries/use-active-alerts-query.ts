import { useQuery } from "@tanstack/react-query";
import { calculateRealTimeAlertsAction } from "../actions";

export const sessionKeys = {
  all: ["sessions"] as const,
  alerts: (caseId: string, symptomIds: string[]) =>
    [...sessionKeys.all, "alerts", caseId, { symptomIds }] as const,
};

export function useActiveAlertsQuery(caseId: string, symptomIds: string[]) {
  return useQuery({
    queryKey: sessionKeys.alerts(caseId, symptomIds),
    queryFn: () => calculateRealTimeAlertsAction(caseId, symptomIds),
    enabled: !!caseId && symptomIds.length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}
