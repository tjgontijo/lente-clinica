import {
  Info,
  MessageCircle,
  Eye,
  AlertCircle,
  HelpCircle,
  Quote,
  Pill,
  ExternalLink,
  Users,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import type { MedicationWithClass } from "../types";

interface MedicationDetailsProps {
  medication: MedicationWithClass;
}

export function MedicationDetails({ medication }: MedicationDetailsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToMarkdown = () => {
    const md = [
      `# ${medication.name}`,
      medication.clinicalPhrase ? `> ${medication.clinicalPhrase}\n` : "",
      `**Classe:** ${medication.class.name} - ${medication.class.description}\n`,
      "## Descrição",
      medication.description || "Descrição não disponível.",
      "\n## Contextos Clínicos",
      medication.clinicalContexts?.map((ctx) => `- ${ctx}`).join("\n") || "N/A",
      "\n## Relatos Comuns",
      medication.patientReports?.map((r) => `- ${r}`).join("\n") || "N/A",
      "\n## O que observar na sessão",
      medication.sessionObservations?.map((o) => `- ${o}`).join("\n") || "N/A",
      "\n## Perguntas úteis",
      medication.usefulQuestions?.map((q) => `- ${q}`).join("\n") || "N/A",
      "\n## Notas de Coordenação",
      medication.coordinationNotes?.map((n) => `- ${n}`).join("\n") || "N/A",
      "\n## Sinais de Atenção",
      medication.attentionSignals?.map((s) => `- ${s}`).join("\n") || "N/A",
      "\n## Possíveis confundidores clínicos",
      medication.confoundingEffects?.map((e) => `- ${e}`).join("\n") || "N/A",
    ].join("\n");

    navigator.clipboard.writeText(md).then(() => {
      setIsCopied(true);
      toast.success("Copiado para o clipboard!", {
        description: "O conteúdo do medicamento está pronto para ser colado em formato Markdown.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header Info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-teal-600)] shadow-sm border border-[var(--lc-teal-100)]">
                  <Pill size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-[28px] font-bold text-[var(--lc-neutral-900)] tracking-tight leading-none mb-2">
                    {medication.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[12px] bg-[var(--lc-neutral-50)] text-[var(--lc-neutral-600)] border-[var(--lc-neutral-200)] px-2 py-0.5">
                      {medication.class.name}
                    </Badge>
                    <span className="text-[14px] text-[var(--lc-neutral-500)] font-medium">
                      {medication.class.description}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={copyToMarkdown}
                className="text-[var(--lc-neutral-400)] hover:text-[var(--lc-teal-600)] hover:bg-[var(--lc-teal-50)] transition-all flex-shrink-0"
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
          </div>
        </div>

        {medication.clinicalPhrase && (
          <div className="relative bg-[var(--lc-teal-100)] border border-[var(--lc-teal-200)] text-[var(--lc-teal-800)] p-6 rounded-[24px] overflow-hidden group mb-2">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform duration-500 text-[var(--lc-teal-900)]">
              <Quote size={80} />
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[var(--lc-teal-600)] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <Quote size={18} />
              </div>
              <p className="text-[17px] font-semibold leading-relaxed italic">
                {medication.clinicalPhrase}
              </p>
            </div>
          </div>
        )}

        {/* Products Section */}
        {medication.products && medication.products.length > 0 && (
          <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Pill size={14} className="text-[var(--lc-teal-500)]" />
              </div>
              Produtos Comerciais
            </div>
            <div className="flex flex-wrap gap-2">
              {medication.products.map((product) => (
                <Badge
                  key={product.id}
                  variant="outline"
                  className="bg-white text-[var(--lc-neutral-600)] border-[var(--lc-neutral-200)] hover:bg-[var(--lc-neutral-50)] px-3 py-1.5 text-[12px] font-semibold rounded-xl transition-colors"
                >
                  {product.productName}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Description / Mechanism */}
        <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Info size={14} className="text-[var(--lc-teal-500)]" />
            </div>
            Mecanismo e Indicações
          </div>
          <p className="text-[16px] text-[var(--lc-neutral-700)] leading-relaxed font-medium">
            {medication.description ||
              "Descrição não disponível para este medicamento."}
          </p>
        </section>

        {/* Clinical Contexts */}
        <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <ExternalLink size={14} className="text-[var(--lc-teal-500)]" />
            </div>
            Contextos Clínicos
          </div>
          <ul className="space-y-3">
            {medication.clinicalContexts?.map((ctx, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] text-[var(--lc-neutral-700)] leading-snug"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--lc-teal-400)] mt-2 flex-shrink-0" />
                {ctx}
              </li>
            )) || (
                <span className="text-[14px] text-[var(--lc-neutral-400)] italic">
                  Dados em análise...
                </span>
              )}
          </ul>
        </section>

        {/* Patient Reports */}
        <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <MessageCircle size={14} className="text-[var(--lc-teal-500)]" />
            </div>
            Relatos Comuns
          </div>
          <ul className="space-y-3">
            {medication.patientReports?.map((report, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] text-[var(--lc-neutral-700)] leading-snug"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--lc-teal-400)] mt-2 flex-shrink-0" />
                {report}
              </li>
            )) || (
                <span className="text-[14px] text-[var(--lc-neutral-400)] italic">
                  Dados em análise...
                </span>
              )}
          </ul>
        </section>

        {/* Session Observations */}
        <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Eye size={14} className="text-[var(--lc-teal-500)]" />
            </div>
            O que observar na sessão
          </div>
          <ul className="space-y-3">
            {medication.sessionObservations?.map((obs, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] text-[var(--lc-neutral-700)] leading-snug"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--lc-teal-400)] mt-2 flex-shrink-0" />
                {obs}
              </li>
            )) || (
                <span className="text-[14px] text-[var(--lc-neutral-400)] italic">
                  Dados em análise...
                </span>
              )}
          </ul>
        </section>

        {/* Useful Questions */}
        <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <HelpCircle size={14} className="text-blue-500" />
            </div>
            Perguntas úteis
          </div>
          <ul className="space-y-3">
            {medication.usefulQuestions?.map((question, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] text-[var(--lc-neutral-700)] font-semibold leading-snug"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                {question}
              </li>
            )) || (
              <span className="text-[14px] text-[var(--lc-neutral-400)] italic">
                Dados em análise...
              </span>
            )}
          </ul>
        </section>

        {/* Coordination Notes */}
        <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <Users size={14} className="text-indigo-500" />
            </div>
            Notas de Coordenação
          </div>
          <ul className="space-y-3">
            {medication.coordinationNotes?.map((note, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] text-[var(--lc-neutral-700)] leading-snug"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                {note}
              </li>
            )) || (
              <span className="text-[14px] text-[var(--lc-neutral-400)] italic">
                Dados em análise...
              </span>
            )}
          </ul>
        </section>

        {/* Attention Signals */}
        <section className="bg-red-50/30 p-6 rounded-[24px] border border-red-100 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-red-500/70">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <AlertTriangle size={14} className="text-red-500" />
            </div>
            Sinais de Atenção
          </div>
          <ul className="space-y-3">
            {medication.attentionSignals?.map((signal, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] text-red-900 leading-snug font-medium"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                {signal}
              </li>
            )) || (
              <span className="text-[14px] text-red-400/60 italic">
                Dados em análise...
              </span>
            )}
          </ul>
        </section>

        {/* Confounding Effects */}
        <section className="bg-[var(--lc-neutral-50)] p-6 rounded-[24px] border border-[var(--lc-neutral-150)] flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--lc-neutral-400)]">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
              <AlertCircle size={14} className="text-amber-500" />
            </div>
            Possíveis confundidores clínicos
          </div>
          <ul className="space-y-3">
            {medication.confoundingEffects?.map((effect, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] text-[var(--lc-neutral-700)] leading-snug"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                {effect}
              </li>
            )) || (
              <span className="text-[14px] text-[var(--lc-neutral-400)] italic">
                Dados em análise...
              </span>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
