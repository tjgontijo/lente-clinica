export interface CommunicationTemplate {
  id: string;
  title: string;
  context: string;
  isAttention?: boolean;
  short?: string;
  medium?: string;
  formal?: string;
}

export interface InterviewScript {
  id: string;
  title: string;
  questions: string[];
}

export const COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  {
    id: "01",
    title: "Início de antidepressivo sem melhora",
    context: 'Paciente com 2-4 semanas de uso relata que "não está funcionando" e considera parar.',
    short: '"Paciente [iniciais], início de [medicação] há [x] dias. Sem resposta significativa ainda, mas sem piora. Adesão confirmada em sessão. Ideação ausente. Segue com [sintoma_principal]. Tudo bem manter?"',
    medium: '"Paciente [iniciais], [idade] anos, em uso de [medicação] há [x] dias por [diagnóstico]. Relata que não percebeu melhora e está considerando interromper por conta própria. Em sessão, confirmei adesão e ausência de ideação suicida. Sintomas atuais: [sintomas]. Sem piora em relação ao início. Fiz psicoeducação sobre latência terapêutica. Solicito orientação para sustentar adesão até próxima consulta."',
  },
  {
    id: "02",
    title: "Suspeita de embotamento emocional",
    context: 'Paciente relata não sentir mais nada: nem tristeza nem alegria: após início ou ajuste de antidepressivo. Terapia trava.',
    short: '"Paciente [iniciais] relata melhora da tristeza, mas ausência de reatividade emocional desde início de [medicação]. Terapia com dificuldade de acesso afetivo. Solicito avaliação."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] semanas. Refere melhora do humor deprimido, mas apresenta embotamento afetivo significativo: ausência de prazer, distanciamento dos vínculos e redução de reatividade emocional em sessão. A terapia perdeu profundidade: paciente concorda intelectualmente mas sem acesso emocional. Solicito reavaliação de conduta."',
  },
  {
    id: "03",
    title: "Suspeita de virada maníaca",
    isAttention: true,
    context: 'Paciente em uso de antidepressivo apresenta mudança abrupta de padrão: aceleração, redução de sono sem cansaço, impulsividade.',
    short: '"Paciente [iniciais] em uso de [medicação] há [x] semanas. Apresentou mudança abrupta: menos sono sem cansaço, aceleração, impulsividade. Solicito reavaliação urgente."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] semanas por episódio depressivo. Nesta semana apresentou mudança significativa de padrão: redução da necessidade de sono para [x] horas sem cansaço, aceleração do pensamento, [descrever comportamentos impulsivos]. Paciente refere sentir-se \'ótima\': mudança inconsistente com baseline. Solicito reavaliação com urgência."',
    formal: 'Prezado(a) Dr(a). [nome_psiquiatra],\n\nEncaminho atualização clínica de [iniciais], [idade] anos, em acompanhamento psicoterápico.\n\nPaciente em uso de [medicação] há [x] semanas por episódio depressivo. Na sessão de [data], apresentou mudança abrupta de padrão em relação às semanas anteriores: redução da necessidade de sono ([x] horas sem cansaço), aceleração do pensamento e do discurso, [comportamento_impulsivo_concreto], e relato de sensação de estar "ótima": inconsistente com o perfil habitual da paciente.\n\nA mudança de padrão merece reavaliação urgente, inclusive pela possibilidade de ativação maniforme. Solicito orientação de conduta.\n\nAtenciosamente,\n[meu_nome]',
  },
  {
    id: "04",
    title: "Suspeita de risco suicida",
    isAttention: true,
    context: 'Paciente verbaliza ideação passiva, ativa ou com plano. Nível de urgência varia.',
    short: '"Paciente [iniciais] relatou ideação de morte passiva em sessão hoje: desejo de não acordar, sem plano estruturado. Sem ideação ativa ou acesso a meios. Aumentei frequência de sessões. Solicito orientação."',
    medium: '"Paciente [iniciais], em sessão hoje relatou ideação de morte [ativa_ou_passiva]. [Com/sem] plano estruturado. [Com/sem] acesso a meios. Funcionamento atual: [descrever_funcionamento]. Rede de apoio: [rede_de_apoio]. Adesão à medicação: [confirmar_adesao]. Solicito orientação para conduta e possível reavaliação antes da próxima consulta programada."',
    formal: 'Dr(a). [nome_psiquiatra]: situação urgente.\n\nPaciente [iniciais], [idade] anos, verbalizou em sessão hoje plano suicida com intenção de ação. Relato: "[frase_literal_do_paciente]". [Tem/não tem] acesso ao meio. [Familiar acionado/não acionado].\nPaciente [permanece no consultório / foi acompanhado por familiar / foi encaminhado ao PS]. Solicito orientação imediata de conduta.\n\n[meu_nome]: [meu_telefone]',
  },
  {
    id: "05",
    title: "Oscilação emocional: bipolar vs borderline",
    isAttention: true,
    context: 'Paciente com instabilidade emocional intensa, diagnóstico incerto ou histórico de múltiplas medicações sem resposta.',
    medium: '"Paciente [iniciais], [idade] anos, em acompanhamento psicoterápico. Apresenta instabilidade emocional intensa com oscilações rápidas: [descrever_horas_ou_dias]: associadas predominantemente a contextos relacionais. Histórico de [x] medicações sem resposta sustentada. Em sessão, observo padrão que pode ser relevante para diferenciar ciclagem de humor de instabilidade relacional. Solicito avaliação diagnóstica integrada."',
    formal: 'Prezado(a) Dr(a). [nome_psiquiatra],\n\nEncaminho observação clínica de [iniciais], [idade] anos.\n\nEm acompanhamento semanal, observo instabilidade emocional com oscilações de humor que ocorrem em horas: não em dias ou semanas: predominantemente precipitadas por conflitos ou percepção de abandono em relacionamentos. Histórico de [x] medicações com resposta limitada. Padrão de idealização e desvalorização presente no vínculo terapêutico.\n\nConsiderando o perfil observado em sessão, solicito reavaliação diagnóstica integrada, especialmente para diferenciar ciclagem de humor de instabilidade relacional persistente.\n\nAtenciosamente,\n[meu_nome]',
  },
  {
    id: "06",
    title: "Suspeita de TDAH não diagnosticado",
    context: 'Paciente com queixa de ansiedade e resposta parcial a antidepressivos. Terapeuta observa desatenção desde infância.',
    short: '"Paciente [iniciais] com queixa de ansiedade e resposta parcial a antidepressivos. Em sessão, observo dificuldade atencional desde a infância, desorganização crônica e procrastinação por dificuldade de ativação. Solicito avaliação diagnóstica considerando essa possibilidade."',
    medium: '"Paciente [iniciais], [idade] anos, em tratamento para ansiedade com [medicação]. Resposta parcial: tensão melhorou, mas sobrecarga funcional persiste. Em sessão, observo dificuldade atencional desde a infância relatada pela própria paciente, desorganização crônica, procrastinação por dificuldade de iniciação (não por desmotivação), esforço compensatório massivo para manter rotinas básicas, e ansiedade possivelmente secundária à disfunção executiva. Solicito avaliação diagnóstica considerando essa possibilidade."',
  },
  {
    id: "07",
    title: "Suspeita de TOC",
    context: 'Em sessão, observo pensamentos intrusivos egodistônicos e rituais.',
    short: '"Paciente [iniciais] com ansiedade. Em sessão, observo pensamentos intrusivos egodistônicos seguidos de comportamentos repetitivos para aliviar angústia. Resposta parcial ao tratamento atual. Solicito reavaliação diagnóstica e de conduta."',
    medium: '"Paciente [iniciais], [idade] anos, em tratamento para ansiedade com [medicação] há [x] semanas. Resposta parcial. Em sessão, observo um ciclo repetitivo: [descrever_pensamento_intrusivo] gera angústia intensa, aliviada temporariamente por [descrever_comportamento_repetitivo]. Paciente reconhece irracionalidade, mas não consegue interromper. Solicito reavaliação diagnóstica e de conduta."',
  },
  {
    id: "08",
    title: "Suspeita de TEPT",
    context: 'Em sessão, revelou evento traumático não investigado anteriormente. Padrão de hipervigilância, pesadelos e evitação.',
    short: '"Paciente [iniciais] em tratamento para ansiedade sem resposta adequada. Em sessão, revelou evento traumático não investigado anteriormente. Padrão atual: hipervigilância, pesadelos, evitação: sugere TEPT. Solicito reavaliação."',
    medium: '"Paciente [iniciais], [idade] anos, em tratamento para [diagnóstico] com [medicação] há [x] meses. Resposta limitada. Em sessão, a paciente revelou pela primeira vez [descrever_evento_traumático_sem_detalhes_desnecessários] ocorrido há [x] anos. Sintomas atuais: hipervigilância constante, pesadelos recorrentes, evitação de estímulos associados ao evento e reatividade intensa: são consistentes com TEPT. Avalio que o quadro principal pode ser traumático, não ansiogênico. Solicito reavaliação diagnóstica e de conduta medicamentosa."',
  },
  {
    id: "09",
    title: "Possível acatisia",
    context: 'Após início da medicação, relata inquietação motora intensa, impossibilidade de ficar parada.',
    short: '"Paciente [iniciais] em início de [medicação] há [x] dias. Refere inquietação motora intensa, incapacidade de permanecer parada: diferente da ansiedade habitual. Iniciou após medicação. Solicito reavaliação pela possibilidade de acatisia."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] dias. Relatou piora na última semana, mas com padrão diferente da ansiedade prévia: inquietação predominantemente corporal, incapacidade de permanecer parada, desconforto interno sem conteúdo cognitivo ansioso. Sintomas iniciaram após início da medicação. Solicito reavaliação pela possibilidade de acatisia: paciente considera interromper tratamento por desconforto."',
  },
  {
    id: "10",
    title: "Sinais de psicose inicial",
    isAttention: true,
    context: 'Nas últimas sessões, paciente com ansiedade/isolamento apresenta discurso vago e ideias de referência.',
    short: '"Paciente [iniciais], [idade] anos, em acompanhamento por ansiedade e isolamento. Nas últimas sessões, observo: discurso progressivamente mais vago, dificuldade de completar raciocínios, relato de \'sensação de que as coisas estão estranhas\' e possíveis ideias de referência: [descrever]. Uso regular de [cannabis_ou_substancia]. Solicito avaliação psiquiátrica urgente."',
    formal: 'Prezado(a) Dr(a). [nome_psiquiatra],\n\nEncaminho avaliação clínica urgente de [iniciais], [idade] anos.\n\nPaciente em acompanhamento semanal por ansiedade e isolamento social. Nas últimas [x] sessões, observo deterioração progressiva: discurso mais vago e tangencial, perda do fio do raciocínio no meio das frases, relato de estranhamento da realidade ("as coisas estão diferentes, não sei explicar"), e possíveis ideias de referência ([descrever]). Uso regular de [cannabis_ou_substancia].\n\nPelas mudanças observadas e pelo risco de agravamento, solicito avaliação com urgência.\n\nAtenciosamente,\n[meu_nome]',
  },
  {
    id: "11",
    title: "Suspeita de condição orgânica",
    context: 'Paciente não responde e apresenta sinais físicos que podem sugerir hipotiroidismo, deficiência B12, etc.',
    short: '"Paciente [iniciais] com [diagnóstico] sem resposta adequada ao tratamento. Apresenta sinais físicos associados: [descrever_sinais_físicos: queda de cabelo, tremor, etc.] que podem justificar avaliação médica. Solicito reavaliação considerando possível componente orgânico."',
    medium: '"Paciente [iniciais], [idade] anos, em tratamento para [diagnóstico] há [x] meses com resposta parcial. Em sessão, além dos sintomas emocionais, relata [descrever_sinais_físicos]. A combinação de sintomas psiquiátricos com sinais físicos específicos sugere possível componente orgânico subjacente: [hipóteses]. Solicito avaliação e investigação laboratorial pertinente."',
  },
  {
    id: "12",
    title: "Dependência de benzodiazepínico",
    context: 'Uso diário prolongado, tolerância, sintomas de abstinência confundidos com recaída.',
    short: '"Paciente [iniciais] em uso diário de [medicação_benzo] há [x] [meses_anos]. Relata tolerância e dificuldade de interrupção. Solicito avaliação para plano de retirada gradual."',
    medium: '"Paciente [iniciais], em uso de [medicação_benzo] há [x] meses de forma diária. Relata que o efeito diminuiu com o tempo (tolerância), dificuldade de ficar sem o remédio (sintomas de abstinência que interpreta como recaída), e possível impacto cognitivo: [descrever_queixas]. Paciente não percebe padrão como dependência. Solicito avaliação para plano de desmame gradual supervisionado."',
  },
  {
    id: "13",
    title: "Disfunção sexual por medicação",
    context: 'Impacto colateral significativo (redução de libido, anorgasmia) afetando autoimagem e relacionamento.',
    short: '"Paciente [iniciais] em uso de [medicação] há [x] meses. Relata disfunção sexual significativa desde o início: [redução de libido / dificuldade erétil / anorgasmia]. Considera interromper. Solicito reavaliação."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] meses. Após construção de vínculo terapêutico, relatou disfunção sexual significativa desde o início da medicação: [descrever]. Impacto relevante na relação afetiva e na autoimagem. Paciente está considerando interromper o tratamento por conta própria. Solicito reavaliação de conduta: o abandono desassistido representa risco de recaída."',
  },
  {
    id: "14",
    title: "Polimedicação com piora global",
    isAttention: true,
    context: 'Uso concomitante de vários psicofármacos gerando sobreposição de colaterais.',
    medium: '"Paciente [iniciais], [idade] anos, em uso de [listar_medicações] prescritas por [x] profissionais ao longo de [x] anos. Apresenta fadiga crônica, prejuízo cognitivo, embotamento afetivo e ganho de peso: sintomas que podem estar relacionados à sobreposição de efeitos colaterais, não ao quadro primário. Solicito revisão integrada da prescrição por um único profissional."',
    formal: 'Prezado(a) Dr(a). [nome_psiquiatra],\n\nEncaminho avaliação clínica de [iniciais], [idade] anos, em acompanhamento psicoterápico.\n\nPaciente em uso concomitante de: [listar_medicações_e_doses]. Medicações prescritas por diferentes profissionais em momentos distintos, sem revisão integrada.\n\nEm sessão, relata: fadiga desproporcional, prejuízo significativo de memória e concentração, embotamento afetivo e ganho de peso de [x] kg no período. A combinação de efeitos colaterais das medicações atuais pode estar produzindo ou agravando os sintomas que o tratamento visa tratar.\n\nSolicito revisão integrada da prescrição com objetivo de simplificação e avaliação de necessidade real de cada medicamento.\n\nAtenciosamente,\n[meu_nome]',
  },
  {
    id: "15",
    title: "Paciente quer parar a medicação: momento adequado",
    context: 'Estável, sem recaídas e funcional, quer avaliar desmame.',
    short: '"Paciente [iniciais] estável há [x] meses. Solicita avaliação para retirada gradual do antidepressivo. Bom suporte psicoterapêutico. Sugiro avaliarmos juntos a viabilidade."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] meses. Estável há [x] meses: funcional, sem recaídas, com bom suporte psicoterapêutico. Manifesta desejo de avaliar possibilidade de retirada gradual. Orientei que a decisão e o processo são médicos, e que a retirada deve ser gradual. Solicito avaliação conjunta para planejar desmame se indicado."',
  },
  {
    id: "16",
    title: "Paciente quer parar a medicação: momento inadequado",
    context: 'Estabilização muito recente, paciente já quer parar.',
    short: '"Paciente [iniciais] com [x] semanas de estabilização quer interromper [medicação]. Orientei sobre riscos. Solicito reforço da orientação sobre tempo mínimo de manutenção na próxima consulta."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] meses, com estabilização recente de [x] semanas. Manifesta desejo de interromper o tratamento: motivação: [motivação]. Orientei sobre o risco de recaída precoce e sobre o tempo mínimo de manutenção após estabilização. Paciente considerou, mas mantém desejo. Solicito que na próxima consulta seja reforçada a orientação sobre continuidade: o alinhamento médico-terapeuta aumenta adesão."',
  },
  {
    id: "17",
    title: "Paciente já parou a medicação por conta própria",
    context: 'Sintomas de descontinuação.',
    short: '"Paciente [iniciais] interrompeu [medicação] abruptamente há [x] dias. Apresenta [sintomas: tontura, brain zaps, irritabilidade]. Orientei sobre síndrome de descontinuação. Solicito reavaliação urgente."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] meses, interrompeu abruptamente há [x] dias sem orientação médica. Apresenta em sessão: [descrever_sintomas]. Quadro pode ser compatível com síndrome de descontinuação. Orientei retorno ao acompanhamento médico e não interpretei os sintomas como recaída sem avaliação. Solicito avaliação urgente."',
  },
  {
    id: "18",
    title: "Crise aguda em sessão",
    isAttention: true,
    context: 'Verbalização aguda de suicídio, descompensação psicótica.',
    short: '"Paciente [iniciais] em sessão agora. [Verbalização de plano suicida / Descompensação psicótica / descrever]. Solicito orientação imediata de conduta."',
    medium: '"Paciente [iniciais] em sessão hoje apresentou [descrever_crise]. [Familiar acionado / aguardando orientação / encaminhando ao PS]. Solicito contato urgente."',
    formal: 'Prezado(a) Dr(a). [nome_psiquiatra],\n\nRegistro do ocorrido em sessão de [data]:\n\nPaciente [iniciais] apresentou [descrever_o_que_aconteceu_crise_verbalizacao_comportamento]. Conduta adotada: [descrever_o_que_foi_feito_familiar_acionado_SAMU_etc]. Estado ao fim da sessão: [descrever].\n\nSolicito alinhamento de conduta para os próximos passos.\n\n[meu_nome]: [meu_telefone]',
  },
  {
    id: "19",
    title: "Suspeita de uso de substâncias",
    context: 'Possível interferência de álcool/drogas/anabolizantes na eficácia do tratamento.',
    short: '"Paciente [iniciais] sem evolução em [x] meses de tratamento. Em sessão, revelou uso regular de [substância_e_padrão]. Possível interferência na resposta medicamentosa. Solicito reavaliação considerando esse contexto."',
    medium: '"Paciente [iniciais], em uso de [medicação] há [x] meses com resposta inadequada. Em sessão, após construção de vínculo, relatou uso regular de [substâncias_frequência_quantidade]. Paciente autorizou comunicação. O uso relatado pode estar interferindo na resposta ao tratamento. Solicito reavaliação considerando esse contexto."',
  },
  {
    id: "20",
    title: "Psiquiatra trocou medicação: acompanhamento",
    context: 'Observação após troca de dosagem ou nova prescrição.',
    short: '"Paciente [iniciais] após troca de dose de [medicação] há [x] dias. Observo em sessão: [descrever_mudança]. Solicito orientação se esperado nessa fase."',
    medium: '"Paciente [iniciais], após [troca / ajuste] de [medicação] para [dose] há [x] dias. Em sessão, observo as seguintes mudanças em relação ao período anterior: [descrever_agitação_sono_humor_etc]. Gostaria de saber se o padrão é esperado nessa fase de transição ou se merece atenção clínica. Isso me ajuda a orientar melhor o paciente nas sessões e saber o que monitorar."',
  },
  {
    id: "21",
    title: "Paciente resistente a buscar psiquiatra",
    context: 'Encaminhamento formal quando paciente recusa avaliação.',
    formal: 'Prezado(a) Colega Médico,\n\nEncaminho [iniciais], [idade] anos, para avaliação psiquiátrica.\n\nPaciente em acompanhamento psicoterápico desde [data]. Apresenta [descrever_quadro_clinico_em_linguagem_simples]. Em sessão, observo [descrever_o_que_justifica_avaliacao]. Avaliação psiquiátrica se faz necessária para [descrever_objetivo_diagnostico_diferencial_medicacao_etc].\n\nAgradeço contato para alinhamento de conduta.\n\n[meu_nome]: [meu_telefone_contato]',
    short: '("Eu percebi algumas coisas nas nossas sessões que acho importante investigar com mais profundidade. Não estou dizendo que você precisa de remédio. Estou dizendo que faz sentido ter uma avaliação: assim a gente sabe o que está diante de nós e pode trabalhar melhor juntos. Você toparia ir uma vez, só para ouvir?")',
  },
];

