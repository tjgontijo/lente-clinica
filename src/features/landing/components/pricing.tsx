"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="bg-[var(--lc-neutral-950)] py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Value anchor above price */}
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--lc-teal-400)] mb-6">
            Plano Profissional
          </p>
          <h2 className="font-heading max-w-3xl text-3xl font-light tracking-tight text-white md:text-5xl lg:text-6xl mb-6">
            Por menos do que uma consulta perdida,<br />
            <span className="text-[var(--lc-teal-400)] italic">organize toda a sua prática.</span>
          </h2>
          <p className="max-w-xl text-lg text-[var(--lc-neutral-400)]">
            Tenha acesso completo às fichas de apoio, curadoria de psicofármacos e relatórios de alinhamento para o seu consultório.
          </p>

          {/* Annual badge — appears above toggle */}
          <div className={cn(
            "mt-10 mb-3 transition-all duration-300",
            isAnnual ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
          )}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lc-teal-900)] border border-[var(--lc-teal-700)] px-3 py-1 text-[11px] font-bold text-[var(--lc-teal-300)] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lc-teal-400)]" />
              Melhor valor: 2 meses grátis
            </span>
          </div>

          {/* Toggle */}
          <div className={cn("flex items-center justify-center gap-4", !isAnnual && "mt-10 mb-[28px]")}>
            <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-white" : "text-[var(--lc-neutral-500)]")}>
              Mensal
            </span>
            <button
              type="button"
              className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full bg-[var(--lc-teal-600)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] focus:ring-offset-2 focus:ring-offset-[var(--lc-neutral-950)]"
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  isAnnual ? "translate-x-7" : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-white" : "text-[var(--lc-neutral-500)]")}>
              Anual
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="mx-auto max-w-lg">
          <div className="relative rounded-[40px] bg-gradient-to-br from-[var(--lc-teal-700)] to-[var(--lc-teal-950)] p-px shadow-2xl">
            <div className="rounded-[40px] bg-gradient-to-br from-[var(--lc-teal-800)] to-[var(--lc-neutral-950)] p-8 md:p-10">
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-6xl font-extrabold text-white">R$ {isAnnual ? "299" : "29"}</span>
                <span className="text-xl font-medium text-[var(--lc-neutral-400)]">/{isAnnual ? "ano" : "mês"}</span>
              </div>
              {isAnnual ? (
                <p className="text-sm text-[var(--lc-teal-400)] mb-8">equivale a R$ 24,91/mês, 2 meses grátis</p>
              ) : (
                <div className="mb-8" />
              )}

              <ul className="mb-10 space-y-4">
                {[
                  "Organize relatos de pacientes em acompanhamento",
                  "Acompanhe sinais de sono, humor, adesão e efeitos colaterais",
                  "Fichas de apoio clínico por psicofármaco",
                  "Relatórios para alinhamento entre profissionais",
                  "Curadoria atualizada dos principais psicofármacos",
                  "Cancele quando quiser"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[var(--lc-neutral-300)]">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--lc-teal-700)] text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-in"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 text-[var(--lc-neutral-950)] text-base font-bold transition-all hover:bg-[var(--lc-teal-50)] hover:scale-[1.02] active:scale-[0.98] mb-4"
              >
                Criar minha conta
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-center text-xs text-[var(--lc-neutral-500)]">
                Sem compromisso de permanência. Cancele quando quiser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
