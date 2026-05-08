
export const MEDICATION_ENRICHMENT_PROMPT_VERSION = "medication-enrichment-v3.1";

export const MEDICATION_ENRICHMENT_STATIC_PROMPT = `
Você está gerando uma ficha clínica de apoio para terapeutas que atendem pacientes em uso de medicação.

Objetivo:
Gerar conteúdo observacional, prudente e clinicamente útil para terapeutas. A ficha deve ajudar a terapeuta a:
1. reconhecer possíveis mudanças percebidas pelo paciente durante o acompanhamento;
2. formular perguntas melhores em sessão;
3. diferenciar sintomas do quadro clínico, efeitos percebidos, adesão irregular, eventos de vida e mudanças recentes no tratamento;
4. identificar sinais que podem merecer conversa do paciente com o médico prescritor;
5. alinhar observações clínicas com o prescritor quando houver consentimento do paciente;
6. registrar informações relevantes sem interpretar exames, diagnosticar reações adversas ou orientar conduta medicamentosa.

Público-alvo:
Terapeutas, psicólogos e profissionais de saúde mental que não estão prescrevendo a medicação.

Regras obrigatórias:
1. Não prescrever.
2. Não recomendar dose.
3. Não sugerir iniciar, reduzir, aumentar, trocar, interromper ou suspender medicamento.
4. Não afirmar causalidade como certeza.
5. Não substituir avaliação médica.
6. Não dar orientação farmacológica operacional.
7. Não usar linguagem alarmista.
8. Não escrever como bula técnica.
9. Não escrever para o paciente diretamente, exceto nas perguntas úteis, que devem ser formuladas como perguntas prontas para uso em sessão.
10. Não inventar informações específicas quando houver incerteza.
11. Não prometer melhora, resposta clínica ou benefício terapêutico.
12. Não usar frases como "indicado para" de forma prescritiva. Prefira "paciente em tratamento médico para" ou "contextos em que pode aparecer".
13. Usar linguagem de possibilidade e observação, como "pode aparecer", "pode estar associado", "vale observar", "pode ser útil investigar", "pode merecer alinhamento com o prescritor".
14. Quando houver possível risco relevante, formular como sinal de atenção clínica e não como diagnóstico.
15. Quando houver dúvida sobre uma informação específica, manter linguagem conservadora e observacional.
16. Não incluir detalhes de dose, posologia, ajuste, titulação ou conduta de interrupção.
17. Não listar interações medicamentosas de forma técnica, a menos que sejam traduzidas em perguntas ou situações úteis para a terapeuta.
18. Não transformar contraindicações, exames ou riscos médicos em instruções para a terapeuta manejar o tratamento.
19. Não repetir a mesma ideia com palavras diferentes apenas para preencher itens.

Critérios de qualidade:
1. Seja específico para a substância informada.
2. Evite frases genéricas aplicáveis a qualquer medicamento da mesma classe.
3. Antes de escrever, identifique mentalmente de 2 a 5 pontos distintivos do medicamento. Distribua esses pontos entre description, patientReports, sessionObservations, confoundingEffects, usefulQuestions, coordinationNotes ou attentionSignals.
4. Quando houver riscos físicos, cautelas ou interações relevantes, traduza para sinais observáveis, relatos do paciente ou situações que merecem conversa com o prescritor, sem linguagem de bula.
5. Evite saídas excessivamente positivas. Inclua melhora percebida, ausência de resposta percebida, piora subjetiva, desconfortos e ambivalências quando fizer sentido.
6. Priorize conteúdo observável em sessão ou relatável pelo paciente.
7. Inclua fatores que podem confundir a leitura clínica, como sono, ansiedade, adesão, álcool, outras medicações, sintomas do transtorno de base, eventos de vida e mudanças recentes.
8. Inclua perguntas abertas, não indutivas e clinicamente seguras.
9. Nas perguntas úteis, prefira perguntas que a terapeuta possa fazer diretamente ao paciente ou cuidador em sessão.
10. Evite perguntas em terceira pessoa, como "Como o paciente descreve...". Prefira "Como você descreveria..." ou "O que vocês perceberam...", quando houver cuidador.
11. Use português brasileiro claro, profissional e conciso.
12. Não use markdown.
13. Não inclua comentários.
14. Não inclua texto fora do JSON.
15. A saída deve ser JSON válido, parseável por JSON.parse.

Foco clínico para terapeutas:
1. Privilegie o que ajuda a escuta, a formulação clínica e o acompanhamento em sessão.
2. Evite excesso de mecanismo farmacológico.
3. Evite termos técnicos quando uma formulação clínica simples for suficiente.
4. Não transforme a ficha em resumo de bula.
5. O objetivo não é ensinar a manejar o medicamento, mas apoiar a observação clínica e a comunicação responsável.
6. Quando o medicamento tiver um risco específico importante, mencione apenas o que a terapeuta pode observar, perguntar ou registrar.
7. Para psicofármacos, considere quando aplicável: humor, sono, energia, ansiedade, cognição, libido, apetite, peso, ativação, sedação, impulsividade, adesão, risco suicida e funcionamento cotidiano.
8. Para medicamentos não psiquiátricos, foque em impactos subjetivos e funcionais que possam aparecer na psicoterapia, como dor, fadiga, sono, imagem corporal, humor, ansiedade, adesão e qualidade de vida.
9. Para medicamentos de uso altamente especializado, biológicos, neurológicos raros, oncológicos, imunológicos ou hospitalares, considere impacto da rotina de cuidado, procedimentos, equipe multiprofissional, cuidadores, escola, trabalho, autonomia e carga familiar.
10. Quando o paciente for frequentemente pediátrico, dependente, tiver limitação cognitiva, neurológica ou de comunicação, inclua perguntas que possam ser feitas ao cuidador ou responsável, sem presumir que o paciente consegue relatar tudo diretamente.
11. Quando o medicamento estiver associado a condições crônicas, raras ou incapacitantes, considere a diferença entre evolução da doença, efeito percebido, carga do tratamento, sofrimento familiar e eventos recentes.
12. Quando houver uso de cuidador ou familiar como informante, preserve linguagem ética e respeitosa, sem infantilizar o paciente.

Orientações por campo:
1. description:
   - Explique o medicamento em linguagem objetiva.
   - Inclua o que mais importa para a terapeuta observar.
   - Não soe como propaganda, bula ou recomendação médica.
   - Não inclua dose.
   - Evite mecanismo farmacológico detalhado, salvo se ele tiver relevância direta para a observação clínica.

2. clinicalContexts:
   - Liste contextos clínicos em que o medicamento pode aparecer.
   - Evite "indicado para".
   - Prefira formulações como "paciente em tratamento médico para..." ou "acompanhamento de quadros em que...".
   - Não transforme contexto em recomendação de uso.
   - Para medicamentos especializados, inclua contexto de cuidado contínuo, equipe multiprofissional, reabilitação, cuidador ou impacto familiar quando relevante.

3. patientReports:
   - Liste relatos que o paciente pode trazer espontaneamente ou após pergunta clínica.
   - Inclua tanto possíveis melhoras percebidas quanto desconfortos, dúvidas, ambivalências ou ausência de mudança percebida.
   - Não atribua automaticamente o relato ao medicamento.
   - Use linguagem como "relato de", "percepção de", "queixa de" ou "dúvida sobre".
   - Quando o paciente puder ter limitação de comunicação, inclua também percepções trazidas por cuidadores ou familiares.

4. sessionObservations:
   - Liste aspectos que a terapeuta pode observar em sessão.
   - Foque em sono, humor, energia, cognição, ativação, lentificação, ansiedade, adesão, funcionamento e segurança clínica quando relevante.
   - Não transforme observação em diagnóstico.
   - Não conclua causalidade medicamentosa.
   - Em quadros neurológicos, raros ou incapacitantes, inclua participação em sessão, comunicação, fadiga, tolerância à frustração, autonomia e impacto da rotina de cuidado quando relevante.

5. confoundingEffects:
   - Liste fatores que podem confundir a leitura clínica.
   - Inclua sintomas do transtorno de base, privação de sono, álcool, outras medicações, uso irregular, comorbidades e mudanças recentes.
   - Inclua confundidores específicos do medicamento quando existirem.
   - Não use este campo para listar efeitos adversos de bula sem relação com a sessão.
   - Em doenças crônicas, raras ou progressivas, considere evolução do quadro de base, procedimentos, reabilitação, dor, fadiga, estresse familiar e mudanças na rotina.

6. usefulQuestions:
   - Use perguntas abertas e não indutivas.
   - Escreva perguntas prontas para serem usadas em sessão.
   - Prefira perguntas diretas ao paciente, como "Como você percebeu..." ou "O que mudou...".
   - Quando houver cuidador ou responsável, use formulações como "O que vocês perceberam..." ou "Como a família tem observado...".
   - Não use perguntas em terceira pessoa do tipo "Como o paciente descreve...".
   - Não oriente dose, horário, interrupção ou troca.
   - Inclua perguntas sobre adesão, mudanças recentes, sono, sintomas físicos, álcool, outras medicações, segurança clínica, rotina de cuidado ou impacto familiar quando relevante.
   - As perguntas devem ser adequadas para uma terapeuta fazer em sessão.

7. coordinationNotes:
   - Liste situações em que pode ser útil alinhar observações com o prescritor, sempre com consentimento do paciente ou responsável.
   - Não diga que a terapeuta deve decidir conduta medicamentosa.
   - Inclua piora clínica, risco suicida, efeitos percebidos importantes, adesão irregular, sinais físicos relevantes ou possível ativação maniforme quando aplicável.
   - Prefira "pode merecer alinhamento com o prescritor" in vez de linguagem imperativa.
   - Para medicamentos especializados, considere também alinhamento com equipe multiprofissional, reabilitação, cuidadores ou escola quando clinicamente relevante.

8. attentionSignals:
   - Liste sinais que merecem cuidado clínico, investigação ou encaminhamento para avaliação médica.
   - Inclua sinais gerais relevantes a psicofármacos, como ideação suicida, autoagressão, piora abrupta, impulsividade incomum ou sinais de mania/hipomania quando aplicável.
   - Inclua sinais físicos específicos do medicamento quando forem clinicamente relevantes.
   - Para doenças neurológicas, raras ou graves, inclua perda abrupta de habilidades, alteração importante de consciência, mudança neurológica nova, regressão funcional ou piora rápida quando relevante.
   - Não diagnostique reação adversa.
   - Não use linguagem alarmista.

Formato obrigatório:
{
  "description": "Descrição objetiva do medicamento e do que importa para a terapeuta. Entre 80 e 700 caracteres.",
  "clinicalContexts": [
    "Contexto clínico em que esse medicamento costuma aparecer. Menos de 180 caracteres por item."
  ],
  "patientReports": [
    "Relatos que o paciente pode trazer em sessão. Menos de 180 caracteres por item."
  ],
  "sessionObservations": [
    "Aspectos que a terapeuta pode observar em sessão, sem concluir causalidade. Menos de 240 caracteres por item."
  ],
  "confoundingEffects": [
    "Fatores que podem confundir a leitura clínica. Menos de 280 caracteres por item."
  ],
  "usefulQuestions": [
    "Perguntas abertas, seguras e úteis para investigação clínica. Menos de 220 caracteres por item."
  ],
  "coordinationNotes": [
    "Situações em que pode ser útil alinhar observações com o prescritor, com consentimento do paciente. Menos de 260 caracteres por item."
  ],
  "attentionSignals": [
    "Sinais de atenção que merecem cuidado clínico ou encaminhamento para avaliação médica. Menos de 260 caracteres por item."
  ],
  "clinicalPhrase": "Frase curta que resuma o foco psicoterapêutico ao atender paciente em uso desse medicamento. Máximo de 180 caracteres."
}

Quantidade de itens:
- clinicalContexts: 3 a 6 itens.
- patientReports: 4 a 7 itens.
- sessionObservations: 4 a 7 itens.
- confoundingEffects: 4 a 7 itens.
- usefulQuestions: 5 a 8 itens.
- coordinationNotes: 3 a 6 itens.
- attentionSignals: 3 a 6 itens.

Validação final antes de responder:
1. A resposta é somente JSON?
2. Todas as chaves obrigatórias estão presentes?
3. Não há markdown?
4. Não há comentários?
5. Não há recomendação de dose ou ajuste medicamentoso?
6. A linguagem é observacional e não prescritiva?
7. O conteúdo usa de forma específica os dados do medicamento fornecido no final do prompt?
8. O texto evita viés positivo excessivo?
9. Há pelo menos 2 pontos distintivos do medicamento?
10. Os sinais de atenção são úteis para terapeuta, sem virar orientação médica?
11. O conteúdo ajuda a escuta clínica, em vez de apenas resumir uma bula?
12. As perguntas úteis estão formuladas como perguntas prontas para sessão?
13. Quando houver cuidador ou limitação de comunicação, o texto contempla essa possibilidade?
14. Para medicamentos especializados, o texto considera rotina de cuidado, equipe, procedimentos e carga familiar quando relevante?

Responda apenas com JSON válido seguindo exatamente este formato (mantenha as chaves em ingles).
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

// Backward compatibility
export const getMedicationEnrichmentPrompt = (data: any) => {
  return `${MEDICATION_ENRICHMENT_STATIC_PROMPT}

Dados do medicamento para esta ficha:
${JSON.stringify(getMedicationEnrichmentData(data), null, 2)}

Gere a ficha clínica observacional usando apenas estes dados como identificação do medicamento e respeitando exatamente o formato JSON obrigatório.`;
};