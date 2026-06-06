"use client";

import { AlertTriangle, MessageSquareQuote, ShieldAlert } from "lucide-react";
import { SIGNAL_CATEGORIES, SUPPORT_PHRASES } from "../data/signals";
import { SignalCard } from "./signal-card";

export function ChecklistDashboard() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-16 relative">
      {/* Sticky Sidebar Navigation */}
      <div className="w-full md:w-[280px] flex-shrink-0">
        <div className="sticky top-6 bg-white rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] shadow-[var(--lc-shadow-1)] p-5 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--lc-neutral-900)] flex items-center gap-2">
              <ShieldAlert className="text-[var(--lc-teal-600)]" size={20} />
              Navegação
            </h2>
            <p className="text-[12px] text-[var(--lc-neutral-500)] mt-1">
              Pule direto para a categoria.
            </p>
          </div>
          <nav className="flex flex-col gap-1.5">
            {SIGNAL_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollTo(`cat-${category.id}`)}
                className="text-left px-3 py-2 text-[14px] font-medium text-[var(--lc-neutral-700)] hover:text-[var(--lc-teal-700)] hover:bg-[var(--lc-teal-50)] rounded-md transition-colors"
              >
                {category.title}
              </button>
            ))}
            <button
              onClick={() => scrollTo("frases-apoio")}
              className="text-left px-3 py-2 text-[14px] font-medium text-[var(--lc-neutral-700)] hover:text-[var(--lc-teal-700)] hover:bg-[var(--lc-teal-50)] rounded-md transition-colors"
            >
              Frases de Apoio
            </button>
          </nav>

          <div className="mt-6 pt-4 border-t border-[var(--lc-neutral-150)]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--lc-neutral-400)] mb-3">
              Legenda de Ação
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-yellow-400" />
                <span className="text-[12px] text-[var(--lc-neutral-600)] font-medium">
                  Amarelo: Alinhar em breve
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[var(--lc-red-500)]" />
                <span className="text-[12px] text-[var(--lc-neutral-600)] font-medium">
                  Vermelho: Agir hoje (Urgência)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold text-[var(--lc-neutral-900)] flex items-center gap-3">
            <AlertTriangle className="text-[var(--lc-teal-600)]" size={32} />
            Sinais de Atenção Clínica
          </h1>
          <p className="text-[var(--lc-neutral-600)] mt-2 text-lg">
            Organize o que você já percebe na sessão e decida o próximo passo com clareza.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {SIGNAL_CATEGORIES.map((category) => (
            <div key={category.id} id={`cat-${category.id}`} className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-[var(--lc-neutral-800)] mb-6 border-b border-[var(--lc-neutral-200)] pb-2">
                {category.title}
              </h2>
              <div className="flex flex-col gap-6">
                {category.signals.map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Phrases */}
        <div id="frases-apoio" className="scroll-mt-6 mt-8 pt-8 border-t-2 border-[var(--lc-neutral-200)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-teal-600)] shadow-sm border border-[var(--lc-teal-100)]">
              <MessageSquareQuote size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--lc-neutral-900)]">
                Frases de Apoio para Momentos Críticos
              </h2>
              <p className="text-[var(--lc-neutral-500)] text-sm mt-1">
                Use estas frases diretamente com o paciente quando necessário.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUPPORT_PHRASES.map((phrase) => (
              <div
                key={phrase.id}
                className="bg-white rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] p-4 shadow-sm"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--lc-teal-700)] block mb-2">
                  {phrase.purpose}
                </span>
                <p className="text-[15px] text-[var(--lc-neutral-800)] italic font-medium leading-relaxed">
                  "{phrase.phrase}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
