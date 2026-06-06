import "server-only";
import { AsaasClient } from "../lib/asaas.client";
import { getPlan, type PlanCode } from "../lib/plans";
import {
  findSubscriptionByUserId,
  upsertSubscription,
  upsertInvoice,
  updateUserCpfCnpjAndPhone,
} from "../repositories/billing.repository";

export interface BillingCreditCardInput {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CreateCheckoutSessionParams {
  userId: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  planCode: PlanCode;
  paymentMethod: "CREDIT_CARD" | "PIX";
  creditCard?: BillingCreditCardInput;
  remoteIp?: string;
}

interface AsaasCustomerResponse {
  id: string;
}

interface AsaasPaymentResponse {
  id: string;
  status: string;
  value: number;
  netValue?: number;
  description?: string;
  billingType: string;
  dueDate: string;
  paymentDate?: string;
  confirmedDate?: string;
  invoiceUrl?: string;
}

interface AsaasPixQrCodeResponse {
  encodedImage: string | null;
  payload: string;
  expirationDate: string | null;
}

interface AsaasSubscriptionResponse {
  id: string;
  status: string;
}

function todayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function getNextDueDateString(cycle: "MONTHLY" | "YEARLY"): string {
  const date = new Date();
  if (cycle === "MONTHLY") {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString().split("T")[0];
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

async function ensureCustomer(params: {
  userId: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
}): Promise<string> {
  const existingSub = await findSubscriptionByUserId(params.userId);

  if (existingSub?.asaasCustomerId) {
    // Sync CPF/CNPJ and Phone to the profile
    await updateUserCpfCnpjAndPhone(params.userId, params.cpfCnpj, params.phone);
    return existingSub.asaasCustomerId;
  }

  // Create new customer on Asaas
  const customer = await AsaasClient.post<AsaasCustomerResponse>("/customers", {
    name: params.name,
    email: params.email,
    phone: params.phone,
    cpfCnpj: params.cpfCnpj,
    externalReference: params.userId,
  });

  // Save profile info
  await updateUserCpfCnpjAndPhone(params.userId, params.cpfCnpj, params.phone);

  return customer.id;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const plan = getPlan(params.planCode);
  const asaasCustomerId = await ensureCustomer({
    userId: params.userId,
    name: params.name,
    email: params.email,
    phone: params.phone,
    cpfCnpj: params.cpfCnpj,
  });

  if (params.paymentMethod === "PIX") {
    const payment = await AsaasClient.post<AsaasPaymentResponse>("/payments", {
      customer: asaasCustomerId,
      billingType: "PIX",
      value: plan.price,
      dueDate: todayDateString(),
      description: `Lente Clínica - ${plan.name}`,
      externalReference: params.userId,
    });

    const qrCode = await AsaasClient.get<AsaasPixQrCodeResponse>(
      `/payments/${payment.id}/pixQrCode`,
    );

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (plan.cycle === "MONTHLY" ? 1 : 12));

    const subscription = await upsertSubscription(params.userId, {
      asaasCustomerId,
      asaasId: payment.id,
      planCode: params.planCode,
      status: "PENDING",
      paymentMethod: "PIX",
      isActive: false,
      expiresAt: null, // Set to active only after PIX confirms
    });

    const invoice = await upsertInvoice(subscription.id, params.userId, payment.id, {
      status: payment.status,
      paymentMethod: "PIX",
      value: payment.value.toString(),
      netValue: payment.netValue?.toString() ?? null,
      description: payment.description ?? null,
      dueDate: new Date(payment.dueDate),
      paidAt: null,
      pixQrCodePayload: qrCode.payload,
      pixQrCodeImage: qrCode.encodedImage ?? null,
      pixExpirationDate: qrCode.expirationDate ? new Date(qrCode.expirationDate) : null,
    });

    return {
      provider: "asaas" as const,
      subscriptionId: subscription.id,
      invoiceId: invoice.id,
      status: "PENDING" as const,
      paymentMethod: "PIX" as const,
      requiresAction: true,
      pix: {
        qrCodePayload: qrCode.payload,
        qrCodeImage: qrCode.encodedImage ?? null,
        expirationDate: qrCode.expirationDate ?? null,
      },
    };
  }

  // Credit Card subscription checkout
  if (!params.creditCard) {
    throw new Error("Dados do cartão de crédito são obrigatórios.");
  }

  const nextDueDate = getNextDueDateString(plan.cycle);

  const asaasSub = await AsaasClient.post<AsaasSubscriptionResponse>("/subscriptions", {
    customer: asaasCustomerId,
    billingType: "CREDIT_CARD",
    cycle: plan.cycle,
    value: plan.price,
    nextDueDate,
    description: `Lente Clínica - ${plan.name}`,
    externalReference: params.userId,
    remoteIp: params.remoteIp,
    creditCard: {
      holderName: params.creditCard.holderName,
      number: params.creditCard.number,
      expiryMonth: params.creditCard.expiryMonth,
      expiryYear: params.creditCard.expiryYear,
      ccv: params.creditCard.ccv,
    },
    creditCardHolderInfo: {
      name: params.name,
      email: params.email,
      cpfCnpj: params.cpfCnpj,
      phone: params.phone,
    },
  });

  // Fetch the first payment created automatically for this subscription
  const paymentsList = await AsaasClient.get<{ data: AsaasPaymentResponse[] }>(
    `/subscriptions/${asaasSub.id}/payments`,
  );
  const firstPayment = paymentsList.data[0];

  if (!firstPayment) {
    throw new Error("Asaas não retornou o primeiro pagamento da assinatura.");
  }

  const paymentStatus = mapAsaasPaymentStatus(firstPayment.status);
  const isActive = paymentStatus === "ACTIVE";

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + (plan.cycle === "MONTHLY" ? 1 : 12));

  const subscription = await upsertSubscription(params.userId, {
    asaasCustomerId,
    asaasId: asaasSub.id,
    planCode: params.planCode,
    status: paymentStatus,
    paymentMethod: "CREDIT_CARD",
    isActive,
    expiresAt: isActive ? expiresAt : null,
  });

  const invoice = await upsertInvoice(subscription.id, params.userId, firstPayment.id, {
    status: firstPayment.status,
    paymentMethod: "CREDIT_CARD",
    value: firstPayment.value.toString(),
    netValue: firstPayment.netValue?.toString() ?? null,
    description: firstPayment.description ?? null,
    dueDate: new Date(firstPayment.dueDate),
    paidAt: firstPayment.confirmedDate ? new Date(firstPayment.confirmedDate) : null,
    pixQrCodePayload: null,
    pixQrCodeImage: null,
    pixExpirationDate: null,
  });

  return {
    provider: "asaas" as const,
    subscriptionId: subscription.id,
    invoiceId: invoice.id,
    status: paymentStatus,
    paymentMethod: "CREDIT_CARD" as const,
    requiresAction: !isActive,
  };
}
