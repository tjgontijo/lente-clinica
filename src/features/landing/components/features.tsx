import { ClipboardCheck, Database, FileText, Headphones } from "lucide-react";

const FEATURES = [
  {
    title: "Curadoria Especializada",
    description:
      "Informações organizadas sobre os principais psicofármacos para apoiar a leitura clínica dos relatos do paciente.",
    icon: Database,
    color: "teal",
  },
  {
    title: "Fichas de Apoio Clínico",
    description:
      "Resumo estruturado para acompanhar evolução, sintomas percebidos, efeitos colaterais e pontos de atenção.",
    icon: ClipboardCheck,
    color: "amber",
  },
  {
    title: "Relatórios de Alinhamento",
    description:
      "Materiais objetivos para facilitar conversas entre profissionais e equipes.",
    icon: FileText,
    color: "teal",
  },
  {
    title: "Apoio à Escuta",
    description:
      "Mais contexto para acolher o relato do paciente sem perder informações importantes entre os atendimentos.",
    icon: Headphones,
    color: "amber",
  },
];

export function Features() {
  return (
    <section className="bg-[var(--lc-neutral-100)] py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-heading max-w-3xl text-3xl font-light tracking-tight text-[var(--lc-neutral-950)] md:text-5xl lg:text-6xl mb-6">
            Tudo o que você precisa para uma{" "}
            <span className="text-[var(--lc-teal-600)] italic">
              prática clínica mais segura.
            </span>
          </h2>
          <p className="max-w-2xl text-lg text-[var(--lc-neutral-600)]">
            Funcionalidades desenhadas para profissionais que acompanham
            pacientes medicados e precisam de mais organização, contexto e
            clareza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="group flex gap-5 p-8 rounded-[28px] bg-white border border-[var(--lc-neutral-150)] hover:border-[var(--lc-teal-100)] hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                  feature.color === "teal"
                    ? "bg-[var(--lc-teal-50)] text-[var(--lc-teal-600)] group-hover:bg-[var(--lc-teal-600)] group-hover:text-white"
                    : "bg-[var(--lc-amber-50)] text-[var(--lc-amber-600)] group-hover:bg-[var(--lc-amber-600)] group-hover:text-white"
                }`}
              >
                <feature.icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--lc-neutral-900)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--lc-neutral-600)] leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl border border-[var(--lc-neutral-200)] bg-white p-6 text-center">
          <p className="text-sm text-[var(--lc-neutral-500)]">
            A Lente Clínica não substitui avaliação, diagnóstico ou conduta
            profissional.{" "}
            <span className="text-[var(--lc-neutral-700)] font-medium">
              Ela organiza informações para apoiar sua escuta, análise e
              acompanhamento.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
