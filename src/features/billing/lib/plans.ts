export const PLANS = [
  {
    code: "professional_monthly",
    name: "Plano Profissional Mensal",
    price: 29.00,
    cycle: "MONTHLY" as const,
    description: "Acesso completo cobrado mensalmente",
    features: [
      "Curadoria de psicofármacos atualizada",
      "Sinais de atenção detalhados por medicamento",
      "Criação ilimitada de checklists de rastreio",
      "Relatórios de comunicação para outros profissionais",
      "Suporte via email",
    ],
  },
  {
    code: "professional_yearly",
    name: "Plano Profissional Anual",
    price: 299.00,
    cycle: "YEARLY" as const,
    description: "Acesso completo cobrado anualmente (2 meses grátis)",
    features: [
      "Curadoria de psicofármacos atualizada",
      "Sinais de atenção detalhados por medicamento",
      "Criação ilimitada de checklists de rastreio",
      "Relatórios de comunicação para outros profissionais",
      "Suporte via email prioritário",
    ],
  },
] as const;

export type PlanCode = typeof PLANS[number]["code"];

export function getPlan(code: string) {
  const plan = PLANS.find((p) => p.code === code);
  if (!plan) {
    throw new Error(`Plano com código '${code}' não encontrado.`);
  }
  return plan;
}
