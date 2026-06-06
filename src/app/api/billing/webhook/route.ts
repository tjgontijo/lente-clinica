import { type NextRequest, NextResponse } from "next/server";
import { syncPaymentFromWebhook } from "@/features/billing/services/sync-payment.service";

export async function POST(request: NextRequest) {
  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
  const authToken = request.headers.get("asaas-access-token");

  // Validate authorization token if configured in .env
  if (webhookToken && authToken !== webhookToken) {
    console.warn("[Asaas Webhook] Unauthorized access attempt.");
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const eventName = payload.event;

    console.info(`[Asaas Webhook] Received event: ${eventName}`);

    switch (eventName) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_OVERDUE":
      case "PAYMENT_DELETED":
      case "PAYMENT_REFUNDED":
        if (payload.payment?.id) {
          await syncPaymentFromWebhook(payload.payment);
        }
        break;

      default:
        console.info(`[Asaas Webhook] Ignored unhandled event: ${eventName}`);
        break;
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[Asaas Webhook Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno." },
      { status: 500 },
    );
  }
}
