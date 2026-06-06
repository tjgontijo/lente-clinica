export type UrgencyLevel = "amarelo" | "vermelho";

export interface SignalAction {
  level: UrgencyLevel;
  instruction: string;
}

export interface AttentionSignal {
  id: string;
  title: string;
  appearance: string;
  keyQuestion: string;
  actions: SignalAction[];
}

export interface SignalCategory {
  id: string;
  title: string;
  signals: AttentionSignal[];
}

export interface SupportPhrase {
  id: string;
  purpose: string;
  phrase: string;
}

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  {
    id: "psiquiatricos",
    title: "Sinais Psiquiátricos",
    signals: [
      {
        id: "p1",
        title: "Ideação suicida passiva",
        appearance: 'Paciente diz "seria melhor se eu não acordasse", "às vezes penso que seria mais fácil não estar aqui", "não sei se vale a pena continuar". Não há plano, mas há desejo de desaparecimento.',
        keyQuestion: "Quando você diz isso, você está pensando em fazer alguma coisa ou é mais uma sensação de querer sumir?",
        actions: [
          {
            level: "amarelo",
            instruction: "Registrar. Rastrear em toda sessão. Comunicar ao psiquiatra se persistir ou intensificar.",
          },
        ],
      },
      {
        id: "p2",
        title: "Ideação suicida com plano",
        appearance: 'Paciente menciona método ("eu sei que tenho remédio em casa"), data, intenção clara. Ou diz que já decidiu.',
        keyQuestion: "Você pensou em como faria? Tem acesso a algum meio agora?",
        actions: [
          {
            level: "vermelho",
            instruction: "Não deixar o paciente sair sozinho. Acionar psiquiatra imediatamente. Se não houver contato direto: familiar + SAMU se necessário.",
          },
        ],
      },
      {
        id: "p3",
        title: "Piora rápida e inexplicável",
        appearance: "Paciente que estava estável chega visivelmente diferente: mais retraído, mais vazio, mais agitado: sem evento precipitante claro.",
        keyQuestion: "Algo mudou na medicação recentemente? Teve algum acontecimento que te abalou?",
        actions: [
          {
            level: "amarelo",
            instruction: "Investigar causa. Checar adesão medicamentosa. Comunicar ao psiquiatra se sem explicação clara.",
          },
        ],
      },
      {
        id: "p4",
        title: "Redução de sono sem cansaço",
        appearance: "Paciente relata dormir 3 a 4 horas e acordar com energia. Não sofre pela falta de sono: sente que não precisa dormir.",
        keyQuestion: "Você está dormindo menos porque não consegue ou porque não sente necessidade? No dia seguinte, como está sua energia?",
        actions: [
          {
            level: "amarelo",
            instruction: "Se episódio recente sem outros sinais.",
          },
          {
            level: "vermelho",
            instruction: "Se acompanhado de agitação, gastos impulsivos ou desorganização: pode indicar virada maníaca.",
          },
        ],
      },
      {
        id: "p5",
        title: "Agitação intensa e impulsividade",
        appearance: 'Paciente mais acelerado que o habitual, interrompe, muda de assunto, relata decisões impulsivas (gastos, conflitos, relacionamentos), sente que está "em outro nível".',
        keyQuestion: "Isso é seu jeito normal ou você está diferente do que costuma ser?",
        actions: [
          {
            level: "amarelo",
            instruction: "Se isolado e leve.",
          },
          {
            level: "vermelho",
            instruction: "Se associado a redução de sono, euforia ou consequências concretas: comunicar ao psiquiatra com urgência.",
          },
        ],
      },
      {
        id: "p6",
        title: "Desorganização do pensamento",
        appearance: "Discurso vago, perde o fio no meio da frase, responde tangencialmente, não termina ideias. Mudança perceptível em relação a sessões anteriores.",
        keyQuestion: "Você está conseguindo organizar seus pensamentos normalmente?",
        actions: [
          {
            level: "vermelho",
            instruction: "Comunicar ao psiquiatra. Psicose em início tem janela de intervenção: não esperar.",
          },
        ],
      },
      {
        id: "p7",
        title: "Delírios, paranoia, estranhamento da realidade",
        appearance: 'Paciente relata que "as coisas estão diferentes", sensação de que algo acontece "por trás" das situações, que pessoas falam sobre ele, que eventos têm significado especial. Ou verbaliza crenças desconectadas da realidade.',
        keyQuestion: "Quando você diz que as coisas estão estranhas, você consegue explicar melhor? É uma sensação interna ou o ambiente parece diferente?",
        actions: [
          {
            level: "vermelho",
            instruction: "Não confrontar o conteúdo. Acionar psiquiatra. Monitorar segurança.",
          },
        ],
      },
      {
        id: "p8",
        title: "Autolesão",
        appearance: 'Paciente menciona ou você percebe marcas em braços, pernas. Relata que se machuca para "sentir algo" ou "aliviar" uma angústia.',
        keyQuestion: "Você tem se machucado? Com que frequência? Está aumentando?",
        actions: [
          {
            level: "amarelo",
            instruction: "Se histórico prévio sem agravamento atual.",
          },
          {
            level: "vermelho",
            instruction: "Se novo, crescente ou com intensidade importante: comunicar ao psiquiatra.",
          },
        ],
      },
      {
        id: "p9",
        title: "Dissociação intensa",
        appearance: 'Paciente relata momentos de "sair do corpo", não se reconhecer no espelho, sentir que está num sonho, lacunas de memória. Pode surgir ao abordar temas de trauma.',
        keyQuestion: "Quando isso acontece, você sabe onde está? Consegue me dizer quanto tempo dura?",
        actions: [
          {
            level: "amarelo",
            instruction: "Investigar trauma. Não aprofundar conteúdo traumático sem manejo adequado. Comunicar ao psiquiatra se frequente ou intenso.",
          },
        ],
      },
    ],
  },
  {
    id: "medicamentosos",
    title: "Sinais Medicamentosos",
    signals: [
      {
        id: "m1",
        title: "Acatisia",
        appearance: 'Paciente diz que "não consegue ficar parado", anda pela sala, levanta e senta, descreve inquietação corporal interna. Começou após início ou ajuste de medicação.',
        keyQuestion: "Essa sensação é mais de preocupação ou de inquietação no corpo? Começou antes ou depois da medicação?",
        actions: [
          {
            level: "amarelo",
            instruction: "Nomear a hipótese para o paciente. Comunicar ao psiquiatra com urgência: acatisia pode aumentar risco de ideação suicida.",
          },
        ],
      },
      {
        id: "m2",
        title: "Sedação intensa",
        appearance: 'Paciente relata dormir demais, dificuldade de acordar, "cabeça pesada" durante o dia, prejuízo no trabalho ou nas relações. Iniciou ou piorou com mudança medicamentosa.',
        keyQuestion: "Isso começou quando? Tem relação com alguma mudança no remédio ou na dose?",
        actions: [
          {
            level: "amarelo",
            instruction: "Registrar e comunicar ao psiquiatra. Sedação excessiva compromete adesão.",
          },
        ],
      },
      {
        id: "m3",
        title: "Embotamento emocional",
        appearance: 'Paciente diz "não estou triste, mas também não sinto nada". Ausência de reatividade emocional. A terapia trava: concorda com tudo, mas nada avança. Iniciou após medicação ou ajuste de dose.',
        keyQuestion: "Você está melhor ou está diferente? A tristeza passou ou todas as emoções ficaram mais baixas?",
        actions: [
          {
            level: "amarelo",
            instruction: "Comunicar ao psiquiatra: pode indicar necessidade de reavaliação da conduta.",
          },
        ],
      },
      {
        id: "m4",
        title: "Síndrome de descontinuação",
        appearance: 'Paciente relata tontura, "choquinhos" no corpo (brain zaps), náusea, irritabilidade, instabilidade. Iniciou dias após parar ou reduzir medicação por conta própria.',
        keyQuestion: "Você mudou ou parou algum remédio recentemente? Há quanto tempo está sentindo isso?",
        actions: [
          {
            level: "amarelo",
            instruction: "Se sintomas leves.",
          },
          {
            level: "vermelho",
            instruction: "Se intensos ou com risco de descompensação: orientar retorno ao psiquiatra o quanto antes.",
          },
        ],
      },
      {
        id: "m5",
        title: "Sinais de dependência de benzodiazepínicos",
        appearance: "Paciente usa benzo diariamente há mais de 4 semanas. Relata que sem o remédio não dorme ou fica muito ansioso. Já precisou aumentar a dose para ter o mesmo efeito.",
        keyQuestion: "O que acontece quando você não toma? Esses sintomas aparecem rápido e somem quando você toma?",
        actions: [
          {
            level: "amarelo",
            instruction: "Abrir conversa sem julgamento. Comunicar ao psiquiatra: retirada precisa ser gradual e supervisionada.",
          },
        ],
      },
      {
        id: "m6",
        title: "Efeitos extrapiramidais",
        appearance: "Paciente em uso de antipsicotico relata rigidez muscular, tremor, movimentos involuntários, postura diferente, dificuldade de se mover normalmente.",
        keyQuestion: "Você notou alguma mudança no seu corpo desde que começou esse remédio? Rigidez, tremor, dificuldade de se mover?",
        actions: [
          {
            level: "amarelo",
            instruction: "Comunicar ao psiquiatra para avaliação e possível ajuste.",
          },
        ],
      },
      {
        id: "m7",
        title: "Galactorreia / hiperprolactinemia",
        appearance: "Paciente (homem ou mulher) em uso de antipsicotico relata secreção mamária, alteração de libido ou, em mulheres, irregularidade menstrual.",
        keyQuestion: "Você notou algo diferente no seu corpo desde que começou essa medicação? Às vezes esses remédios podem causar alterações hormonais.",
        actions: [
          {
            level: "amarelo",
            instruction: "Comunicar ao psiquiatra. Paciente pode não relatar espontaneamente por vergonha.",
          },
        ],
      },
      {
        id: "m8",
        title: "Ganho de peso rápido e importante",
        appearance: "Paciente relata ganho significativo de peso sem mudança de hábitos. Comum com alguns antipsicoticos e estabilizadores de humor.",
        keyQuestion: "Você notou mudança no peso desde que começou ou ajustou a medicação?",
        actions: [
          {
            level: "amarelo",
            instruction: "Registrar. Comunicar ao psiquiatra: impacta adesão e saúde metabólica.",
          },
        ],
      },
      {
        id: "m9",
        title: "Disfunção sexual com risco de abandono",
        appearance: "Paciente relata perda de desejo, dificuldade de excitação ou orgasmo desde o início da medicação. Pode estar considerando parar o remédio.",
        keyQuestion: "Você notou alguma mudança na sua vida sexual depois que começou a medicação?",
        actions: [
          {
            level: "amarelo",
            instruction: "Comunicar ao psiquiatra com urgência: é a principal causa de abandono silencioso de antidepressivos.",
          },
        ],
      },
      {
        id: "m10",
        title: "Virada maníaca por antidepressivo",
        appearance: 'Paciente em uso de antidepressivo apresenta mudança abrupta: mais acelerado, eufórico, com redução de sono sem cansaço, impulsividade e sensação de estar "ótimo". Mudança inconsistente com linha de base.',
        keyQuestion: "Essa energia que você está sentindo é parecida com seu jeito normal ou está além do que costuma ser?",
        actions: [
          {
            level: "vermelho",
            instruction: "Não reforçar como melhora. Comunicar ao psiquiatra com urgência: antidepressivo pode estar revelando bipolaridade subjacente.",
          },
        ],
      },
      {
        id: "m11",
        title: "Baixa adesão suspeita",
        appearance: 'Melhora instável sem padrão claro, paciente menciona "esqueci" com frequência, resposta clínica inconsistente com o tempo de uso. Paciente desvia quando perguntado sobre rotina com o remédio.',
        keyQuestion: "Me conta como foi sua rotina com o remédio essa semana: teve algum dia que esqueceu ou variou o horário?",
        actions: [
          {
            level: "amarelo",
            instruction: "Abrir sem julgamento. Registrar. Comunicar ao psiquiatra se persistente: baixa adesão mascara a eficácia real da medicação e pode levar a trocas desnecessárias.",
          },
        ],
      },
      {
        id: "m12",
        title: "Uso de substâncias interferindo no tratamento",
        appearance: "Tratamento sem evolução apesar de adesão aparente, humor instável fora do padrão esperado, insônia persistente sem causa clara, paciente evasivo sobre rotina social ou noturna.",
        keyQuestion: "Muitas pessoas usam álcool, maconha ou outras substâncias para lidar com a ansiedade. Se for o seu caso, é importante que eu saiba: não para julgar, mas porque pode estar afetando o tratamento.",
        actions: [
          {
            level: "amarelo",
            instruction: "Abrir sem julgamento. Se confirmado, comunicar ao psiquiatra com autorização do paciente: substâncias podem anular completamente a ação de antidepressivos e ansiolíticos.",
          },
        ],
      },
      {
        id: "m13",
        title: "Síndrome serotoninergíca",
        appearance: "Combinação de tremor, diarreia, sudorese excessiva, agitação, confusão mental e febre. Pode surgir após início ou aumento de antidepressivo, ou após combinação com outros serotonergícos (tramadol, alguns analgésicos, suplementos como 5-HTP).",
        keyQuestion: "Quando exatamente esses sintomas começaram? Você tomou algum remédio novo, suplemento ou analgésico recentemente?",
        actions: [
          {
            level: "vermelho",
            instruction: "Emergência médica. Acionar psiquiatra ou PS imediatamente. Não minimizar: síndrome serotoninergíca grave pode ser fatal.",
          },
        ],
      },
    ],
  },
  {
    id: "clinicos",
    title: "Sinais Clínicos / Orgânicos",
    signals: [
      {
        id: "c1",
        title: "Fadiga + queda de cabelo + lentidão intestinal",
        appearance: 'Paciente relata cansaço desproporcional, queda de cabelo acentuada, pele seca, ganho de peso sem mudança de hábitos, intestino "travado". Pode estar em tratamento para depressão sem melhora adequada.',
        keyQuestion: "Além do cansaço emocional, você notou alguma mudança física? Cabelo, pele, peso, intestino?",
        actions: [
          {
            level: "amarelo",
            instruction: "Orientar avaliação médica para investigar tireoide. Hipotireoidismo pode se apresentar como quadro depressivo.",
          },
        ],
      },
      {
        id: "c2",
        title: "Esquecimento progressivo + formigamento + apatia",
        appearance: "Paciente (especialmente idoso ou com problemas gástricos) relata esquecimento crescente, formigamento nas mãos ou pés, fraqueza, apatia. Pode ter histórico de uso prolongado de omeprazol ou redução de proteína animal na dieta.",
        keyQuestion: "Você sente formigamento em alguma parte do corpo? Tem algum problema gástrico ou mudou sua alimentação recentemente?",
        actions: [
          {
            level: "amarelo",
            instruction: "Orientar avaliação médica para investigar vitamina B12 e outras causas clínicas possíveis. Deficiências prolongadas podem causar dano neurológico.",
          },
        ],
      },
      {
        id: "c3",
        title: "Perda de peso acentuada ou restrição alimentar",
        appearance: "Perda de peso visível entre sessões. Pele seca, cabelo quebradiço. Paciente relata restrição alimentar, rituais com comida, culpa após comer ou comportamentos compensatórios.",
        keyQuestion: "Me conta como foi sua alimentação ontem, do começo ao fim do dia.",
        actions: [
          {
            level: "amarelo",
            instruction: "Se padrão restritivo sem sinais físicos graves.",
          },
          {
            level: "vermelho",
            instruction: "Se sinais físicos presentes (tontura, fraqueza, inchaço nas bochechas): encaminhar para avaliação clínica urgente. Transtorno alimentar tem a maior mortalidade entre os transtornos psiquiátricos.",
          },
        ],
      },
      {
        id: "c4",
        title: "Taquicardia + tremor + sudorese sem conteúdo ansioso",
        appearance: 'Paciente descreve "corpo ligado o tempo todo", palpitações, tremor nas mãos, sudorese excessiva. Mas quando se investiga: não há preocupação específica. "A ansiedade começa no corpo, não na cabeça."',
        keyQuestion: "Essa sensação começa como pensamento ou como algo físico? Você está preocupado com algo ou é o seu corpo que não para?",
        actions: [
          {
            level: "amarelo",
            instruction: "Orientar avaliação médica para investigar tireoide. Hipertireoidismo pode se apresentar como ansiedade corporal intensa.",
          },
        ],
      },
      {
        id: "c5",
        title: "Sintomas físicos incompatíveis com o quadro mental",
        appearance: "O quadro psiquiátrico não responde ao tratamento apesar de adesão adequada. Ou sintomas físicos acompanham os emocionais de forma desproporcional ou inconsistente.",
        keyQuestion: "Esse padrão faz sentido como o quadro que a gente está tratando? Se não faz, o que mais pode ser?",
        actions: [
          {
            level: "amarelo",
            instruction: "Orientar avaliação médica. Considerar causa orgânica antes de interpretar tudo como piora emocional ou falha medicamentosa.",
          },
        ],
      },
    ],
  },
];

export const SUPPORT_PHRASES: SupportPhrase[] = [
  {
    id: "sp1",
    purpose: "Para nomear preocupação sem alarmar",
    phrase: "Eu estou percebendo uma mudança importante e quero entender melhor com você.",
  },
  {
    id: "sp2",
    purpose: "Para orientar sem pressionar",
    phrase: "Isso merece ser avaliado com mais rapidez. Não estou querendo te assustar: estou querendo te proteger.",
  },
  {
    id: "sp3",
    purpose: "Para acionar rede sem dramatizar",
    phrase: "Vamos entrar em contato com seu psiquiatra agora. Eu te ajudo com isso.",
  },
  {
    id: "sp4",
    purpose: "Para manter vínculo em crise",
    phrase: "Eu não vou te deixar sozinho com isso.",
  },
  {
    id: "sp5",
    purpose: "Para criar urgência sem pânico",
    phrase: "Preciso que você fale com seu psiquiatra antes da nossa próxima sessão. Isso não pode esperar.",
  },
  {
    id: "sp6",
    purpose: "Para sustentar após emergência",
    phrase: "O que aconteceu aqui foi difícil. Você não precisa carregar isso sozinho. Vamos seguir juntos.",
  },
];
