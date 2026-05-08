export const ATC_HUMAN_MAPPING: Record<string, { label: string; color: string }> = {
  // Sistema Nervoso (N)
  N3A: { label: "Antiepiléptico", color: "blue" },
  N5A: { label: "Antipsicótico", color: "indigo" },
  N5B: { label: "Ansiolítico", color: "blue" },
  N5C: { label: "Hipnótico/Sedativo", color: "slate" },
  N6A: { label: "Antidepressivo", color: "violet" },
  N6B: { label: "Psicoestimulante", color: "purple" },
  N6C: { label: "Psicoléptico", color: "zinc" },
  N6D: { label: "Antidemência", color: "blue" },
  N2A: { label: "Analgésico Opioide", color: "red" },
  N2B: { label: "Analgésico", color: "rose" },
  N7A: { label: "Parassimpatomimético", color: "sky" },
  N7D: { label: "Dependência", color: "orange" },
  N4A: { label: "Antiparkinsoniano", color: "indigo" },

  // Cardiovascular (C)
  C7A: { label: "Beta-bloqueador", color: "rose" },
  C8A: { label: "Bloqueador de Cálcio", color: "red" },
  C9A: { label: "Inibidor da ECA", color: "rose" },
  C9C: { label: "Antagonista AT-II", color: "rose" },
  C10A: { label: "Estatina", color: "pink" },

  // Alimentar/Metabolismo (A)
  A2B: { label: "Antiácido/Protetor", color: "emerald" },
  A10A: { label: "Insulina", color: "teal" },
  A10B: { label: "Antidiabético", color: "green" },
  A10L: { label: "Antidiabético", color: "green" },
  A16A: { label: "Metabolismo", color: "emerald" },

  // Respiratório (R)
  R5C: { label: "Expectorante", color: "cyan" },
  R6A: { label: "Anti-histamínico", color: "sky" },
  R3A: { label: "Antiasmático", color: "blue" },

  // Musculoesquelético (M)
  M1A: { label: "Anti-inflamatório", color: "orange" },
  M3B: { label: "Relaxante Muscular", color: "amber" },
  M5X: { label: "Osteoporose", color: "orange" },

  // Hormônios (G, H)
  G3A: { label: "Contraceptivo", color: "fuchsia" },
  G3G: { label: "Hormônio Sexual", color: "pink" },
  H2A: { label: "Corticoide", color: "purple" },
};

export function getHumanClassInfo(code: string, description?: string | null) {
  const code3 = code.substring(0, 3);
  const code4 = code.substring(0, 4);

  const match = ATC_HUMAN_MAPPING[code4] || ATC_HUMAN_MAPPING[code3];

  if (match) return match;

  return {
    label: description || code,
    color: "slate", // Default
  };
}
