export const ATC_HUMAN_MAPPING: Record<string, string> = {
  // Sistema Nervoso (N)
  N3A: "Antiepiléptico",
  N5A: "Antipsicótico",
  N5B: "Ansiolítico",
  N5C: "Hipnótico/Sedativo",
  N6A: "Antidepressivo",
  N6B: "Psicoestimulante",
  N6C: "Psicoléptico",
  N6D: "Antidemência",
  N2A: "Analgésico Opioide",
  N2B: "Analgésico",
  N7A: "Parassimpatomimético",
  N7D: "Dependência",
  N4A: "Antiparkinsoniano",

  // Cardiovascular (C)
  C7A: "Beta-bloqueador",
  C8A: "Bloqueador de Cálcio",
  C9A: "Inibidor da ECA",
  C9C: "Antagonista AT-II",
  C10A: "Estatina",

  // Alimentar/Metabolismo (A)
  A2B: "Antiácido/Protetor",
  A10A: "Insulina",
  A10B: "Antidiabético",
  A10L: "Antidiabético",
  A16A: "Metabolismo",

  // Respiratório (R)
  R5C: "Expectorante",
  R6A: "Anti-histamínico",
  R3A: "Antiasmático",

  // Musculoesquelético (M)
  M1A: "Anti-inflamatório",
  M3B: "Relaxante Muscular",
  M5X: "Osteoporose",

  // Hormônios (G, H)
  G3A: "Contraceptivo",
  G3G: "Hormônio Sexual",
  H2A: "Corticoide",
};

export function getHumanClass(code: string, description?: string | null): string {
  // Tentar match exato do código de 3 ou 4 dígitos
  const code3 = code.substring(0, 3);
  const code4 = code.substring(0, 4);

  return (
    ATC_HUMAN_MAPPING[code4] ||
    ATC_HUMAN_MAPPING[code3] ||
    description ||
    code
  );
}
