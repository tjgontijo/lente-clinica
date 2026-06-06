import { HeartHandshake, Landmark, Stethoscope, Users } from "lucide-react";

const AUDIENCES = [
  {
    category: "Psicólogos e Terapeutas",
    benefit:
      "Organize relatos entre sessões e acompanhe sinais que podem impactar o processo terapêutico.",
    icon: Users,
    items: ["Psicólogos Clínicos", "Psicoterapeutas", "Analistas"],
  },
  {
    category: "Médicos e Clínicas",
    benefit:
      "Tenha informações mais claras sobre adesão, efeitos colaterais e evolução percebida pelo paciente.",
    icon: Stethoscope,
    items: ["Psiquiatras", "Médicos de Família", "Clínicos Gerais"],
  },
  {
    category: "Saúde Pública e CAPS",
    benefit:
      "Apoie equipes no acompanhamento longitudinal de pacientes em uso contínuo de medicação.",
    icon: Landmark,
    items: ["Equipes de CAPS", "Profissionais de UBS", "Saúde da Família"],
  },
  {
    category: "Equipes Multiprofissionais",
    benefit:
      "Facilite o alinhamento entre profissionais com informações organizadas e contextualizadas.",
    icon: HeartHandshake,
    items: [
      "Equipes Multidisciplinares",
      "Clínicas de Saúde Mental",
      "Coordenadores de Cuidado",
    ],
  },
];

export function TargetAudience() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-heading max-w-3xl text-3xl font-light tracking-tight text-[var(--lc-neutral-950)] md:text-5xl lg:text-6xl mb-6">
            Para quem faz{" "}
            <span className="text-[var(--lc-teal-600)] italic">
              saúde mental na prática.
            </span>
          </h2>
          <p className="max-w-2xl text-lg text-[var(--lc-neutral-600)]">
            A Lente Clínica é pensada para profissionais que acompanham
            pacientes em uso de medicação e precisam melhorar a escuta, o
            registro e a comunicação clínica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AUDIENCES.map((group, index) => (
            <div
              key={index}
              className="group flex flex-col p-8 rounded-[28px] bg-[var(--lc-neutral-50)] border border-[var(--lc-neutral-100)] hover:border-[var(--lc-teal-100)] hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-white border border-[var(--lc-neutral-100)] flex items-center justify-center text-[var(--lc-teal-600)] group-hover:bg-[var(--lc-teal-600)] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                  <group.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--lc-neutral-900)] mb-1">
                    {group.category}
                  </h3>
                  <p className="text-sm text-[var(--lc-neutral-500)] leading-relaxed">
                    {group.benefit}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto pt-5 border-t border-[var(--lc-neutral-100)]">
                {group.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-white text-[var(--lc-neutral-600)] text-xs font-medium border border-[var(--lc-neutral-150)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 md:p-8 rounded-[24px] border border-[var(--lc-neutral-150)] bg-[var(--lc-neutral-50)] flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-[var(--lc-amber-100)] flex items-center justify-center text-[var(--lc-amber-600)]">
            <HeartHandshake size={20} />
          </div>
          <p className="text-sm text-[var(--lc-neutral-600)] leading-relaxed">
            <span className="font-semibold text-[var(--lc-neutral-800)]">
              Ideal para coordenação de cuidado:
            </span>{" "}
            A plataforma unifica a linguagem entre psicólogos, médicos e
            equipes, garantindo que informações relevantes sobre o uso de
            medicação não se percam entre os atendimentos.
          </p>
        </div>
      </div>
    </section>
  );
}
