export const MEDICATION_ENRICHMENT_PROMPT_VERSION =
  "medication-enrichment-v5.0";

export const MEDICATION_ENRICHMENT_STATIC_PROMPT = `
Você está gerando uma ficha clínica para um manual destinado a TERAPEUTAS (psicólogos e psicoterapeutas) que atendem pacientes medicados em consultório.

O destinatário é o terapeuta em sessão semanal ou quinzenal, não é manual multiprofissional, não é manual para prescritor.

Propósito do manual:
O terapeuta abre a ficha quando soube que o paciente começou ou está em uso de uma determinada medicação. Ele quer saber:
1. O que pode aparecer na sessão (não na consulta médica, não no laboratório).
2. Como diferenciar efeito do medicamento, evolução do quadro, eventos de vida e adesão irregular.
3. Quais perguntas-chave ajudam a discriminar hipóteses clínicas na própria sessão.
4. Em que situações vale comunicar o médico assistente.
5. Quais sinais merecem ação imediata.

Princípios não-negociáveis:

1. Não prescrever, recomendar dose, sugerir início, troca, redução, aumento ou suspensão de medicamento.
2. Não afirmar causalidade como certeza.
3. Não usar linguagem de bula, não listar efeitos adversos por sistema, não detalhar mecanismo farmacológico.
4. Não escrever para o paciente. Escrever para o terapeuta.
5. Não posicionar o terapeuta como intermediário entre paciente e médico nem como educador farmacológico.
6. Toda pergunta gerada deve ser fechável pelo terapeuta dentro da própria competência: ouvir, observar, registrar, comunicar ao médico. Se a pergunta exigir que o terapeuta dê, em resposta, informação técnica sobre o medicamento (tempo de efeito, mecanismo, dose, ajustes, interações), ela não pertence a este manual.
7. Não inventar quando houver incerteza. Manter linguagem conservadora e observacional.
8. Linguagem observacional, prudente, não-alarmista.
9. Não substituir avaliação médica.
10. Não incluir detalhes de dose, posologia, ajuste, titulação, equivalência ou retirada.

Voz e registro:

1. Sóbrio, profissional, clínico-experiente. Como um colega mais sênior compartilhando observação clínica, não como bula nem como blog.
2. Português brasileiro claro e conciso.
3. Pode usar vocabulário psicoterápico próprio do terapeuta: linha de base, padrão da sessão, vínculo terapêutico, acesso afetivo, elaboração, reatividade emocional, baseline, ego-distônico, ego-sintônico, contratransferência, quando forem o termo adequado.
4. Evitar vocabulário-tique de abertura formulaica. Não começar frases repetidamente com "Relato de", "Queixa de", "Percepção de", "Dúvida sobre". Variar sujeito gramatical e estrutura sintática. A prudência epistêmica deve aparecer no conteúdo, não em fórmulas de abertura.
5. Manter prudência com expressões como "pode aparecer", "costuma", "em parte dos pacientes", "tende a", "vale observar", sem transformá-las em tique repetitivo.
6. Quando houver janela temporal clínica conhecida (efeito terapêutico esperado em N semanas, atenção redobrada nas primeiras N semanas, descontinuação após N dias, estabilização após N meses), incluí-la explicitamente na description. Janelas temporais são parte central do que este manual entrega ao terapeuta.

Calibração por relevância clínica no consultório de terapia:

Antes de escrever, classifique mentalmente o medicamento em uma destas três categorias:

Categoria A — Alta frequência no consultório de terapia:
Psicofármacos de uso comum: ISRSs, ISRSNs, antidepressivos atípicos, estabilizadores de humor, antipsicóticos, benzodiazepínicos, hipnóticos, estimulantes para TDAH, lítio, alguns anticonvulsivantes em uso psiquiátrico. O terapeuta encontra esses pacientes frequentemente.
Ficha rica: 5 a 7 domínios clínicos, descrição com janelas temporais detalhadas, perguntas e cenários abundantes.

Categoria B — Média frequência:
Medicamentos não-psiquiátricos que podem impactar saúde mental e aparecer no relato em sessão: corticoides sistêmicos, isotretinoína, betabloqueadores, hormônios tireoidianos, anticoncepcionais hormonais, terapia hormonal, anti-histamínicos sedativos, opioides em uso crônico, anticonvulsivantes fora de uso psiquiátrico, antirretrovirais, imunossupressores comuns, quimioterápicos comuns.
Ficha intermediária: 3 a 5 domínios, foco em impactos subjetivos perceptíveis na sessão (humor, sono, ansiedade, cognição, imagem corporal, sexualidade, adesão).

Categoria C — Baixa frequência:
Medicamentos altamente especializados que o terapeuta dificilmente encontrará: terapias enzimáticas, biológicos para doenças raras, oncológicos específicos, imunossupressores de uso restrito, medicamentos hospitalares.
A ficha muda de foco: não é mais sobre o medicamento, é sobre como o paciente em tratamento contínuo para a condição de base aparece na sessão (carga do tratamento, impacto na rotina e identidade, sofrimento associado à condição, relação com a equipe médica, sustentação do vínculo terapêutico em meio à doença crônica).
Ficha enxuta: 2 a 3 domínios, descrição curta centrada no contexto clínico do paciente.

Orientações por campo:

1. description (string, parágrafo único em prosa):
Entre 400 e 900 caracteres. Estrutura típica: o que é o medicamento em uma frase, em que quadros costuma aparecer, janelas temporais relevantes para o terapeuta acompanhar (quando esperar efeito, quando há atenção redobrada, padrão de descontinuação se relevante), e o ponto central de observação na sessão. Para medicamentos da categoria C, o foco da descrição muda para o paciente em acompanhamento contínuo da condição e o que isso traz para o consultório, não para o medicamento em si.

2. clinicalDomains (array de objetos {name, content}):
Quantidade conforme calibração: categoria A com 5 a 7 domínios, categoria B com 3 a 5, categoria C com 2 a 3.
Cada domínio é um parágrafo coeso em prosa, entre 2 e 5 frases, que integra organicamente: o que pode aparecer no relato do paciente, o que o terapeuta pode observar na sessão, e o que pode confundir a leitura (evolução do quadro de base, eventos de vida, outras medicações, adesão irregular). A integração desses três planos no mesmo parágrafo é o que distingue este campo de uma lista.
Nome do domínio: curto, entre 1 e 4 palavras, específico e evocativo do que o terapeuta vai querer encontrar via bookmark no PDF.
Os domínios devem ser ESCOLHIDOS conforme o que é central para este medicamento específico, não preenchidos a partir de um conjunto fixo. Sertralina enfatiza sexualidade e descontinuação; bupropiona enfatiza ativação, ansiedade inicial e sono; clozapina enfatiza sedação, sialorreia e adesão; metilfenidato enfatiza apetite, sono e oscilação ao longo do dia; isotretinoína enfatiza humor e ideação suicida; corticoides enfatizam oscilação de humor e ativação. Cada medicamento tem domínios próprios.
Domínios candidatos típicos para psicofármacos (use apenas os relevantes): Sono; Apetite e peso; Humor; Ansiedade; Ativação e energia; Embotamento afetivo; Sexualidade; Cognição; Sedação; Tolerabilidade inicial; Adesão e descontinuação; Sinais físicos específicos.
Domínios candidatos para medicamentos não-psiquiátricos: Humor; Ansiedade; Sono; Imagem corporal e autoestima; Cognição; Sexualidade; Adesão; Carga do tratamento.
Domínios candidatos para categoria C: Carga do tratamento; Vínculo com a equipe médica; Sofrimento associado à condição; Funcionalidade e identidade; Sustentação do trabalho terapêutico.
Cada domínio deve trazer informação distinta dos outros. Não criar dois domínios que dizem essencialmente a mesma coisa sob ângulos diferentes.

3. sessionDiscriminationQuestions (array de strings):
Entre 3 e 6 perguntas. Cada pergunta serve para DISCRIMINAR hipóteses clínicas concorrentes na sessão. Não são perguntas de escuta ampla.
O gesto cognitivo de cada pergunta é discriminar entre, por exemplo: acatisia versus ansiedade habitual; embotamento afetivo versus melhora real do humor; virada maniforme versus bem-estar legítimo; síndrome de descontinuação versus recaída; sedação medicamentosa versus piora depressiva; efeito sexual versus desinteresse afetivo pelo parceiro; oscilação intra-dia versus instabilidade de humor.
Cada pergunta é UMA pergunta que o terapeuta pode fazer diretamente ao paciente na sessão. Formulada em segunda pessoa, aberta mas com foco discriminativo claro.
Cada pergunta deve passar no teste de fechamento: após o paciente responder, o terapeuta deve conseguir fazer algo com a resposta (observar, registrar, comunicar ao médico) sem precisar dar informação técnica em troca. Nenhuma pergunta pode posicionar o terapeuta como intermediário entre paciente e médico, nem exigir que o terapeuta responda informação farmacológica.

4. communicationScenarios (array de strings):
Entre 3 e 6 cenários. Cada cenário é uma situação clínica que, se identificada na sessão, pode justificar comunicação com o médico assistente.
Formulação em 1 ou 2 frases: condição observável + razão clínica clara. Linguagem prudente, sem imperativo. Forma típica: "Quando o paciente [observação concreta na sessão], pode valer alinhar com o psiquiatra para [razão clínica]".
Selecionar os cenários com maior valor clínico para este medicamento, não listar todos os efeitos possíveis. Adesão irregular, efeitos que motivam abandono silencioso, possível virada de humor, sinais físicos relevantes, descontinuação por conta própria, e ausência de resposta após o período esperado costumam ser candidatos comuns.

5. attentionSignals (array de objetos {level, signal, action}):
Entre 3 e 6 sinais. Cada sinal tem três campos:
- level: "amarelo" (alinhar com o psiquiatra em dias, não semanas) ou "vermelho" (agir hoje: acionar psiquiatra, rede de apoio e emergência quando necessário).
- signal: descrição concreta do que aparece na sessão, em uma frase. Linguagem observacional, sem diagnóstico, sem termo técnico desnecessário.
- action: o que o terapeuta faz quando reconhece esse sinal, em uma frase, em linguagem operacional clara.
Para antidepressivos: incluir sinal relacionado a ideação suicida nas primeiras semanas, especialmente em adolescentes e adultos jovens. Para antidepressivos em pacientes com possível vulnerabilidade bipolar: incluir sinal de virada maniforme. Para medicamentos com risco de síndrome serotoninérgica, síndrome neuroléptica maligna, intoxicação por lítio, agranulocitose por clozapina, e quadros análogos: traduzir o risco em sinais OBSERVÁVEIS na sessão, não em terminologia de bula. Para medicamentos com descontinuação clinicamente relevante: incluir sinal. Para corticoides, isotretinoína e medicamentos com impacto neuropsiquiátrico documentado: incluir sinal específico.
Linguagem sóbria. Nunca alarmista. O nível amarelo ou vermelho calibra a urgência real, não a gravidade do diagnóstico teórico.

6. clinicalPhrase (string):
Uma frase única, máximo 180 caracteres, que sintetiza o foco clínico principal ao acompanhar um paciente em uso deste medicamento na terapia. Pode funcionar como subtítulo da ficha no PDF.

Schema JSON obrigatório:

{
  "description": "string",
  "clinicalDomains": [
    { "name": "string", "content": "string" }
  ],
  "sessionDiscriminationQuestions": ["string"],
  "communicationScenarios": ["string"],
  "attentionSignals": [
    { "level": "amarelo" | "vermelho", "signal": "string", "action": "string" }
  ],
  "clinicalPhrase": "string"
}

Validação final antes de responder:

1. A resposta é APENAS JSON válido, parseável por JSON.parse, sem markdown, sem comentários, sem texto antes ou depois?
2. Todas as chaves obrigatórias estão presentes e em inglês?
3. A description tem janela temporal explícita quando aplicável ao medicamento?
4. Cada item de clinicalDomains é um parágrafo coeso em prosa, e não uma lista disfarçada ou um conjunto de bullets concatenados?
5. Cada domínio traz informação distinta dos demais?
6. Os domínios escolhidos refletem o que é central para ESTE medicamento, não um conjunto padrão aplicado a todos?
7. Cada pergunta em sessionDiscriminationQuestions discrimina hipóteses concorrentes, e não é apenas escuta clínica geral?
8. Cada pergunta passa no teste de fechamento: o terapeuta consegue fazer algo com a resposta dentro da própria competência?
9. Nenhuma pergunta posiciona o terapeuta como intermediário entre paciente e médico?
10. Nenhuma pergunta exige que o terapeuta responda informação farmacológica (tempo de efeito, dose, mecanismo, ajustes)?
11. Em attentionSignals, cada nível (amarelo ou vermelho) está calibrado pela urgência real da ação clínica, não pela gravidade do diagnóstico teórico?
12. A voz alterna sujeitos gramaticais e estruturas? Evita repetição formulaica de "Relato de", "Queixa de", "Percepção de" como abertura de frase?
13. O conteúdo é específico para esta substância, ou poderia ser aplicado genericamente a qualquer medicamento da mesma classe?
14. Para medicamentos da categoria C, o foco está no paciente em tratamento contínuo da condição de base, e não em efeitos do medicamento per se?
15. A linguagem é observacional, prudente, não-alarmista, sem orientação prescritiva, sem certezas de causalidade?
16. A ficha ajuda o terapeuta a observar, discriminar e comunicar, em vez de tentar ensinar farmacologia?

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

Gere a ficha clínica observacional para terapeutas usando apenas estes dados como identificação do medicamento e respeitando exatamente o schema JSON obrigatório.`;
};
