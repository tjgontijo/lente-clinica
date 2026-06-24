export interface CommunicationTemplate {
  id: string;
  title: string;
  context: string;
  isAttention?: boolean;
  short?: string;
  medium?: string;
  formal?: string;
  scriptId?: string;
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
    context:
      'Paciente com 2-4 semanas de uso relata que "não está funcionando" e considera parar.',
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nPasso para atualizar sobre [o_a_paciente] [iniciais], que iniciou [medicação] há [x] dias. [Ele_Ela] refere não perceber melhora significativa ainda, mas sem piora clínica. A adesão foi confirmada em sessão e a ideação suicida está ausente. [O_A_paciente] segue com [sintoma_principal]. Tudo bem mantermos a conduta por mais algum tempo?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para trazer uma atualização sobre [o_a_paciente] [iniciais], [idade] anos, em uso de [medicação] há [x] dias por [diagnóstico]. [Ele_Ela] relatou em sessão que não percebeu melhora e está considerando interromper a medicação por conta própria. Confirmei a adesão correta e a ausência de ideação suicida. No momento, o quadro principal se apresenta com: [sintomas], sem piora em relação ao início. Realizei psicoeducação sobre a latência terapêutica e solicito sua orientação para nos ajudar a sustentar a adesão até a próxima consulta.",
    scriptId: "i1",
  },
  {
    id: "02",
    title: "Suspeita de embotamento emocional",
    context:
      "Paciente relata não sentir mais nada (nem tristeza nem alegria) após início ou ajuste de antidepressivo. Terapia trava.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nGostaria de compartilhar uma observação sobre [o_a_paciente] [iniciais]. [Ele_Ela] refere melhora da tristeza, mas queixa-se de ausência de reatividade emocional (embotamento) desde o início de [medicação]. Em sessão, percebo bastante dificuldade de acesso afetivo na terapia. Avalia reajustar a conduta?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], em uso de [medicação] há [x] semanas. [Ele_Ela] refere melhora do humor deprimido, mas apresenta embotamento afetivo significativo: ausência de prazer, distanciamento dos vínculos e redução relevante de reatividade emocional em sessão. A terapia perdeu profundidade (o trabalho está muito intelectualizado, sem acesso emocional). Solicito reavaliação clínica quanto a essa queixa.",
    scriptId: "i2",
  },
  {
    id: "03",
    title: "Suspeita de virada maníaca",
    isAttention: true,
    context:
      "Paciente em uso de antidepressivo apresenta mudança abrupta de padrão: aceleração, redução de sono sem cansaço, impulsividade.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nAlerta importante sobre [o_a_paciente] [iniciais], em uso de [medicação] há [x] semanas. Apresentou mudança abrupta de padrão nas últimas sessões: redução drástica da necessidade de sono sem fadiga, aceleração psicomotora e impulsividade. Avalio ser necessária uma reavaliação urgente.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para relatar uma mudança significativa [do_da_paciente] [iniciais], em uso de [medicação] há [x] semanas por episódio depressivo. Nesta semana, apresentou alteração abrupta de padrão: redução da necessidade de sono para [x] horas sem cansaço no dia seguinte, aceleração del pensamento e discurso, e [descrever comportamentos impulsivos]. Refere sentir-se '[ótimo_ótima]', o que destoa do seu perfil habitual. Solicito reavaliação clínica com urgência.",
    formal:
      "[prezado_prezada] [dr_dra] [nome_psiquiatra],\n\n[saudação].\n\nEncaminho atualização clínica de [iniciais], [idade] anos, em acompanhamento psicoterápico.\n\n[O_A_paciente] está em uso de [medicação] há [x] semanas por episódio depressivo. Na sessão de [data], apresentou mudança abrupta de padrão em relação às semanas anteriores: redução da necessidade de sono ([x] horas sem cansaço), aceleração do pensamento e do discurso, [comportamento_impulsivo_concreto], e relato de sensação de estar '[ótimo_ótima]': inconsistente com o perfil habitual.\n\nA mudança de padrão merece atenção imediata, inclusive pela possibilidade de ativação maniforme. Solicito orientação de conduta.\n\nAtenciosamente,\n[meu_nome]",
    scriptId: "i3",
  },
  {
    id: "04",
    title: "Suspeita de risco suicida",
    isAttention: true,
    context:
      "Paciente verbaliza ideação passiva, ativa ou com plano. Nível de urgência varia.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nPassando para informar que [o_a_paciente] [iniciais] relatou ideação de morte passiva em sessão hoje (desejo de não acordar, mas sem plano estruturado). Sem ideação ativa ou acesso a meios no momento. Pactuamos aumento na frequência das sessões e solicito orientação.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para informar que [o_a_paciente] [iniciais] relatou em sessão hoje ideação de morte [ativa_ou_passiva], [com/sem] plano estruturado e [com/sem] acesso a meios. Funcionamento atual: [descrever_funcionamento]. Pactuamos rede de apoio ([rede_de_apoio]) e confirmamos adesão à medicação ([confirmar_adesao]). Solicito orientação para conduta e possível reavaliação clínica.",
    formal:
      '[dr_dra] [nome_psiquiatra],\n\n[saudação]. Trata-se de uma situação de urgência.\n\n[O_A_paciente] [iniciais], [idade] anos, verbalizou em sessão hoje plano suicida com intenção de ação. Relato literal: "[frase_literal_do_paciente]". [Ele_Ela] [tem/não tem] acesso ao meio e a rede de apoio [foi acionada/não foi acionada].\n\n[O_A_paciente] [permanece no consultório / foi acompanhado por familiar / foi encaminhado ao PS]. Solicito orientação imediata de conduta.\n\nAtenciosamente,\n[meu_nome]\nContato: [meu_telefone]',
  },
  {
    id: "05",
    title: "Oscilação emocional: bipolar vs borderline",
    isAttention: true,
    context:
      "Paciente com instabilidade emocional intensa, diagnóstico incerto ou histórico de múltiplas medicações sem resposta.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nGostaria de compartilhar observações sobre [o_a_paciente] [iniciais], [idade] anos. [Ele_Ela] apresenta instabilidade emocional intensa com oscilações rápidas de humor (ocorrendo no intervalo de [descrever_horas_ou_dias]), associadas predominantemente a contextos relacionais. Há histórico de [x] tentativas medicamentosas anteriores sem resposta sustentada. Em sessão, observo padrão de oscilação reativo a gatilhos afetivos, o que pode ajudar no diagnóstico diferencial. Sugiro avaliação integrada.",
    formal:
      "[prezado_prezada] [dr_dra] [nome_psiquiatra],\n\n[saudação].\n\nEncaminho observação clínica de [iniciais], [idade] anos.\n\nEm acompanhamento semanal, observo instabilidade emocional com oscilações de humor que ocorrem no intervalo de horas (não de dias ou semanas), predominantemente precipitadas por conflitos ou percepção de abandono em relacionamentos. Há histórico de [x] medicações com resposta limitada. Padrão de idealização e desvalorização presente no vínculo terapêutico.\n\nConsiderando o perfil observado em sessão, solicito reavaliação diagnóstica integrada, especialmente para diferenciar ciclagem de humor de instabilidade relacional persistente.\n\nAtenciosamente,\n[meu_nome]",
  },
  {
    id: "06",
    title: "Suspeita de TDAH não diagnosticado",
    context:
      "Paciente com queixa de ansiedade e resposta parcial a antidepressivos. Terapeuta observa desatenção desde infância.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nPasso para relatar que [o_a_paciente] [iniciais] apresenta queixa de ansiedade crônica e resposta parcial a antidepressivos. Em sessão, observo prejuízo atencional severo desde a infância, desorganização, procrastinação crônica e prejuízo no funcionamento executivo. Avalia viável uma investigação diagnóstica de TDAH?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], [idade] anos, em tratamento para ansiedade com [medicação]. Observamos uma resposta parcial: a tensão geral melhorou, mas a sobrecarga funcional persiste. Em sessão, identifico dificuldades atencionais acentuadas desde a infância, desorganização crônica e procrastinação por dificuldade de iniciação (não por falta de motivação). Avalio que a ansiedade pode ser secundária a uma disfunção executiva não tratada. Solicito avaliação diagnóstica considerando essa hipótese.",
  },
  {
    id: "07",
    title: "Suspeita de TOC",
    context:
      "Em sessão, observo pensamentos intrusivos egodistônicos e rituais.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nCompartilho observação clínica [do_da_paciente] [iniciais]. Em sessão, identifico pensamentos intrusivos egodistônicos recorrentes seguidos de rituais de alívio da ansiedade. Diante da resposta parcial ao tratamento atual, avalia viável uma reavaliação diagnóstica direcionada?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], [idade] anos, em tratamento para ansiedade com [medicação] há [x] semanas, com resposta parcial. Em sessão, observo ciclo obsessivo-compulsivo relevante: [descrever_pensamento_intrusivo] gera angústia intensa, aliviada de forma temporária por [descrever_comportamento_repetitivo]. [Ele_Ela] reconhece a irracionalidade do ciclo, mas não consegue interrompê-lo de forma voluntária. Solicito reavaliação diagnóstica e de conduta medicamentosa.",
  },
  {
    id: "08",
    title: "Suspeita de TEPT",
    context:
      "Em sessão, revelou evento traumático não investigado anteriormente. Padrão de hipervigilância, pesadelos e evitação.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nGostaria de informar que [o_a_paciente] [iniciais] (em tratamento para ansiedade com resposta parcial) revelou em sessão um histórico de evento traumático severo não investigado anteriormente. O padrão atual com hipervigilância, pesadelos e evitação sugere TEPT. Avalia necessário rever a conduta?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], [idade] anos, em tratamento para [diagnóstico] com [medicação] há [x] meses com resposta limitada. Em sessão, [o_a_paciente] compartilhou pela primeira vez um histórico de [descrever_evento_traumático_sem_detalhes_desnecessários] ocorrido há [x] anos. Atualmente apresenta hipervigilância constante, pesadelos recorrentes, evitação de estímulos associados e intensa reatividade emocional. O perfil clínico sugere TEPT. Solicito reavaliação clínica.",
    scriptId: "i4",
  },
  {
    id: "09",
    title: "Possível acatisia",
    context:
      "Após início da medicação, relata inquietação motora intensa, impossibilidade de ficar parada.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nPasso para informar que [o_a_paciente] [iniciais], em início de [medicação] há [x] dias, refere inquietação motora intensa e incapacidade física de permanecer [parado_parada]. O sintoma iniciou após a medicação e difere da ansiedade basal. Solicito reavaliação urgente para avaliar possível acatisia.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para relatar que [o_a_paciente] [iniciais], em uso de [medicação] há [x] dias, apresentou inquietação predominantemente corporal na última semana. Relata desconforto interno físico intenso e incapacidade de ficar [parado_parada], sem conteúdo cognitivo associado. Como o sintoma iniciou logo após a medicação, suspeito de acatisia. O desconforto é elevado e [ele_ela] cogita parar o tratamento. Solicito avaliação.",
    scriptId: "i1",
  },
  {
    id: "10",
    title: "Sinais de psicose inicial",
    isAttention: true,
    context:
      "Nas últimas sessões, paciente com ansiedade/isolamento apresenta discurso vago e ideias de referência.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nAlerta importante sobre [o_a_paciente] [iniciais], [idade] anos. Nas últimas sessões observei desorganização do pensamento, discurso progressivamente vago e relatos de ideias de referência relacionados a [descrever]. Paciente refere uso regular de [cannabis_ou_substancia]. Solicito avaliação clínica com urgência.",
    formal:
      '[prezado_prezada] [dr_dra] [nome_psiquiatra],\n\n[saudação].\n\nEncaminho avaliação clínica urgente de [iniciais], [idade] anos, em acompanhamento psicoterápico.\n\n[O_A_paciente] está em atendimento semanal por ansiedade e isolamento social. Nas últimas [x] sessões, observei deterioração progressiva: discurso vago e tangencial, perda do fio de raciocínio, relato de estranhamento da realidade ("as coisas estão estranhas") e possíveis ideias de referência ([descrever]). Paciente refere uso de [cannabis_ou_substancia].\n\nPelas mudanças clínicas e risco de agravamento, solicito avaliação com urgência.\n\nAtenciosamente,\n[meu_nome]',
  },
  {
    id: "11",
    title: "Suspeita de condição orgânica",
    context:
      "Paciente não responde e apresenta sinais físicos que podem sugerir hipotiroidismo, deficiência B12, etc.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nPasso para informar que [o_a_paciente] [iniciais] apresenta resposta inadequada ao tratamento de [diagnóstico]. Em sessão, relatou sintomas físicos marcantes como [descrever_sinais_físicos]. Avalia viável investigar uma possível causa orgânica subjacente?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], [idade] anos, em tratamento para [diagnóstico] há [x] meses com resposta parcial. Em sessão, além dos sintomas emocionais, [o_a_paciente] tem relatado queixas de [descrever_sinais_físicos]. A associação desses sinais com a refratariedade ao tratamento sugere a importância de investigar um componente orgânico (como alteração tireoidiana ou nutricional). Solicito avaliação e exames pertinentes.",
    scriptId: "i7",
  },
  {
    id: "12",
    title: "Dependência de benzodiazepínico",
    context:
      "Uso diário prolongado, tolerância, sintomas de abstinência confundidos com recaída.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nIdentifiquei em sessão que [o_a_paciente] [iniciais] está em uso diário de [medicação_benzo] há [x] [meses_anos]. [Ele_Ela] relata tolerância e forte angústia ao tentar suspender. Avalia viável iniciarmos um plano de desmame gradual supervisionado?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], que está em uso diário de [medicação_benzo] há [x] meses. Relata que o efeito ansiolítico diminuiu (sugerindo tolerância) e apresenta sintomas intensos de abstinência nas tentativas de interrupção (que [ele_ela] interpreta de forma equivocada como recaída do quadro basal). Apresenta também queixas cognitivas de [descrever_queixas]. Solicito avaliação para um plano de desmame gradual.",
  },
  {
    id: "13",
    title: "Disfunção sexual por medicação",
    context:
      "Impacto colateral significativo (redução de libido, anorgasmia) afetando autoimagem e relacionamento.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\n[O_A_paciente] [iniciais], em uso de [medicação] há [x] meses, queixa-se de disfunção sexual severa desde o início ([redução de libido / dificuldade erétil / anorgasmia]). Pelo impacto na adesão, avalia possível reajuste de dose ou troca?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para trazer uma queixa [do_da_paciente] [iniciais], em uso de [medicação] há [x] meses. [Ele_Ela] relatou em sessão disfunção sexual importante desde o início do fármaco: [descrever]. [O_A_paciente] considera suspender o tratamento por conta própria devido a este colateral. Solicito reavaliação para mitigar o risco de abandono.",
  },
  {
    id: "14",
    title: "Polimedicação com piora global",
    isAttention: true,
    context:
      "Uso concomitante de vários psicofármacos gerando sobreposição de colaterais.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nGostaria de trazer observações sobre [o_a_paciente] [iniciais], [idade] anos, atualmente em uso de [listar_medicações] por diferentes especialidades. Apresenta queixas marcantes de fadiga crônica, lentificação cognitiva e ganho de peso. Avalio que a sobreposição de efeitos colaterais pode estar simulando uma piora do quadro depressivo/ansioso. Solicito sua avaliação para uma revisão integrada da farmacoterapia.",
    formal:
      "[prezado_prezada] [dr_dra] [nome_psiquiatra],\n\n[saudação].\n\nEncaminho avaliação clínica de [iniciais], [idade] anos, em acompanhamento psicoterápico.\n\n[O_A_paciente] está em uso concomitante de: [listar_medicações_e_doses], prescritos em momentos distintos. Em sessão, relata fadiga desproporcional, prejuízo importante de memória e concentração, além de ganho ponderal de [x] kg no período.\n\nAvalio que a sobreposição de colaterais pode estar agravando as queixas que o tratamento visa mitigar. Solicito sua avaliação para revisão e possível simplificação do esquema terapêutico.\n\nAtenciosamente,\n[meu_nome]",
  },
  {
    id: "15",
    title: "Paciente quer parar a medicação: momento adequado",
    context: "Estável, sem recaídas e funcional, quer avaliar desmame.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\n[O_A_paciente] [iniciais] está clinicamente estável há [x] meses e manifesta desejo de iniciar desmame gradual do antidepressivo. Apresenta boa evolução em terapia e boa rede de apoio. Avalia viável planejar a retirada na próxima consulta?",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], em uso de [medicação] há [x] meses. [O_A_paciente] encontra-se [assintomático_assintomática] e estável há [x] meses, com excelente resposta funcional e suporte terapêutico. Manifestou o desejo de avaliar a retirada gradual do tratamento. Orientei que a decisão e o plano são médicos. Caso avalie viável, coloco-me à disposição para acompanhar o processo na psicoterapia.",
    scriptId: "i5",
  },
  {
    id: "16",
    title: "Paciente quer parar a medicação: momento inadequado",
    context: "Estabilização muito recente, paciente já quer parar.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\n[O_A_paciente] [iniciais] está com estabilização muito recente ([x] semanas) e deseja interromper o uso de [medicação]. Reforcei a necessidade de manutenção, mas solicito seu apoio para alinhar essa orientação na próxima consulta.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], em uso de [medicação] há [x] meses, com estabilização recente de [x] semanas. [Ele_Ela] manifesta desejo de interromper o tratamento [motivado_motivada] por [motivação]. Em sessão, orientei sobre o risco elevado de recaída precoce. Como [ele_ela] ainda insiste, solicito seu reforço nessa orientação na próxima consulta para garantir a segurança da manutenção.",
    scriptId: "i5",
  },
  {
    id: "17",
    title: "Paciente já parou a medicação por conta própria",
    context: "Sintomas de descontinuação.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nPaciente [iniciais] interrompeu [medicação] por conta própria abruptamente há [x] dias. Apresenta queixas físicas como tontura, irritabilidade e mal-estar. Orientei sobre descontinuação e recomendei retorno médico imediato. Solicito orientação.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para informar que [o_a_paciente] [iniciais] interrompeu abruptamente o uso de [medicação] há [x] dias sem orientação médica. Apresenta em sessão: [descrever_sintomas]. Avalio que a sintomatologia física seja compatível com síndrome de descontinuação. Orientei a necessidade de reavaliação médica. Solicito orientações para conduzir o manejo em sessão.",
    scriptId: "i5",
  },
  {
    id: "18",
    title: "Crise aguda em sessão",
    isAttention: true,
    context: "Verbalização aguda de suicídio, descompensação psicótica.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nComunicação de emergência sobre [o_a_paciente] [iniciais]. Em sessão hoje, apresentou quadro agudo de [Verbalização de plano suicida / Descompensação psicótica / descrever]. Solicito contato ou orientações imediatas de conduta.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para registrar uma intercorrência grave com [o_a_paciente] [iniciais] na sessão de hoje. Apresentou [descrever_crise]. Como conduta imediata: [Familiar acionado / aguardando orientação / encaminhando ao PS]. Solicito contato urgente para alinhamento.",
    formal:
      "[prezado_prezada] [dr_dra] [nome_psiquiatra],\n\n[saudação].\n\nRegistro de intercorrência grave na sessão de [data] com [o_a_paciente] [iniciais]:\n\n[O_A_paciente] apresentou quadro agudo de [descrever_o_que_aconteceu_crise_verbalizacao_comportamento]. A conduta imediata adotada foi: [descrever_o_que_foi_feito_familiar_acionado_SAMU_etc]. O estado [do_da_paciente] ao término do atendimento era [descrever].\n\nSolicito alinhamento urgente para os próximos passos.\n\nAtenciosamente,\n[meu_nome]\nContato: [meu_telefone]",
  },
  {
    id: "19",
    title: "Suspeita de uso de substâncias",
    context:
      "Possível interferência de álcool/drogas/anabolizantes na eficácia do tratamento.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\n[O_A_paciente] [iniciais] apresenta resposta insuficiente ao tratamento há [x] meses. Em sessão, revelou uso regular de [substância_e_padrão] com frequência de [substâncias_frequência_quantidade]. [Ele_Ela] autorizou compartilhar este relato para podermos avaliar o impacto na eficácia medicamentosa.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para atualizar sobre [o_a_paciente] [iniciais], em uso de [medicação] há [x] meses com resposta abaixo do esperado. Em sessão, após o fortalecimento do vínculo, [o_a_paciente] relatou uso regular de [substâncias_frequência_quantidade]. Diante da possibilidade de interação ou prejuízo à resposta farmacológica, e com a autorização expressa [do_da_paciente], compartilho este dado para sua avaliação.",
    scriptId: "i6",
  },
  {
    id: "20",
    title: "Psiquiatra trocou medicação: acompanhamento",
    context: "Observação após troca de dosagem ou nova prescrição.",
    short:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nPassando para relatar que observei em sessão as seguintes alterações [do_da_paciente] [iniciais] após [x] dias do ajuste/troca para [medicação]: [descrever_mudança]. Gostaria de confirmar se esse perfil clínico é esperado nesta fase.",
    medium:
      "[saudação], [dr_dra] [nome_psiquiatra]. Tudo bem?\n\nEscrevo para trazer observações sobre [o_a_paciente] [iniciais], que passou por [troca / ajuste] de dose de [medicação] para [dose] há [x] dias. Em sessão, notei as seguintes alterações clínicas em relação ao baseline: [descrever_agitação_sono_humor_etc]. Gostaria de confirmar se esses sintomas são esperados neste início ou se demandam atenção imediata, para que eu possa orientar [o_a_paciente].",
    scriptId: "i1",
  },
  {
    id: "21",
    title: "Paciente resistente a buscar psiquiatra",
    context: "Encaminhamento formal quando paciente recusa avaliação.",
    formal:
      "[prezado_prezada] Colega Médico,\n\n[saudação].\n\nEncaminho [iniciais], [idade] anos, para avaliação médica especializada.\n\n[O_A_paciente] está em acompanhamento psicoterápico desde [data], apresentando sintomas persistentes de [descrever_quadro_clinico_em_linguagem_simples]. Em sessão, identifico [descrever_o_que_justifica_avaliacao], justificando uma avaliação diagnóstica complementar e potencial conduta medicamentosa.\n\nAgradeço a parceria e coloco-me à disposição para alinhamento de conduta.\n\nAtenciosamente,\n[meu_nome]\nContato: [meu_telefone_contato]",
    short:
      "Passando para formalizar a sugestão de nossa última sessão: avalio que seria de extrema importância realizarmos uma consulta médica de avaliação especializada para o seu caso. O objetivo é termos um olhar complementar e integrado para ajudar no manejo dos sintomas de [descrever_quadro_clinico_em_linguagem_simples]. O que acha de agendarmos uma avaliação clínica para termos esse suporte?",
  },
];

export const INTERVIEW_SCRIPTS: InterviewScript[] = [
  {
    id: "i1",
    title: "Início ou troca de antidepressivo",
    questions: [
      "Quando a medicação começou? Houve aumento, redução ou troca recente?",
      "O paciente está tomando todos os dias? Em qual horário?",
      "O que mudou em sono, apetite, energy, ansiedade e funcionamento?",
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
