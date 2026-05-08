"use server";

import { getCurrentUserId } from "@/server/auth/get-current-user-id";
import {
  createCaseService,
  getCaseDetailsService,
  linkMedicationService,
  listCasesService,
} from "./services";

export async function createCaseAction(input: unknown) {
  const userId = await getCurrentUserId();
  return createCaseService(userId, input);
}

export async function listCasesAction() {
  const userId = await getCurrentUserId();
  return listCasesService(userId);
}

export async function getCaseDetailsAction(caseId: string) {
  const userId = await getCurrentUserId();
  return getCaseDetailsService(userId, caseId);
}

export async function linkMedicationAction(input: unknown) {
  const userId = await getCurrentUserId();
  return linkMedicationService(userId, input);
}
