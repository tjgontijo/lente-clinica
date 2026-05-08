"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type {
  CreateCaseInput,
  LinkMedicationInput,
} from "./schemas/cases.schema";
import {
  createCaseService,
  linkMedicationService,
  listCasesService,
} from "./services";

async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  return session.user.id;
}

export async function createCaseAction(input: CreateCaseInput) {
  const userId = await getUserId();
  return createCaseService(userId, input);
}

export async function listCasesAction() {
  const userId = await getUserId();
  return listCasesService(userId);
}

export async function linkMedicationAction(input: LinkMedicationInput) {
  const userId = await getUserId();
  return linkMedicationService(userId, input);
}
