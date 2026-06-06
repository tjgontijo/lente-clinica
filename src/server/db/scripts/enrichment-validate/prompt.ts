export const MEDICATION_ENRICHMENT_PROMPT_VERSION =
  "medication-enrichment-v5.3";

export const MEDICATION_ENRICHMENT_STATIC_PROMPT = `
Você está gerando fichas clínicas para um manual de terapeutas (psicólogos e psicoterapeutas) que atendem pacientes medicados em consultório. Destinatário único: terapeuta em sessão semanal ou quinzenal.

PROPÓSITO: o terapeuta abre a ficha sabendo qual medicamento o paciente usa. Quer saber o que pode aparecer na sessão, como discriminar hipóteses, quando comunicar o médico, e quais sinais exigem ação.

REGRAS INVIOLÁVEIS:
Não prescrever, recomendar dose, sugerir início, troca ou suspensão. Não afirmar causalidade como certeza. Não escrever como bula. Não escrever para o paciente. Não posicionar o terapeuta como educador farmacológico ou intermediário entre paciente e médico. Não incluir dose, posologia, ajuste ou titulação. Toda pergunta gerada deve ser respondível pelo terapeuta dentro da própria competência — ouvir, registrar, observar, comunicar ao médico. Se responder a pergunta exigir dar informação técnica sobre o medicamento, ela não pertence aqui.

VOZ: sóbrio, clínico-experiente, como colega sênior. Português brasileiro. Vocabulário psicoterápico quando adequado (linha de base, vínculo terapêutico, acesso afetivo, elaboração, baseline). Linguagem de possibilidade: "pode aparecer", "costuma", "tende a", "em parte dos pacientes". Variar sujeito gramatical e estrutura sintática — as expressões "Em sessão, isso..." e "Vale observar/considerar..." no máximo uma vez cada por ficha. Os communicationScenarios não devem todos começar com "Quando o paciente...". Quando houver janela temporal conhecida (efeito em N semanas, atenção redobrada nas primeiras N semanas, descontinuação após N dias), incluir na description.

CALIBRAÇÃO POR FREQUÊNCIA NO CONSULTÓRIO:

Categoria A — Alta frequência: psicofármacos comuns (ISRSs, ISRSNs, antidepressivos atípicos, estabilizadores de humor, antipsicóticos, benzodiazepínicos, hipnóticos, estimulantes para TDAH, lítio, anticonvulsivantes em uso psiquiátrico). Ficha rica: 5 a 7 domínios, description com janelas temporais detalhadas.

Categoria B — Média frequência: não-psiquiátricos com impacto em saúde mental (corticoides sistêmicos, isotretinoína, betabloqueadores, hormônios, anticoncepcionais hormonais, anti-histamínicos sedativos, opioides crônicos, antirretrovirais, imunossupressores comuns). Ficha intermediária: 3 a 5 domínios, foco em impactos subjetivos na sessão.

Categoria C — Baixa frequência: biológicos para doenças raras, oncológicos específicos, terapias enzimáticas, medicamentos hospitalares. O foco muda: não é sobre o medicamento, é sobre o paciente em tratamento contínuo da condição de base (carga do tratamento, identidade, vínculo com equipe, sustentação do trabalho terapêutico). Ficha enxuta: 2 a 3 domínios.

CAMPOS:

description: parágrafo único em prosa, 400–900 caracteres. O que é o medicamento, em que quadros aparece, janelas temporais relevantes para o terapeuta, ponto central de observação na sessão. Para categoria C: foco no paciente com a condição, não no medicamento.

clinicalDomains: array de objetos {name, content}. Quantidade conforme categoria (A: 5–7, B: 3–5, C: 2–3). Cada domínio é um parágrafo coeso em prosa (2–5 frases) que integra organicamente: o que pode aparecer no relato, o que o terapeuta observa na sessão, e o que pode confundir a leitura. Nome do domínio: 1–4 palavras, específico, navegável via bookmark. Escolher domínios pelo que é central para ESTA substância, não por conjunto fixo. Cada domínio traz informação distinta dos outros.

sessionDiscriminationQuestions: array de strings, 3–6 perguntas. Cada pergunta discrimina hipóteses concorrentes na sessão (acatisia vs ansiedade habitual; embotamento vs melhora real; virada maniforme vs bem-estar legítimo; descontinuação vs recaída; sedação vs piora depressiva). São perguntas prontas para o terapeuta dizer em voz alta ao paciente na sessão — não orientações de raciocínio clínico. OBRIGATÓRIO: cada pergunta deve começar com "Você", "O que você", "Como você", "Quando você", "Isso que você", "Essa sensação que você" ou estrutura equivalente em segunda pessoa do singular. PROIBIDO começar com "O paciente", "A queixa", "O que o paciente", "A sensação que", "O relato" ou qualquer formulação em terceira pessoa. Devem passar no teste de fechamento: o terapeuta consegue fazer algo com a resposta dentro da própria competência.

communicationScenarios: array de strings, 3–6 cenários. Situação clínica observável + razão para comunicar o médico. Linguagem prudente, sem imperativo. Variar estrutura sintática entre os itens.

attentionSignals: array de objetos {level, signal, action}. MÍNIMO ABSOLUTO DE 3 SINAIS (3–6). Se você gerou menos de 3, procure ativamente: sinais neuropsiquiátricos agudos, sinais físicos específicos do medicamento em apresentação observável, sinais de descontinuação ou virada de humor.
- level: "amarelo" (alinhar com psiquiatra em dias) ou "vermelho" (agir hoje: acionar psiquiatra, rede e emergência quando necessário). Calibrar pela urgência da ação, não pela gravidade diagnóstica.
- signal: o que aparece na sessão, em uma frase observacional.
- action: o que o terapeuta faz, em uma frase operacional.

VERIFICAÇÃO OBRIGATÓRIA DE SINAIS CRÍTICOS por classe — inclua quando clinicamente relevante, traduzido em apresentação observável na sessão, nunca em terminologia de bula:
ISRSs/ISRSNs: síndrome serotoninérgica (tremor + sudorese + agitação + confusão, sobretudo com associação recente de outro serotoninérgico); sangramento incomum (equimoses sem trauma, sangramento gengival ou nasal frequente); em idosos, quadro confusional novo.
Antidepressivos em geral: ideação suicida nova ou intensificada nas primeiras semanas, especialmente em jovens; virada para estado misto, hipomaníaco ou maníaco.
Antipsicóticos típicos e atípicos: síndrome neuroléptica maligna (rigidez muscular + febre + alteração de consciência + sudorese); acatisia importante (inquietação corporal intensa, incapacidade de permanecer parado — associada a risco suicida); sinais extrapiramidais agudos.
Clozapina: febre, dor de garganta, prostração ou adoecimento agudo (agranulocitose); convulsão.
Lítio: tremor grosseiro novo, ataxia, fala arrastada, confusão, vômitos ou diarreia persistentes (intoxicação), especialmente com desidratação, infecção ou calor.
Anticonvulsivantes estabilizadores (lamotrigina, carbamazepina, valproato, oxcarbazepina): reação cutânea extensa com acometimento mucoso ou febre.
Estimulantes para TDAH: virada maniforme, surto psicótico.
Corticoides sistêmicos: psicose ou mania por corticoide; depressão grave com risco suicida; quadro confusional agudo.
Benzodiazepínicos/hipnóticos: descontinuação grave (tremor importante, agitação, risco de convulsão); rebaixamento de consciência com álcool ou opioides.
Opioides: rebaixamento de consciência, hipoventilação.
Isotretinoína: ideação suicida nova; piora depressiva marcada.
Antiparkinsonianos dopaminérgicos: alucinações, transtornos do controle de impulsos, quadros psicóticos.
Antirretrovirais (efavirenz e similares): ideação suicida, sonhos perturbadores recorrentes, quadros psiquiátricos novos.

clinicalPhrase: frase única, máximo 180 caracteres, resumindo o foco clínico para o terapeuta acompanhar este paciente.

SCHEMA OBRIGATÓRIO:
{
  "description": "string",
  "clinicalDomains": [{ "name": "string", "content": "string" }],
  "sessionDiscriminationQuestions": ["string"],
  "communicationScenarios": ["string"],
  "attentionSignals": [{ "level": "amarelo" | "vermelho", "signal": "string", "action": "string" }],
  "clinicalPhrase": "string"
}

VALIDAÇÃO FINAL:
1. JSON puro, sem markdown, sem comentários, parseável por JSON.parse?
2. attentionSignals tem pelo menos 3 sinais com level explícito? A verificação por classe foi feita?
3. Cada domínio é prosa coesa integrando relato + observação + confundidor, não lista disfarçada?
4. Os domínios são específicos para ESTA substância?
5. As perguntas discriminam hipóteses e passam no teste de fechamento?
6. Nenhuma pergunta exige resposta técnica do terapeuta?
7. "Em sessão, isso..." e "Vale observar/considerar..." aparecem no máximo uma vez cada?
8. Para categoria C, o foco está no paciente com a condição, não no medicamento?
9. A linguagem é observacional, sem causalidade certa, sem orientação prescritiva?

Responda apenas com JSON válido seguindo exatamente este schema. Mantenha as chaves em inglês.
`;

export const getMedicationEnrichmentData = (data: {
  medicationName: string;
  classCode?: string;
  classDescription?: string;
  productNames: string;
  productTypes: string;
  regulatoryLabels: string;
}) => ({
  substance: data.medicationName,
  therapeuticClassCode: data.classCode || "N/A",
  therapeuticClassDescription: data.classDescription || "N/A",
  knownCommercialProducts: data.productNames || "N/A",
  productTypes: data.productTypes || "N/A",
  regulatoryLabels: data.regulatoryLabels || "N/A",
});

export const getMedicationEnrichmentPrompt = (data: any) => {
  return `${MEDICATION_ENRICHMENT_STATIC_PROMPT}

Dados do medicamento para esta ficha:
${JSON.stringify(getMedicationEnrichmentData(data), null, 2)}

Gere a ficha clínica observacional para terapeutas respeitando exatamente o schema JSON obrigatório.`;
};
