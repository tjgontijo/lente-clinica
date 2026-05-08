"use server";

import { getCurrentUserId } from "@/server/auth/get-current-user-id";
import { generateMessageService } from "./services/generate-message.service";

export async function generateCommunicationAction(input: unknown) {
  const userId = await getCurrentUserId();
  return generateMessageService(userId, input);
}
