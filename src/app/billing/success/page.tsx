"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Copy, ArrowRight, Loader2, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const method = searchParams.get("method");
  const plan = searchParams.get("plan");
  const payload = searchParams.get("payload");
  const image = searchParams.get("image");
  const expiry = searchParams.get("expiry");

  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopied(true);
    toast.success("Código Pix copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  }

  // Format expiration date if available
  const formattedExpiry = React.useMemo(() => {
    if (!expiry) return null;
    try {
      const date = new Date(expiry);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  }, [expiry]);

  const isPix = method === "pix";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm text-center space-y-6">
          {isPix ? (
            <>
              {/* PIX Flow */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-[var(--lc-teal-600)]">
                <QrCode className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Quase lá! Pague com PIX
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Escaneie o QR Code abaixo ou copie o código Copia e Cola para ativar
                  sua assinatura.
                </p>
              </div>

              {/* QR Code Container */}
              {image && (
                <div className="mx-auto border border-slate-100 p-4 rounded-2xl bg-white w-48 h-48 shadow-inner flex items-center justify-center">
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt="QR Code PIX"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Copy & Paste Code */}
              {payload && (
                <div className="space-y-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full h-11 rounded-full flex items-center justify-center gap-2 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-sm font-semibold active:scale-[0.98] transition-all"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copiado!" : "Copiar Código Pix"}
                  </Button>
                </div>
              )}

              {/* Loader info */}
              <div className="flex items-center justify-center gap-2.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-3">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--lc-teal-600)] shrink-0" />
                <span className="text-left leading-tight">
                  Aguardando confirmação do pagamento. Seu acesso será liberado
                  automaticamente.
                </span>
              </div>

              {formattedExpiry && (
                <p className="text-[11px] text-slate-400">
                  Este código expira às {formattedExpiry}.
                </p>
              )}
            </>
          ) : (
            <>
              {/* Credit Card / General Success Flow */}
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Assinatura Confirmada! 🎉
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Sua assinatura do <strong>Plano Profissional</strong> foi ativada.
                  Obrigado por assinar a Lente Clínica!
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-150 p-4 text-xs text-slate-600 text-left space-y-2">
                <p>
                  ✓ Acesso liberado a todas as ferramentas
                </p>
                <p>
                  ✓ Fichas de apoio de psicofármacos liberadas
                </p>
                <p>
                  ✓ Rastreio ilimitado de checklists
                </p>
              </div>
            </>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={() => router.push("/medications")}
              className="w-full h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
            >
              Ir para o Painel
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Lente Clínica. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
