"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  createSessionService,
  getActiveAlertsService,
  listSessionsService,
} from "./services";
import type { CreateSessionInput } from "./services/create-session.service";

async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  return session.user.id;
}

export async function createSessionAction(input: CreateSessionInput) {
  const userId = await getUserId();
  return createSessionService(userId, input);
}

export async function listSessionsAction(caseId: string) {
  const userId = await getUserId();
  return listSessionsService(userId, caseId);
}

export async function getActiveAlertsAction(caseId: string) {
  const userId = await getUserId();
  return getActiveAlertsService(userId, caseId);
}