export const INTERVIEW_SCRIPTS: InterviewScript[] = [
  {
    id: "i1",
    title: "Início ou troca de antidepressivo",
    questions: [
      "Quando a medicação começou? Houve aumento, redução ou troca recente?",
      "O paciente está tomando todos os dias? Em qual horário?",
      "O que mudou em sono, apetite, energia, ansiedade e funcionamento?",
      "Houve piora rápida, agitação, inquietação corporal ou ideação suicida?",
      "O paciente quer parar por impaciência, efeito colateral ou medo?",
      "O que é igual ao quadro inicial e o que apareceu depois da medicação?",
    ],
  },
  {
    id: "i2",
    title: "Suspeita de embotamento emocional",
    questions: [
      "A tristeza diminuiu ou todas as emoções ficaram mais baixas?",
      "O paciente sente prazer, irritação, desejo, afeto e conexão?",
      "A vida está melhorando ou apenas ficou mais 'neutra'?",
      "A terapia perdeu acesso emocional depois da medicação ou ajuste?",
      "O paciente está pensando em parar o remédio por se sentir anestesiado?",
    ],
  },
  {
    id: "i3",
    title: "Suspeita de ativação ou hipomania",
    questions: [
      "O paciente está dormindo menos porque não consegue ou porque não sente necessidade?",
      "No dia seguinte, há cansaço ou energia aumentada?",
      "Há aceleração de fala, pensamento ou decisões?",
      "Houve gastos, conflitos, impulsividade sexual, projetos excessivos ou exposição a risco?",
      "Alguém próximo percebeu que ele está diferente?",
      "Essa mudança parece melhora estável ou uma mudança abrupta de padrão?",
    ],
  },
  {
    id: "i4",
    title: "Trauma, dissociação ou TEPT",
    questions: [
      "Existe algum evento que o paciente evita tocar ou lembrar?",
      "Há pesadelos, flashbacks, hipervigilância ou sobressalto exagerado?",
      "O paciente evita lugares, pessoas, assuntos ou sensações corporais específicas?",
      "Quando dissocia, ele sabe onde está? Quanto tempo dura?",
      "O sintoma piora quando certos temas aparecem na sessão?",
      "O paciente autorizou que esse contexto seja mencionado ao psiquiatra?",
    ],
  },
  {
    id: "i5",
    title: "Paciente quer parar a medicação",
    questions: [
      "Por que ele quer parar agora?",
      "Está estável há quanto tempo?",
      "Já tentou parar antes? O que aconteceu?",
      "A decisão vem de melhora real, efeito colateral, vergonha, medo ou pressão externa?",
      "Ele conversou com o psiquiatra antes de alterar dose ou suspender?",
      "O que precisa ser alinhado para não haver retirada abrupta?",
    ],
  },
  {
    id: "i6",
    title: "Uso de substâncias",
    questions: [
      "Usa álcool, cannabis, estimulantes, calmantes sem prescrição, anabolizantes ou suplementos?",
      "Qual frequência, quantidade e contexto de uso?",
      "Usa para dormir, relaxar, render, socializar ou não sentir?",
      "O uso piora sono, humor, ansiedade, impulsividade ou adesão?",
      "O paciente contou isso ao psiquiatra?",
      "Ele autoriza que essa informação seja compartilhada?",
    ],
  },
  {
    id: "i7",
    title: "Possível componente clínico/orgânico",
    questions: [
      "Houve mudança de peso, pele, cabelo, intestino, ciclo menstrual ou libido?",
      "Há tremor, palpitação, sudorese, formigamento, fraqueza ou tontura?",
      "O cansaço parece emocional, corporal ou os dois?",
      "O quadro não responde apesar de adesão e acompanhamento adequado?",
      "O paciente tem acompanhamento médico clínico recente?",
      "Faz sentido sugerir avaliação médica sem afirmar causa?",
    ],
  },
];
