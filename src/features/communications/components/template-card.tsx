"use client";

import { useState } from "react";
import { Copy, Check, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import type { CommunicationTemplate } from "../data/templates";
import type { PatientContext } from "./communications-dashboard";

interface TemplateCardProps {
  template: CommunicationTemplate;
  context: PatientContext;
}

type TabType = "short" | "medium" | "formal";

export function TemplateCard({ template, context }: TemplateCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("short");
  const [copiedTab, setCopiedTab] = useState<TabType | null>(null);

  const getReplacedText = (text: string) => {
    let newText = text;
    if (context.initials) {
      newText = newText.replace(/\[iniciais\]/gi, context.initials);
    }
    if (context.age) {
      newText = newText.replace(/\[idade\]/gi, context.age);
    }
    if (context.medication) {
      newText = newText.replace(/\[medicação\]/gi, context.medication);
      newText = newText.replace(/\[medicação_benzo\]/gi, context.medication);
    }
    // Removendo aspas duplas de inicio e fim (frequentes nos shorts e mediums)
    if (newText.startsWith('"') && newText.endsWith('"')) {
      newText = newText.substring(1, newText.length - 1);
    }
    return newText;
  };

  const handleCopy = (tab: TabType, rawText: string) => {
    const final = getReplacedText(rawText);
    navigator.clipboard.writeText(final).then(() => {
      setCopiedTab(tab);
      toast.success("Copiado com sucesso!");
      setTimeout(() => setCopiedTab(null), 2000);
    });
  };

  const tabs = [
    { id: "short", label: "Curto (WhatsApp)", content: template.short },
    { id: "medium", label: "Médio", content: template.medium },
    { id: "formal", label: "Formal (Encaminhamento)", content: template.formal },
  ].filter((t) => t.content);

  // Auto fallback if default 'short' is not available
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="bg-white rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-[var(--lc-neutral-100)] flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center bg-[var(--lc-neutral-100)] text-[var(--lc-neutral-600)] w-8 h-8 rounded-full text-xs font-bold">
              {template.id}
            </span>
            <h3 className="text-lg font-bold text-[var(--lc-neutral-800)] leading-tight">
              {template.title}
            </h3>
          </div>
          {template.isAttention && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
              <TriangleAlert size={12} />
              Atenção
            </div>
          )}
        </div>
        <p className="text-sm text-[var(--lc-neutral-600)] leading-relaxed pl-11">
          <span className="font-semibold text-[var(--lc-neutral-700)]">
            Contexto:
          </span>{" "}
          {template.context}
        </p>
      </div>

      <div className="flex flex-col bg-[var(--lc-neutral-50)] flex-1">
        {tabs.length > 1 && (
          <div className="flex px-4 pt-3 gap-2 border-b border-[var(--lc-neutral-200)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px] ${
                  currentTab?.id === tab.id
                    ? "bg-white text-[var(--lc-teal-700)] border border-b-0 border-[var(--lc-neutral-200)]"
                    : "text-[var(--lc-neutral-500)] hover:text-[var(--lc-neutral-700)] hover:bg-[var(--lc-neutral-100)] border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {currentTab && (
          <div className="p-5 bg-white flex-1 relative group">
            <button
              onClick={() => handleCopy(currentTab.id as TabType, currentTab.content!)}
              className="absolute top-4 right-4 p-2 bg-[var(--lc-neutral-50)] hover:bg-[var(--lc-teal-50)] text-[var(--lc-neutral-500)] hover:text-[var(--lc-teal-600)] rounded-md border border-[var(--lc-neutral-200)] hover:border-[var(--lc-teal-200)] transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-semibold"
            >
              {copiedTab === currentTab.id ? (
                <>
                  <Check size={14} className="text-green-600" /> Copiado!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar texto
                </>
              )}
            </button>
            <div className="pr-24">
              <p className="text-sm text-[var(--lc-neutral-800)] whitespace-pre-wrap font-medium leading-relaxed">
                {getReplacedText(currentTab.content!)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
