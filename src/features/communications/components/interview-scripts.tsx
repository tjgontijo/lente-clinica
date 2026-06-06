"use client";

import { FileQuestion, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { InterviewScript } from "../data/templates";

export function InterviewScripts({ scripts }: { scripts: InterviewScript[] }) {
  const [openScriptId, setOpenScriptId] = useState<string | null>(null);

  const toggleScript = (id: string) => {
    setOpenScriptId(openScriptId === id ? null : id);
  };

  return (
    <div className="bg-[var(--lc-neutral-50)] rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] shadow-[var(--lc-shadow-1)] sticky top-6">
      <div className="p-5 border-b border-[var(--lc-neutral-200)] flex items-center gap-3 bg-white rounded-t-[var(--lc-radius-md)]">
        <div className="w-10 h-10 rounded-full bg-[var(--lc-teal-100)] text-[var(--lc-teal-700)] flex items-center justify-center flex-shrink-0">
          <FileQuestion size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[var(--lc-neutral-800)] leading-tight">
            Roteiros de Perguntas
          </h3>
          <p className="text-[11px] text-[var(--lc-neutral-500)] leading-snug">
            Organize sua observação antes de escrever.
          </p>
        </div>
      </div>
      <div className="p-3 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {scripts.map((script) => {
          const isOpen = openScriptId === script.id;
          return (
            <div
              key={script.id}
              className="bg-white border border-[var(--lc-neutral-200)] rounded-lg overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleScript(script.id)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-[var(--lc-neutral-50)] transition-colors"
              >
                <span className="text-sm font-semibold text-[var(--lc-neutral-700)] pr-4 leading-tight">
                  {script.title}
                </span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-[var(--lc-neutral-400)] flex-shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-[var(--lc-neutral-400)] flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="p-4 pt-1 bg-[var(--lc-neutral-50)] border-t border-[var(--lc-neutral-100)]">
                  <ul className="space-y-3">
                    {script.questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--lc-teal-400)] mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-[var(--lc-neutral-700)] leading-snug">
                          {q}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
