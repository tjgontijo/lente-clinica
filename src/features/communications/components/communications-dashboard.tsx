"use client";

import { useState } from "react";
import { MessageSquareText, Search } from "lucide-react";
import { COMMUNICATION_TEMPLATES, INTERVIEW_SCRIPTS } from "../data/templates";
import { TemplateCard } from "./template-card";
import { InterviewScripts } from "./interview-scripts";

export interface PatientContext {
  initials: string;
  age: string;
  medication: string;
}

export function CommunicationsDashboard() {
  const [context, setContext] = useState<PatientContext>({
    initials: "",
    age: "",
    medication: "",
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = COMMUNICATION_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.context.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pb-16">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--lc-neutral-900)] flex items-center gap-3">
              <MessageSquareText className="text-[var(--lc-teal-600)]" size={32} />
              Kit de Comunicação Clínica
            </h1>
            <p className="text-[var(--lc-neutral-600)] mt-2 text-lg">
              Modelos prontos para facilitar sua comunicação com psiquiatras.
            </p>
          </div>

          {/* Context Form */}
          <div className="bg-white p-6 rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)] shadow-[var(--lc-shadow-1)] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--lc-neutral-500)] mb-2">
              Preencha para personalizar os textos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--lc-neutral-700)]">
                  Iniciais do Paciente
                </label>
                <input
                  type="text"
                  placeholder="Ex: J.S."
                  className="w-full px-3 py-2 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] transition-all"
                  value={context.initials}
                  onChange={(e) => setContext({ ...context, initials: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--lc-neutral-700)]">
                  Idade
                </label>
                <input
                  type="text"
                  placeholder="Ex: 34"
                  className="w-full px-3 py-2 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] transition-all"
                  value={context.age}
                  onChange={(e) => setContext({ ...context, age: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--lc-neutral-700)]">
                  Medicação Atual
                </label>
                <input
                  type="text"
                  placeholder="Ex: Escitalopram 10mg"
                  className="w-full px-3 py-2 bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-200)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--lc-teal-500)] transition-all"
                  value={context.medication}
                  onChange={(e) => setContext({ ...context, medication: e.target.value })}
                />
              </div>
            </div>
            <p className="text-xs text-[var(--lc-neutral-400)] italic">
              * O preenchimento é opcional. Se não preencher, os textos usarão os marcadores como [iniciais].
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Scenarios */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--lc-neutral-800)]">
              Modelos por Cenário Clínico
            </h2>
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-[var(--lc-neutral-400)]" />
              </div>
              <input
                type="text"
                placeholder="Buscar cenário..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[var(--lc-neutral-200)] rounded-[var(--lc-radius-full)] focus:outline-none focus:border-[var(--lc-teal-400)] focus:ring-1 focus:ring-[var(--lc-teal-400)] text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="p-8 text-center text-[var(--lc-neutral-500)] bg-[var(--lc-neutral-50)] rounded-[var(--lc-radius-md)] border border-[var(--lc-neutral-200)]">
              Nenhum cenário encontrado para "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  context={context}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Interview Scripts */}
        <div className="w-full lg:w-[350px] flex-shrink-0 space-y-6">
          <InterviewScripts scripts={INTERVIEW_SCRIPTS} />
        </div>
      </div>
    </div>
  );
}
