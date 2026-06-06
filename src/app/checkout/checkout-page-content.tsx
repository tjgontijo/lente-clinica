"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Loader2, Lock, ShieldCheck, QrCode } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLANS, type PlanCode } from "@/features/billing/lib/plans";

interface CheckoutPageContentProps {
  cpfCnpj: string;
  phone: string;
  userEmail: string;
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export function CheckoutPageContent({
  cpfCnpj: initialCpfCnpj,
  phone: initialPhone,
  userEmail,
}: CheckoutPageContentProps) {
  const router = useRouter();
  const [selectedPlanCode, setSelectedPlanCode] = React.useState<PlanCode>("professional_monthly");
  const [paymentMethod, setPaymentMethod] = React.useState<"CREDIT_CARD" | "PIX">("CREDIT_CARD");

  // Form Fields
  const [cpfCnpj, setCpfCnpj] = React.useState(formatCpfCnpj(initialCpfCnpj));
  const [phone, setPhone] = React.useState(formatPhone(initialPhone));

  // Credit Card Fields
  const [holderName, setHolderName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [ccv, setCcv] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedPlan = PLANS.find((p) => p.code === selectedPlanCode)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanCpfCnpj = cpfCnpj.replace(/\D/g, "");
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanCpfCnpj.length < 11 || cleanCpfCnpj.length > 14) {
      toast.error("CPF ou CNPJ inválido.");
      return;
    }

    if (cleanPhone.length < 10) {
      toast.error("Telefone celular inválido.");
      return;
    }

    let creditCardData = undefined;

    if (paymentMethod === "CREDIT_CARD") {
      const cleanCardNumber = cardNumber.replace(/\s/g, "");
      const cleanExpiry = expiry.replace(/\D/g, "");

      if (!holderName.trim()) {
        toast.error("Informe o nome do titular do cartão.");
        return;
      }
      if (cleanCardNumber.length < 13 || cleanCardNumber.length > 16) {
        toast.error("Número de cartão inválido.");
        return;
      }
      if (cleanExpiry.length !== 4) {
        toast.error("Data de validade inválida (MM/AA).");
        return;
      }
      if (ccv.length < 3 || ccv.length > 4) {
        toast.error("Código CVV inválido.");
        return;
      }

      creditCardData = {
        holderName: holderName.trim(),
        number: cleanCardNumber,
        expiryMonth: cleanExpiry.slice(0, 2),
        expiryYear: "20" + cleanExpiry.slice(2, 4), // prepend 20 to expiry year
        ccv,
      };
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planCode: selectedPlanCode,
          paymentMethod,
          cpfCnpj: cleanCpfCnpj,
          phone: cleanPhone,
          creditCard: creditCardData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Erro ao processar o checkout. Verifique os dados.");
        return;
      }

      if (paymentMethod === "CREDIT_CARD") {
        toast.success("Assinatura realizada com sucesso!");
        router.push(`/billing/success?method=card&plan=${selectedPlanCode}`);
      } else {
        // PIX redirect with payment payload info
        const pixPayload = data.pix.qrCodePayload;
        const pixImage = data.pix.qrCodeImage;
        const pixExpiry = data.pix.expirationDate;

        router.push(
          `/billing/success?method=pix&plan=${selectedPlanCode}&payload=${encodeURIComponent(
            pixPayload,
          )}&image=${encodeURIComponent(pixImage || "")}&expiry=${encodeURIComponent(
            pixExpiry || "",
          )}`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Falha ao se conectar com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/medications" className="flex items-center">
            <img
              src="/images/system/logo_horizontal.png"
              alt="Lente Clínica"
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Ambiente Seguro</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="container mx-auto max-w-5xl px-6 pt-10">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Conclua sua Assinatura
          </h1>
          <p className="mt-2 text-slate-600">
            Adquira o acesso ilimitado para acompanhar e rastrear tratamentos de pacientes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Plan Selector (Left - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Selecione o Plano
            </h2>

            <div className="space-y-4">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanCode === plan.code;
                const isYearly = plan.cycle === "YEARLY";

                return (
                  <button
                    key={plan.code}
                    type="button"
                    onClick={() => setSelectedPlanCode(plan.code)}
                    className={`w-full rounded-3xl border p-5 text-left transition-all ${
                      isSelected
                        ? "border-[var(--lc-teal-600)] bg-[var(--lc-teal-50)]/40 ring-1 ring-[var(--lc-teal-600)] shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{plan.name}</span>
                          {isYearly && (
                            <span className="rounded-full bg-emerald-500 px-2 py-0.5 font-bold text-white text-[10px] uppercase tracking-wider">
                              Economize
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{plan.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl font-black text-slate-900">
                          R$ {plan.price}
                        </span>
                        <span className="text-xs text-slate-500">
                          /{isYearly ? "ano" : "mês"}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pricing details / secure badge */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-3 text-slate-600 text-xs">
                <Lock className="h-4 w-4 text-[var(--lc-teal-600)] shrink-0" />
                <p>
                  Sua transação é processada com segurança pelo gateway de pagamentos{" "}
                  <strong>Asaas</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Form (Right - 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
            {/* Tabs */}
            <div className="flex rounded-full bg-slate-100 p-1 mb-8">
              <button
                type="button"
                onClick={() => setPaymentMethod("CREDIT_CARD")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
                  paymentMethod === "CREDIT_CARD"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("PIX")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
                  paymentMethod === "PIX"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <QrCode className="h-4 w-4" />
                PIX
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Info Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Dados do Assinante
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      CPF ou CNPJ
                    </label>
                    <Input
                      placeholder="000.000.000-00"
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                      disabled={isSubmitting}
                      required
                      inputMode="numeric"
                      className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-[var(--lc-teal-600)] focus-visible:ring-[var(--lc-teal-600)]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Celular / WhatsApp
                    </label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      disabled={isSubmitting}
                      required
                      inputMode="tel"
                      className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-[var(--lc-teal-600)] focus-visible:ring-[var(--lc-teal-600)]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Credit Card Specific Form */}
              {paymentMethod === "CREDIT_CARD" && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Dados do Cartão de Crédito
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Nome impresso no cartão
                      </label>
                      <Input
                        placeholder="NOME COMPLETO"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                        disabled={isSubmitting}
                        required
                        autoComplete="cc-name"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-[var(--lc-teal-600)] focus-visible:ring-[var(--lc-teal-600)]/10"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Número do cartão
                      </label>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        disabled={isSubmitting}
                        required
                        inputMode="numeric"
                        autoComplete="cc-number"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-[var(--lc-teal-600)] focus-visible:ring-[var(--lc-teal-600)]/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Validade
                        </label>
                        <Input
                          placeholder="MM/AA"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          disabled={isSubmitting}
                          required
                          maxLength={5}
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-[var(--lc-teal-600)] focus-visible:ring-[var(--lc-teal-600)]/10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                          Código CVV
                        </label>
                        <Input
                          placeholder="000"
                          value={ccv}
                          onChange={(e) => setCcv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          disabled={isSubmitting}
                          required
                          maxLength={4}
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:border-[var(--lc-teal-600)] focus-visible:ring-[var(--lc-teal-600)]/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PIX Specific Text */}
              {paymentMethod === "PIX" && (
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-600 space-y-2">
                  <p>
                    ⚡ <strong>Pagamento Instantâneo:</strong>
                  </p>
                  <p>
                    Ao clicar no botão de finalizar, geraremos um QR Code e um código
                    Pix Copia e Cola para pagamento imediato.
                  </p>
                  <p className="text-xs text-slate-500">
                    O acesso à plataforma será liberado assim que o pagamento for
                    confirmado (geralmente em menos de 1 minuto).
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full bg-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-700)] text-white text-base font-bold shadow-lg shadow-emerald-700/10 active:scale-[0.98] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : paymentMethod === "CREDIT_CARD" ? (
                    `Assinar Plano · R$ ${selectedPlan.price}/${
                      selectedPlan.cycle === "YEARLY" ? "ano" : "mês"
                    }`
                  ) : (
                    `Gerar PIX · R$ ${selectedPlan.price}`
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
