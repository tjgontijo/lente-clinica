import {
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Eye,
  HelpCircle,
  MessageCircle,
  Pill,
  Quote,
  Users,
} from "lucide-react";

const SERTRALINA = {
  name: "Cloridrato de Sertralina",
  classe: "Inibidor Seletivo da Recaptação de Serotonina (ISRS)",
  clinicalPhrase:
    "ISRS de amplo uso em depressão e ansiedade. Efeitos terapêuticos costumam emergir após 2 a 4 semanas de uso contínuo.",
  clinicalContexts: [
    "Transtorno depressivo maior em adultos e adolescentes.",
    "Transtorno de ansiedade generalizada e fobia social.",
    "Transtorno obsessivo-compulsivo (TOC).",
    "Transtorno de pânico e transtorno de estresse pós-traumático.",
    "Uso em contextos de comorbidade com outros transtornos do humor.",
  ],
  patientReports: [
    "Ainda não sinto diferença, mas já faz uma semana.",
    "Fiquei com náusea nos primeiros dias.",
    "Meu sono ficou diferente desde que comecei.",
    "Sinto minha boca mais seca agora.",
    "Minha apetite mudou bastante.",
    "Parece que estou mais distante emocionalmente.",
  ],
  careObservations: [
    "Verificar se o paciente entende o prazo de latência (2 a 4 semanas).",
    "Observar sinais de ativação paradoxal nas primeiras semanas.",
    "Avaliar qualidade do sono e apetite como marcadores de resposta.",
    "Monitorar relatos de distância emocional ou embotamento afetivo.",
    "Checar se há história de episódios maníacos anteriores.",
  ],
  usefulQuestions: [
    "O que você notou de diferente desde que começou a tomar?",
    "Está conseguindo dormir? Como está o sono?",
    "Você está tomando no mesmo horário todos os dias?",
    "Seu médico explicou quanto tempo leva para fazer efeito?",
    "Você parou de tomar algum dia? Por quê?",
    "Sentiu algum desconforto físico nos primeiros dias?",
  ],
  coordinationNotes: [
    "Alinhar com o prescritor se o paciente relatar ausência de resposta após 4 semanas.",
    "Comunicar imediatamente qualquer relato de piora do humor nas primeiras semanas.",
    "Registrar e repassar queixas de efeitos colaterais persistentes como náusea ou insônia.",
    "Informar ao prescritor se o paciente mencionar uso de outros medicamentos ou fitoterápicos.",
  ],
  clinicalConfounders: [
    "Ansiedade nas primeiras semanas pode ser efeito transitório, não piora do quadro.",
    "Embotamento afetivo pode ser confundido com melhora do humor pelo paciente.",
    "Alterações de sono podem ter origem na condição clínica de base, não no medicamento.",
    "Relatos de cansaço podem refletir a própria depressão e não efeito adverso.",
  ],
  attentionSignals: [
    "Piora súbita do humor ou pensamentos de autolesão.",
    "Agitação intensa ou insônia nova após início do uso.",
    "Descontinuação abrupta sem orientação médica.",
    "Relatos de sintomas de descontinuação: tontura, náusea ou sensações elétricas.",
  ],
};

const ROWS = [
  {
    label: "Contextos Clínicos",
    icon: ExternalLink,
    data: SERTRALINA.clinicalContexts,
    dotColor: "bg-[var(--lc-teal-400)]",
    pillClass:
      "bg-[var(--lc-neutral-50)] border-[var(--lc-neutral-150)] text-[var(--lc-neutral-700)]",
    iconClass: "text-[var(--lc-teal-500)]",
    labelClass: "text-[var(--lc-neutral-400)]",
  },
  {
    label: "Relatos Comuns",
    icon: MessageCircle,
    data: SERTRALINA.patientReports,
    dotColor: "bg-[var(--lc-teal-400)]",
    pillClass:
      "bg-[var(--lc-neutral-50)] border-[var(--lc-neutral-150)] text-[var(--lc-neutral-700)] italic",
    iconClass: "text-[var(--lc-teal-500)]",
    labelClass: "text-[var(--lc-neutral-400)]",
  },
  {
    label: "O que Observar",
    icon: Eye,
    data: SERTRALINA.careObservations,
    dotColor: "bg-[var(--lc-teal-400)]",
    pillClass:
      "bg-[var(--lc-neutral-50)] border-[var(--lc-neutral-150)] text-[var(--lc-neutral-700)]",
    iconClass: "text-[var(--lc-teal-500)]",
    labelClass: "text-[var(--lc-neutral-400)]",
  },
  {
    label: "Perguntas Úteis",
    icon: HelpCircle,
    data: SERTRALINA.usefulQuestions,
    dotColor: "bg-blue-300",
    pillClass:
      "bg-blue-50 border-blue-100 text-[var(--lc-neutral-700)] font-medium",
    iconClass: "text-blue-400",
    labelClass: "text-[var(--lc-neutral-400)]",
  },
  {
    label: "Coordenação",
    icon: Users,
    data: SERTRALINA.coordinationNotes,
    dotColor: "bg-indigo-300",
    pillClass: "bg-indigo-50 border-indigo-100 text-[var(--lc-neutral-700)]",
    iconClass: "text-indigo-400",
    labelClass: "text-[var(--lc-neutral-400)]",
  },
  {
    label: "Confundidores",
    icon: AlertCircle,
    data: SERTRALINA.clinicalConfounders,
    dotColor: "bg-[var(--lc-amber-400)]",
    pillClass:
      "bg-[var(--lc-amber-50)] border-[var(--lc-amber-100)] text-[var(--lc-neutral-700)]",
    iconClass: "text-[var(--lc-amber-500)]",
    labelClass: "text-[var(--lc-amber-600)]",
  },
  {
    label: "Sinais de Atenção",
    icon: AlertTriangle,
    data: SERTRALINA.attentionSignals,
    dotColor: "bg-red-400",
    pillClass: "bg-red-50 border-red-100 text-red-900 font-medium",
    iconClass: "text-red-500",
    labelClass: "text-red-400",
  },
];

