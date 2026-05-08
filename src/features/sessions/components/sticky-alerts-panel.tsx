"use client";

import {
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useActiveAlertsQuery } from "../queries/use-active-alerts-query";

interface StickyAlertsPanelProps {
  medications: any[];
  selectedSymptomIds: string[];
}

export function StickyAlertsPanel({
  medications,
  selectedSymptomIds,
}: StickyAlertsPanelProps) {
  const params = useParams();
  const caseId = params.id as string;

  const { data: alerts, isFetching } = useActiveAlertsQuery(
    caseId,
    selectedSymptomIds,
  );

  const hasAlerts = alerts && alerts.length > 0;

  return (
    <Card className="p-8 rounded-[32px] border-[var(--lc-neutral-150)] bg-white shadow-xl shadow-(--lc-teal-900)/5 overflow-hidden flex flex-col gap-6 border-t-4 border-t-[var(--lc-teal-500)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--lc-teal-700)]">
          <Sparkles size={20} />
          <h3 className="text-[18px] font-bold">Inteligência Clínica</h3>
        </div>
        {isFetching && (
          <Loader2
            size={16}
            className="animate-spin text-[var(--lc-neutral-300)]"
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {!selectedSymptomIds.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4 bg-[var(--lc-neutral-50)] rounded-[24px] border border-dashed border-[var(--lc-neutral-200)]">
            <Info size={32} className="text-[var(--lc-neutral-300)] mb-3" />
            <p className="text-[13px] text-[var(--lc-neutral-500)] leading-relaxed">
              Selecione sintomas ao lado para ativar a análise em tempo real.
            </p>
          </div>
        ) : hasAlerts ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {alerts.map((alert: any) => (
              <div
                key={`${alert.medicationId}-${alert.symptomId}`}
                className={`
                  p-5 rounded-[20px] border flex flex-col gap-3 relative overflow-hidden
                  ${
                    alert.severity === "RED"
                      ? "bg-red-50 border-red-100"
                      : "bg-amber-50 border-amber-100"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {alert.severity === "RED" ? (
                    <AlertCircle
                      size={20}
                      className="text-red-600 shrink-0 mt-0.5"
                    />
                  ) : (
                    <AlertTriangle
                      size={20}
                      className="text-amber-600 shrink-0 mt-0.5"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-[14px] font-bold ${
                        alert.severity === "RED"
                          ? "text-red-900"
                          : "text-amber-900"
                      }`}
                    >
                      {alert.severity === "RED"
                        ? "Urgência Clínica"
                        : "Atenção Necessária"}
                    </span>
                    <p
                      className={`text-[13px] leading-relaxed ${
                        alert.severity === "RED"
                          ? "text-red-800"
                          : "text-amber-800"
                      }`}
                    >
                      O sintoma{" "}
                      <span className="font-bold">{alert.symptom.name}</span>{" "}
                      pode ser um efeito colateral de{" "}
                      <span className="font-bold">{alert.medication.name}</span>
                      .
                    </p>
                  </div>
                </div>

                {alert.context && (
                  <div
                    className={`
                    p-3 rounded-[12px] text-[12px] leading-relaxed
                    ${
                      alert.severity === "RED"
                        ? "bg-red-100/50 text-red-900"
                        : "bg-amber-100/50 text-amber-900"
                    }
                  `}
                  >
                    {alert.context}
                  </div>
                )}

                {/* Severity Badge */}
                <div className="absolute top-2 right-2">
                  <Badge
                    className={`
                    border-none text-[9px] font-bold uppercase tracking-widest px-2 h-5
                    ${
                      alert.severity === "RED"
                        ? "bg-red-600 text-white"
                        : "bg-amber-500 text-white"
                    }
                  `}
                  >
                    {alert.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4 bg-(--lc-teal-50)/30 rounded-[24px] border border-[var(--lc-teal-100)]">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--lc-teal-500)] mb-3 shadow-sm">
              <Sparkles size={24} />
            </div>
            <p className="text-[13px] text-[var(--lc-teal-700)] font-medium leading-relaxed">
              Nenhum alerta clínico detectado para os sintomas selecionados.
            </p>
          </div>
        )}
      </div>

      {/* Active Medications Footer */}
      <div className="mt-auto pt-6 border-t border-[var(--lc-neutral-100)]">
        <span className="text-[11px] font-bold text-[var(--lc-neutral-400)] uppercase tracking-wider mb-3 block">
          Medicações Analisadas
        </span>
        <div className="flex flex-wrap gap-2">
          {medications.map((pm) => (
            <Badge
              key={pm.medicationId}
              variant="outline"
              className="bg-white border-[var(--lc-neutral-200)] text-[var(--lc-neutral-600)] text-[11px] h-7 px-3 rounded-full"
            >
              {pm.medication.name}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
