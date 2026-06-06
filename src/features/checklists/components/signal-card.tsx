"use client";

import { AlertCircle, TriangleAlert, HelpCircle } from "lucide-react";
import type { AttentionSignal } from "../data/signals";

export function SignalCard({ signal }: { signal: AttentionSignal }) {
  return (
    <div className="bg-white rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-[var(--lc-neutral-100)] bg-[var(--lc-neutral-50)]">
        <h3 className="text-[16px] font-bold text-[var(--lc-neutral-900)] leading-tight">
          {signal.title}
        </h3>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-5">
        {/* Appearance */}
        <div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--lc-neutral-500)] block mb-1">
            O que parece na sessão
          </span>
          <p className="text-[14px] text-[var(--lc-neutral-700)] leading-relaxed">
            {signal.appearance}
          </p>
        </div>

        {/* Key Question */}
        <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100/50">
          <div className="flex items-center gap-2 mb-1.5">
            <HelpCircle size={14} className="text-blue-500" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-blue-700">
              Pergunta-Chave
            </span>
          </div>
          <p className="text-[14px] font-semibold text-blue-900 italic leading-snug">
            "{signal.keyQuestion}"
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-auto pt-2">
          {signal.actions.map((action, i) => {
            const isRed = action.level === "vermelho";
            return (
              <div
                key={i}
                className={`p-3 rounded-lg border flex gap-3 items-start ${
                  isRed
                    ? "bg-[var(--lc-red-50)] border-[var(--lc-red-200)]"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 ${
                    isRed ? "text-[var(--lc-red-600)]" : "text-yellow-600"
                  }`}
                >
                  {isRed ? <AlertCircle size={16} /> : <TriangleAlert size={16} />}
                </div>
                <div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider block mb-0.5 ${
                      isRed ? "text-[var(--lc-red-800)]" : "text-yellow-800"
                    }`}
                  >
                    Ação {isRed ? "Vermelho" : "Amarelo"}
                  </span>
                  <p
                    className={`text-[13px] font-medium leading-snug ${
                      isRed ? "text-[var(--lc-red-900)]" : "text-yellow-900"
                    }`}
                  >
                    {action.instruction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
