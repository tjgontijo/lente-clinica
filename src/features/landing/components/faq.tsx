"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "A Lente Clínica substitui o profissional de saúde?",
    answer:
      "Não. A plataforma organiza informações e oferece apoio à prática clínica, mas não realiza diagnóstico nem define condutas. Toda decisão continua sendo do profissional.",
  },
  {
    question: "A plataforma é indicada para médicos ou psicólogos?",
    answer:
      "Ela pode apoiar qualquer profissional de saúde mental que acompanha pacientes em uso de medicação, incluindo psicólogos, médicos, psiquiatras, equipes de CAPS e clínicas multiprofissionais.",
  },
  {
    question: "O paciente acessa a plataforma?",
    answer:
      "Não. A Lente Clínica é uma ferramenta exclusiva para o profissional de saúde. O paciente não tem acesso e nem precisa saber que ela existe. As informações são registradas e organizadas pelo profissional no contexto do seu próprio atendimento.",
  },
  {
    question: "Os dados são protegidos?",
    answer:
      "Sim. A plataforma foi pensada para lidar com informações sensíveis com responsabilidade e privacidade. Os dados dos pacientes são tratados com segurança e confidencialidade.",
  },
  {
    question: "A Lente Clínica substitui o prontuário?",
    answer:
      "Não. A plataforma é um apoio ao acompanhamento clínico, não um sistema de prontuário. Ela complementa a sua prática, mas não substitui o registro oficial de atendimentos.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim. O plano profissional pode ser cancelado a qualquer momento, sem multas ou burocracia.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-heading max-w-2xl text-3xl font-light tracking-tight text-[var(--lc-neutral-950)] md:text-5xl mb-6">
            Perguntas{" "}
            <span className="text-[var(--lc-teal-600)] italic">
              frequentes.
            </span>
          </h2>
          <p className="max-w-xl text-lg text-[var(--lc-neutral-600)]">
            Respondemos as principais dúvidas sobre o que a Lente Clínica é, e o
            que ela não é.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--lc-neutral-150)] bg-[var(--lc-neutral-50)] overflow-hidden transition-all"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left hover:bg-[var(--lc-neutral-100)] transition-colors"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="text-base font-semibold text-[var(--lc-neutral-900)]">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={cn(
                    "shrink-0 text-[var(--lc-neutral-400)] transition-transform duration-200",
                    open === idx && "rotate-180 text-[var(--lc-teal-600)]",
                  )}
                />
              </button>
              {open === idx && (
                <div className="px-7 pb-6">
                  <p className="text-[var(--lc-neutral-600)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
