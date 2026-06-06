import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/features/billing/services/billing-checkout.service";

const creditCardSchema = z.object({
  holderName: z.string().trim().min(3, "Nome no cartão inválido"),
  number: z.string().trim().min(13, "Número do cartão inválido"),
  expiryMonth: z.string().trim().min(2, "Mês inválido").max(2, "Mês inválido"),
  expiryYear: z.string().trim().min(2, "Ano inválido").max(4, "Ano inválido"),
  ccv: z.string().trim().min(3, "CVV inválido").max(4, "CVV inválido"),
});

const checkoutRequestSchema = z
  .object({
    planCode: z.enum(["professional_monthly", "professional_yearly"]),
    paymentMethod: z.enum(["CREDIT_CARD", "PIX"]),
    cpfCnpj: z.string().trim().min(11).max(18),
    phone: z.string().trim().min(10).max(15),
    creditCard: creditCardSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "CREDIT_CARD" && !data.creditCard) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["creditCard"],
        message: "Dados do cartão são obrigatórios",
      });
    }
  });

export async function POST(request: NextRequest) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = checkoutRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Dados inválidos.", errors: result.error.format() },
        { status: 400 },
      );
    }

    const { planCode, paymentMethod, cpfCnpj, phone, creditCard } = result.data;
    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");
    const cleanPhone = phone.replace(/\D/g, "");

    const cleanCreditCard = creditCard
      ? {
          holderName: creditCard.holderName,
          number: creditCard.number.replace(/\s/g, ""),
          expiryMonth: creditCard.expiryMonth,
          expiryYear: creditCard.expiryYear,
          ccv: creditCard.ccv,
        }
      : undefined;

    const remoteIp =
      reqHeaders.get("x-forwarded-for")?.split(",")[0] ||
      reqHeaders.get("x-real-ip") ||
      undefined;

    const checkoutResult = await createCheckoutSession({
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: cleanPhone,
      cpfCnpj: cleanCpfCnpj,
      planCode,
      paymentMethod,
      creditCard: cleanCreditCard,
      remoteIp,
    });

    return NextResponse.json(checkoutResult, { status: 200 });
  } catch (error) {
    console.error("[Checkout Route Error]:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao processar o checkout.",
      },
      { status: 500 },
    );
  }
}
