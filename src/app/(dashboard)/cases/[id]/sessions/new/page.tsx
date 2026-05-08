"use client";

import { AlertCircle, ChevronLeft, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseDetailsQuery } from "@/features/cases/queries/use-case-details-query";
import { StickyAlertsPanel } from "@/features/sessions/components/sticky-alerts-panel";
import { SessionChecklistForm } from "@/features/sessions/forms/session-checklist-form";
import { useSymptomsQuery } from "@/features/symptoms/queries/use-symptoms-query";

export default function NewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const { data: pCase, isPending: isCasePending } = useCaseDetailsQuery(caseId);
  const { data: categories, isPending: isSymptomsPending } = useSymptomsQuery();

  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);

  const isPending = isCasePending || isSymptomsPending;

  if (!isPending && !pCase) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h3 className="text-[20px] font-bold text-[var(--lc-neutral-900)] mb-2">
          Caso não encontrado
        </h3>
        <Button onClick={() => router.push("/cases")}>Voltar para Lista</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-600)] transition-colors w-fit group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-[14px] font-medium">Voltar para o caso</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[var(--lc-teal-600)] mb-1">
              <Sparkles size={20} strokeWidth={2.5} />
              <span className="text-[13px] font-bold uppercase tracking-wider">
                Sessão Mágica
              </span>
            </div>
            <h1 className="text-[32px] font-bold text-[var(--lc-neutral-900)] tracking-tight">
              Nova Sessão Clínica
            </h1>
            <p className="text-[var(--lc-neutral-500)] max-w-[600px] leading-relaxed">
              Preencha o checklist de sintomas observados na sessão de hoje. O
              motor clínico irá alertar sobre riscos potenciais em tempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: Split-View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Checklist Form */}
        <div className="lg:col-span-2">
          {isPending ? (
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full rounded-[32px]" />
            </div>
          ) : (
            <SessionChecklistForm
              caseId={caseId}
              categories={categories ?? []}
              onSymptomChange={setSelectedSymptomIds}
            />
          )}
        </div>

        {/* Right: Sticky Alerts Panel */}
        <div className="lg:col-span-1 sticky top-[100px]">
          {isPending ? (
            <Skeleton className="h-[500px] w-full rounded-[32px]" />
          ) : (
            <StickyAlertsPanel
              medications={pCase?.medications ?? []}
              selectedSymptomIds={selectedSymptomIds}
            />
          )}
        </div>
      </div>
    </div>
  );
}
