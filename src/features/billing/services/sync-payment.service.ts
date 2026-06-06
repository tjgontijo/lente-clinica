import "server-only";
import {
  findInvoiceByAsaasId,
  updateInvoiceStatusFromWebhook,
  findSubscriptionByUserId,
  updateSubscriptionStatusFromWebhook,
} from "../repositories/billing.repository";
import { getPlan } from "../lib/plans";

interface AsaasPaymentPayload {
  id: string;
  status: string;
  value: number;
  netValue?: number;
  confirmedDate?: string;
  paymentDate?: string;
  invoiceUrl?: string;
}

function mapAsaasPaymentStatus(status: string): "ACTIVE" | "PENDING" | "OVERDUE" | "CANCELED" {
  switch (status) {
    case "RECEIVED":
    case "CONFIRMED":
    case "RECEIVED_IN_CASH":
      return "ACTIVE";
    case "OVERDUE":
      return "OVERDUE";
    case "CANCELED":
    case "REFUNDED":
      return "CANCELED";
    default:
      return "PENDING";
  }
}

export async function syncPaymentFromWebhook(payment: AsaasPaymentPayload) {
  const invoice = await findInvoiceByAsaasId(payment.id);

  if (!invoice) {
    console.warn(`[Sync Payment] Invoice not found for Asaas Payment ID: ${payment.id}`);
    return;
  }

  const nextStatus = mapAsaasPaymentStatus(payment.status);
  const paidAtString = payment.paymentDate || payment.confirmedDate || null;
  const paidAt = paidAtString ? new Date(paidAtString) : null;

  // Update invoice
  await updateInvoiceStatusFromWebhook(invoice.id, {
    status: payment.status,
    paidAt,
    netValue: payment.netValue?.toString() ?? null,
    invoiceUrl: payment.invoiceUrl ?? null,
  });

  console.info(`[Sync Payment] Updated Invoice ${invoice.id} to status ${payment.status}`);

  if (invoice.subscriptionId) {
    const subscription = await findSubscriptionByUserId(invoice.userId);

    if (subscription && subscription.id === invoice.subscriptionId) {
      const isPaymentActive = nextStatus === "ACTIVE";

      let expiresAt: Date | null = null;
      if (isPaymentActive) {
        const plan = getPlan(subscription.planCode);
        const now = paidAt ?? new Date();
        expiresAt = new Date(now);
        expiresAt.setMonth(expiresAt.getMonth() + (plan.cycle === "MONTHLY" ? 1 : 12));
      }

      await updateSubscriptionStatusFromWebhook(subscription.id, {
        status: nextStatus,
        isActive: isPaymentActive,
        expiresAt,
      });

      console.info(
        `[Sync Payment] Updated Subscription ${subscription.id} to status ${nextStatus} (Active: ${isPaymentActive})`,
      );
    }
  }
}