export function PainPoints() {
  return (
    <section
      id="pain-points"
      className="bg-[var(--lc-neutral-100)] py-24 md:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-heading max-w-3xl text-3xl font-light tracking-tight text-[var(--lc-neutral-950)] md:text-5xl lg:text-6xl mb-6">
            Cada medicamento tem uma{" "}
            <span className="text-[var(--lc-teal-600)] italic">
              ficha de apoio clínico
            </span>{" "}
            pronta para o seu atendimento.
          </h2>
          <p className="max-w-2xl text-lg text-[var(--lc-neutral-600)]">
            Veja como a Lente Clínica organiza as informações de um medicamento
            para apoiar o que você escuta, observa e precisa perguntar.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* Fake browser chrome */}
          <div className="rounded-[32px] border border-[var(--lc-neutral-200)] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--lc-neutral-100)] bg-[var(--lc-neutral-50)]">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[var(--lc-neutral-200)]" />
                <div className="h-3 w-3 rounded-full bg-[var(--lc-neutral-200)]" />
                <div className="h-3 w-3 rounded-full bg-[var(--lc-neutral-200)]" />
              </div>
              <div className="flex-1 mx-4 h-6 rounded-lg bg-[var(--lc-neutral-150)] flex items-center px-3">
                <span className="text-[11px] text-[var(--lc-neutral-400)] font-mono">
                  lenteclinica.com.br/medicamentos
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[var(--lc-teal-50)] flex items-center justify-center text-[var(--lc-teal-600)] border border-[var(--lc-teal-100)] shrink-0">
                  <Pill size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--lc-neutral-900)] leading-tight">
                    {SERTRALINA.name}
                  </h3>
                  <p className="text-sm text-[var(--lc-neutral-500)] mt-0.5">
                    {SERTRALINA.classe}
                  </p>
                </div>
              </div>

              {/* Frase clínica */}
              <div className="flex items-start gap-3 bg-[var(--lc-teal-50)] border border-[var(--lc-teal-100)] rounded-2xl p-5">
                <div className="h-8 w-8 rounded-full bg-[var(--lc-teal-600)] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Quote size={14} />
                </div>
                <p className="text-[var(--lc-teal-800)] font-medium leading-relaxed italic">
                  {SERTRALINA.clinicalPhrase}
                </p>
              </div>

              {/* Linhas empilhadas */}
              <div className="flex flex-col divide-y divide-[var(--lc-neutral-100)]">
                {ROWS.map((row) => (
                  <div key={row.label} className="flex items-start gap-5 py-3">
                    <div className="flex items-center gap-2 w-44 shrink-0 pt-0.5">
                      <div className="h-6 w-6 rounded-lg bg-[var(--lc-neutral-100)] flex items-center justify-center">
                        <row.icon size={13} className={row.iconClass} />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${row.labelClass}`}
                      >
                        {row.label}
                      </span>
                    </div>
                    <ul className="flex flex-wrap gap-2 flex-1">
                      {row.data.map((item, i) => (
                        <li
                          key={i}
                          className={`flex items-center gap-1.5 text-sm border rounded-full px-3 py-1 ${row.pillClass}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${row.dotColor}`}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--lc-neutral-500)]">
            Cada medicamento da plataforma tem uma ficha como essa, curada para
            apoiar a sua escuta, sem substituir seu julgamento clínico.
          </p>
        </div>
      </div>
    </section>
  );
}
