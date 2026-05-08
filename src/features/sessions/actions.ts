"use server";

import { getCurrentUserId } from "@/server/auth/get-current-user-id";
import {
  createSessionService,
  getActiveAlertsService,
  listSessionsService,
} from "./services";

export async function createSessionAction(input: unknown) {
  const userId = await getCurrentUserId();
  return createSessionService(userId, input);
}

export async function listSessionsAction(caseId: string) {
  const userId = await getCurrentUserId();
  return listSessionsService(userId, caseId);
}

export async function getActiveAlertsAction(caseId: string) {
  const userId = await getCurrentUserId();
  return getActiveAlertsService(userId, caseId);
}
