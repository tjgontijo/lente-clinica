import "server-only";
import { db } from "@/server/db/db";
import { billingSubscription, billingInvoice, user } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function findSubscriptionByUserId(userId: string) {
  return db.query.billingSubscription.findFirst({
    where: eq(billingSubscription.userId, userId),
  });
}

export async function findSubscriptionWithLatestInvoice(userId: string) {
  return db.query.billingSubscription.findFirst({
    where: eq(billingSubscription.userId, userId),
    with: {
      invoices: {
        orderBy: [desc(billingInvoice.createdAt)],
        limit: 1,
      },
    },
  });
}

export async function findInvoiceByAsaasId(asaasId: string) {
  return db.query.billingInvoice.findFirst({
    where: eq(billingInvoice.asaasId, asaasId),
  });
}

export async function updateUserCpfCnpjAndPhone(
  userId: string,
  cpfCnpj: string,
  phone: string,
) {
  await db
    .update(user)
    .set({ cpfCnpj, phone, updatedAt: new Date() })
    .where(eq(user.id, userId));
}

export async function upsertSubscription(
  userId: string,
  data: Omit<typeof billingSubscription.$inferInsert, "id" | "userId" | "createdAt" | "updatedAt"> & {
    asaasCustomerId?: string | null;
  },
) {
  const existing = await findSubscriptionByUserId(userId);
  const now = new Date();

  if (existing) {
    const [updated] = await db
      .update(billingSubscription)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(billingSubscription.userId, userId))
      .returning();
    return updated;
  } else {
    const [inserted] = await db
      .insert(billingSubscription)
      .values({
        userId,
        ...data,
        createdAt: now,
        updatedAt: now,
      } as any)
      .returning();
    return inserted;
  }
}

export async function upsertInvoice(
  subscriptionId: string,
  userId: string,
  asaasId: string,
  data: Omit<typeof billingInvoice.$inferInsert, "id" | "subscriptionId" | "userId" | "asaasId" | "createdAt" | "updatedAt">,
) {
  const existing = await findInvoiceByAsaasId(asaasId);
  const now = new Date();

  if (existing) {
    const [updated] = await db
      .update(billingInvoice)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(billingInvoice.asaasId, asaasId))
      .returning();
    return updated;
  } else {
    const [inserted] = await db
      .insert(billingInvoice)
      .values({
        subscriptionId,
        userId,
        asaasId,
        ...data,
        createdAt: now,
        updatedAt: now,
      } as any)
      .returning();
    return inserted;
  }
}

export async function updateSubscriptionStatusFromWebhook(
  subscriptionId: string,
  data: {
    status: string;
    isActive: boolean;
    expiresAt?: Date | null;
  },
) {
  await db
    .update(billingSubscription)
    .set({
      status: data.status,
      isActive: data.isActive,
      expiresAt: data.expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(billingSubscription.id, subscriptionId));
}

export async function updateInvoiceStatusFromWebhook(
  invoiceId: string,
  data: {
    status: string;
    paidAt?: Date | null;
    netValue?: string | null;
    invoiceUrl?: string | null;
  },
) {
  await db
    .update(billingInvoice)
    .set({
      status: data.status,
      paidAt: data.paidAt,
      netValue: data.netValue,
      invoiceUrl: data.invoiceUrl,
      updatedAt: new Date(),
    })
    .where(eq(billingInvoice.id, invoiceId));
}
