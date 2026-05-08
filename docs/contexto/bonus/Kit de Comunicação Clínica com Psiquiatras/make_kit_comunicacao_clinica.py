#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kit de Comunicação Clínica com Psiquiatras
PDF generator with fully hardcoded content blocks.
"""

from __future__ import annotations

import os
import re
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.styles import ParagraphStyle


HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "kit_comunicacao_clinica.pdf")


KIT_CONTENT_MD = r"""

# Kit de Comunicação Clínica com Psiquiatras
**Programa Lente Clínica: Dra. Tatiana Gontijo**

> Use este kit quando precisar comunicar ao psiquiatra o que você observou em sessão: com clareza, objetividade e foco clínico.

---

## SEÇÃO 1: Como se Comunicar com Clareza e Objetividade

### O que vale comunicar

Você ocupa um lugar único: vê o paciente toda semana, acompanha mudanças em tempo real e constrói um vínculo clínico próximo. Isso tem grande valor para o cuidado quando é comunicado com clareza.

**Comunique:**
- O que você observou diretamente (comportamento, fala, padrão)
- Mudanças em relação a sessões anteriores
- Falas literais do paciente que têm peso clínico
- Impacto funcional percebido (sono, trabalho, vínculos, risco)
- O que você está sentindo que precisa de atenção ou reavaliação

**Não comunique:**
- Diagnóstico fechado ("ele é bipolar")
- Sugestão de medicação específica ("deveria trocar para bupropiona")
- Certezas sobre causa ("é efeito colateral do remédio")
- Interpretações que ultrapassam sua observação clínica

### A diferença na prática

| ❌ Invade a conduta | ✅ Organiza a observação |
|---------------------|--------------------------|
| "Acho que ele está em mania." | "Paciente apresenta redução de sono sem cansaço, aceleração do pensamento e impulsividade com prejuízo financeiro." |
| "O escitalopram está causando embotamento." | "Desde o início da medicação, a reatividade emocional reduziu e a terapia perdeu profundidade." |
| "Precisa trocar de remédio." | "Solicito reavaliação: paciente considera interromper por conta própria." |

### Quando comunicar

Não espere a crise. Comunique quando:
- Perceber mudança de padrão relevante
- O paciente verbalizar intenção de parar o remédio
- Houver qualquer sinal de risco
- A terapia travar de forma que parece relacionada à medicação
- O paciente revelar algo que o psiquiatra precisa saber para conduzir bem o caso

### Sobre confidencialidade

Compartilhe informações clínicas com o psiquiatra quando:
1. Há consentimento do paciente (preferencial: deixe isso combinado desde o início do tratamento)
2. Há risco relevante à vida ou à integridade do paciente ou de terceiros, e a comunicação é necessária para proteção

Em casos de risco, a proteção à vida pode prevalecer sobre o sigilo. Ainda assim, compartilhe apenas o necessário para proteger o paciente e sustentar a conduta.

### Base ética para comunicar

O Código de Ética Profissional do Psicólogo protege o sigilo como regra. Também orienta que, no relacionamento com outros profissionais, sejam compartilhadas apenas informações relevantes para qualificar o cuidado. Quando houver conflito entre deveres éticos, o psicólogo pode decidir pela quebra de sigilo buscando o menor prejuízo e limitando a comunicação ao estritamente necessário.

Na prática:
- Combine previamente com o paciente como será a comunicação com psiquiatra e outros profissionais
- Peça autorização explícita sempre que possível
- Em risco iminente, acione a rede necessária mesmo sem autorização
- Compartilhe apenas dados relevantes para a proteção e continuidade do cuidado
- Registre no prontuário o motivo do contato, para quem comunicou, quando comunicou e o que foi comunicado

### Estrutura básica de qualquer mensagem

1. **Quem é**: iniciais, idade, contexto mínimo
2. **O que você viu**: comportamento ou fala concreta, sem diagnóstico
3. **Quando mudou**: em relação a quando
4. **Impacto**: o que está sendo afetado (sono, trabalho, vínculo, risco)
5. **Pedido objetivo**: o que você precisa do psiquiatra

---

### Termos técnicos úteis na comunicação clínica

- **Adesão ao tratamento**: quanto o paciente consegue seguir o plano combinado (medicação, horários e acompanhamento).
- **Latência terapêutica**: tempo esperado até a medicação começar a produzir benefício clínico.
- **Resposta parcial**: melhora presente, mas ainda insuficiente para recuperação funcional.
- **Remissão**: redução importante dos sintomas, com retorno mais estável do funcionamento.
- **Efeito colateral**: efeito indesejado associado ao tratamento, que pode impactar rotina e adesão.
- **Impacto funcional**: repercussão prática dos sintomas na vida diária (sono, trabalho, vínculos e autocuidado).
- **Descompensação clínica**: piora relevante do quadro em relação ao padrão recente do paciente.
- **Conduta**: plano clínico definido pelo profissional responsável pela prescrição.

---

## SEÇÃO 2: Modelos de Mensagem por Cenário

| Formato | Quando usar |
|---------|-------------|
| **Curto** | WhatsApp profissional (2-3 linhas). Situação não urgente com contato direto. |
| **Médio** | Mensagem clínica organizada (1 parágrafo). Situações que exigem mais contexto. |
| **Formal ⚠️** | E-mail ou encaminhamento escrito. Risco, diagnóstico diferencial ou documentação necessária. |

> Adapte sempre: substitua os campos em [colchetes] com os dados do seu paciente.

---

### 01. Início de antidepressivo sem melhora

**Contexto:** paciente com 2-4 semanas de uso relata que "não está funcionando" e considera parar.

**Modelo curto:**
> "Paciente [iniciais], início de [medicação] há [x] dias. Sem resposta significativa ainda, mas sem piora. Adesão confirmada em sessão. Ideação ausente. Segue com [sintoma principal]. Tudo bem manter?"

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em uso de [medicação] há [x] dias por [diagnóstico]. Relata que não percebeu melhora e está considerando interromper por conta própria. Em sessão, confirmei adesão e ausência de ideação suicida. Sintomas atuais: [descrever]. Sem piora em relação ao início. Fiz psicoeducação sobre latência terapêutica. Solicito orientação para sustentar adesão até próxima consulta."

---

### 02. Suspeita de embotamento emocional

**Contexto:** paciente relata não sentir mais nada: nem tristeza nem alegria: após início ou ajuste de antidepressivo. Terapia trava.

**Modelo curto:**
> "Paciente [iniciais] relata melhora da tristeza, mas ausência de reatividade emocional desde início de [medicação]. Terapia com dificuldade de acesso afetivo. Solicito avaliação."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] semanas. Refere melhora do humor deprimido, mas apresenta embotamento afetivo significativo: ausência de prazer, distanciamento dos vínculos e redução de reatividade emocional em sessão. A terapia perdeu profundidade: paciente concorda intelectualmente mas sem acesso emocional. Solicito reavaliação de conduta."

---

### 03. Suspeita de virada maníaca ⚠️

**Contexto:** paciente em uso de antidepressivo apresenta mudança abrupta de padrão: aceleração, redução de sono sem cansaço, impulsividade.

**Modelo curto:**
> "Paciente [iniciais] em uso de [medicação] há [x] semanas. Apresentou mudança abrupta: menos sono sem cansaço, aceleração, impulsividade. Solicito reavaliação urgente."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] semanas por episódio depressivo. Nesta semana apresentou mudança significativa de padrão: redução da necessidade de sono para [x] horas sem cansaço, aceleração do pensamento, [descrever comportamentos impulsivos]. Paciente refere sentir-se 'ótima': mudança inconsistente com baseline. Solicito reavaliação com urgência."

**Modelo formal:**
> Prezado(a) Dr(a). [nome],
>
> Encaminho atualização clínica de [iniciais], [idade] anos, em acompanhamento psicoterápico.
>
> Paciente em uso de [medicação] há [x] semanas por episódio depressivo. Na sessão de [data], apresentou mudança abrupta de padrão em relação às semanas anteriores: redução da necessidade de sono ([x] horas sem cansaço), aceleração do pensamento e do discurso, [impulsividade: descrever comportamento concreto], e relato de sensação de estar "ótima": inconsistente com o perfil habitual da paciente.
>
> A mudança de padrão merece reavaliação urgente, inclusive pela possibilidade de ativação maniforme. Solicito orientação de conduta.
>
> Atenciosamente,
> [seu nome]

---

### 04. Suspeita de risco suicida ⚠️

**Contexto:** paciente verbaliza ideação passiva, ativa ou com plano. Nível de urgência varia.

**Modelo curto (ideação passiva, sem plano):**
> "Paciente [iniciais] relatou ideação de morte passiva em sessão hoje: desejo de não acordar, sem plano estruturado. Sem ideação ativa ou acesso a meios. Aumentei frequência de sessões. Solicito orientação."

**Modelo médio:**
> "Paciente [iniciais], em sessão hoje relatou ideação de morte [passiva/ativa: descrever]. [Com/sem] plano estruturado. [Com/sem] acesso a meios. Funcionamento atual: [descrever]. Rede de apoio: [presente/ausente]. Adesão à medicação: [confirmar]. Solicito orientação para conduta e possível reavaliação antes da próxima consulta programada."

**Modelo formal (risco iminente):**
> Dr(a). [nome]: situação urgente.
>
> Paciente [iniciais], [idade] anos, verbalizou em sessão hoje plano suicida com intenção de ação. Relato: [descrever frase literal]. [Tem/não tem] acesso ao meio. [Familiar acionado/não acionado].
>
> Paciente [permanece no consultório / foi acompanhado por familiar / foi encaminhado ao PS]. Solicito orientação imediata de conduta.
>
> [seu nome]: [telefone]

---

### 05. Oscilação emocional: bipolar vs borderline ⚠️

**Contexto:** paciente com instabilidade emocional intensa, diagnóstico incerto ou histórico de múltiplas medicações sem resposta.

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em acompanhamento psicoterápico. Apresenta instabilidade emocional intensa com oscilações rápidas: [descrever: horas, não dias]: associadas predominantemente a contextos relacionais. Histórico de [x] medicações sem resposta sustentada. Em sessão, observo padrão que pode ser relevante para diferenciar ciclagem de humor de instabilidade relacional. Solicito avaliação diagnóstica integrada."

**Modelo formal:**
> Prezado(a) Dr(a). [nome],
>
> Encaminho observação clínica de [iniciais], [idade] anos.
>
> Em acompanhamento semanal, observo instabilidade emocional com oscilações de humor que ocorrem em horas: não em dias ou semanas: predominantemente precipitadas por conflitos ou percepção de abandono em relacionamentos. Histórico de [x] medicações com resposta limitada. Padrão de idealização e desvalorização presente no vínculo terapêutico.
>
> Considerando o perfil observado em sessão, solicito reavaliação diagnóstica integrada, especialmente para diferenciar ciclagem de humor de instabilidade relacional persistente.
>
> Atenciosamente,
> [seu nome]

---

### 06. Suspeita de TDAH não diagnosticado

**Modelo curto:**
> "Paciente [iniciais] com queixa de ansiedade e resposta parcial a antidepressivos. Em sessão, observo dificuldade atencional desde a infância, desorganização crônica e procrastinação por dificuldade de ativação. Solicito avaliação diagnóstica considerando essa possibilidade."

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em tratamento para ansiedade com [medicação]. Resposta parcial: tensão melhorou, mas sobrecarga funcional persiste. Em sessão, observo dificuldade atencional desde a infância relatada pela própria paciente, desorganização crônica, procrastinação por dificuldade de iniciação (não por desmotivação), esforço compensatório massivo para manter rotinas básicas, e ansiedade possivelmente secundária à disfunção executiva. Solicito avaliação diagnóstica considerando essa possibilidade."

---

### 07. Suspeita de TOC

**Modelo curto:**
> "Paciente [iniciais] com ansiedade. Em sessão, observo pensamentos intrusivos egodistônicos seguidos de comportamentos repetitivos para aliviar angústia. Resposta parcial ao tratamento atual. Solicito reavaliação diagnóstica e de conduta."

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em tratamento para ansiedade com [medicação] há [x] semanas. Resposta parcial. Em sessão, observo um ciclo repetitivo: [descrever pensamento intrusivo] gera angústia intensa, aliviada temporariamente por [descrever comportamento repetitivo]. Paciente reconhece irracionalidade, mas não consegue interromper. Solicito reavaliação diagnóstica e de conduta."

---

### 08. Suspeita de TEPT

**Modelo curto:**
> "Paciente [iniciais] em tratamento para ansiedade sem resposta adequada. Em sessão, revelou evento traumático não investigado anteriormente. Padrão atual: hipervigilância, pesadelos, evitação: sugere TEPT. Solicito reavaliação."

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em tratamento para [diagnóstico] com [medicação] há [x] meses. Resposta limitada. Em sessão, a paciente revelou pela primeira vez [evento traumático: descrever sem detalhes desnecessários] ocorrido há [x anos]. Sintomas atuais: hipervigilância constante, pesadelos recorrentes, evitação de estímulos associados ao evento e reatividade intensa: são consistentes com TEPT. Avalio que o quadro principal pode ser traumático, não ansiogênico. Solicito reavaliação diagnóstica e de conduta medicamentosa."

---

### 09. Possível acatisia

**Modelo curto:**
> "Paciente [iniciais] em início de [medicação] há [x] dias. Refere inquietação motora intensa, incapacidade de permanecer parada: diferente da ansiedade habitual. Iniciou após medicação. Solicito reavaliação pela possibilidade de acatisia."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] dias. Relatou piora na última semana, mas com padrão diferente da ansiedade prévia: inquietação predominantemente corporal, incapacidade de permanecer parada, desconforto interno sem conteúdo cognitivo ansioso. Sintomas iniciaram após início da medicação. Solicito reavaliação pela possibilidade de acatisia: paciente considera interromper tratamento por desconforto."

---

### 10. Sinais de psicose inicial ⚠️

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em acompanhamento por ansiedade e isolamento. Nas últimas sessões, observo: discurso progressivamente mais vago, dificuldade de completar raciocínios, relato de 'sensação de que as coisas estão estranhas' e possíveis ideias de referência: [descrever]. Uso regular de [cannabis/substância se aplicável]. Solicito avaliação psiquiátrica urgente."

**Modelo formal:**
> Prezado(a) Dr(a). [nome],
>
> Encaminho avaliação clínica urgente de [iniciais], [idade] anos.
>
> Paciente em acompanhamento semanal por ansiedade e isolamento social. Nas últimas [x] sessões, observo deterioração progressiva: discurso mais vago e tangencial, perda do fio do raciocínio no meio das frases, relato de estranhamento da realidade ("as coisas estão diferentes, não sei explicar"), e possíveis ideias de referência ([descrever]). Uso regular de [substância se aplicável].
>
> Pelas mudanças observadas e pelo risco de agravamento, solicito avaliação com urgência.
>
> Atenciosamente,
> [seu nome]

---

### 11. Suspeita de condição orgânica

**Modelo curto:**
> "Paciente [iniciais] com [diagnóstico] sem resposta adequada ao tratamento. Apresenta sinais físicos associados: [descrever: queda de cabelo, formigamento, tremor, etc.]: que podem justificar avaliação médica. Solicito reavaliação considerando possível componente orgânico."

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em tratamento para [diagnóstico] há [x] meses com resposta parcial. Em sessão, além dos sintomas emocionais, relata [sinais físicos: descrever]. A combinação de sintomas psiquiátricos com sinais físicos específicos sugere possível componente orgânico subjacente: [hipótese: hipotireoidismo / deficiência de B12 / hipertireoidismo / hiperprolactinemia]. Solicito avaliação e investigação laboratorial pertinente."

---

### 12. Dependência de benzodiazepínico

**Modelo curto:**
> "Paciente [iniciais] em uso diário de [benzo] há [x meses/anos]. Relata tolerância e dificuldade de interrupção. Solicito avaliação para plano de retirada gradual."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] meses de forma diária. Relata que o efeito diminuiu com o tempo (tolerância), dificuldade de ficar sem o remédio (sintomas de abstinência que interpreta como recaída), e possível impacto cognitivo: [descrever queixas de memória, lentidão]. Paciente não percebe padrão como dependência. Solicito avaliação para plano de desmame gradual supervisionado."

---

### 13. Disfunção sexual por medicação

**Modelo curto:**
> "Paciente [iniciais] em uso de [medicação] há [x] meses. Relata disfunção sexual significativa desde o início: [redução de libido / dificuldade erétil / anorgasmia]. Considera interromper. Solicito reavaliação."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] meses. Após construção de vínculo terapêutico, relatou disfunção sexual significativa desde o início da medicação: [descrever]. Impacto relevante na relação afetiva e na autoimagem. Paciente está considerando interromper o tratamento por conta própria. Solicito reavaliação de conduta: o abandono desassistido representa risco de recaída."

---

### 14. Polimedicação com piora global ⚠️

**Modelo médio:**
> "Paciente [iniciais], [idade] anos, em uso de [listar medicações] prescritas por [x] profissionais ao longo de [x] anos. Apresenta fadiga crônica, prejuízo cognitivo, embotamento afetivo e ganho de peso: sintomas que podem estar relacionados à sobreposição de efeitos colaterais, não ao quadro primário. Solicito revisão integrada da prescrição por um único profissional."

**Modelo formal:**
> Prezado(a) Dr(a). [nome],
>
> Encaminho avaliação clínica de [iniciais], [idade] anos, em acompanhamento psicoterápico.
>
> Paciente em uso concomitante de: [listar medicações, doses e tempo de uso]. Medicações prescritas por diferentes profissionais em momentos distintos, sem revisão integrada.
>
> Em sessão, relata: fadiga desproporcional, prejuízo significativo de memória e concentração, embotamento afetivo e ganho de peso de [x] kg no período. A combinação de efeitos colaterais das medicações atuais pode estar produzindo ou agravando os sintomas que o tratamento visa tratar.
>
> Solicito revisão integrada da prescrição com objetivo de simplificação e avaliação de necessidade real de cada medicamento.
>
> Atenciosamente,
> [seu nome]

---

### 15. Paciente quer parar a medicação: momento adequado

**Modelo curto:**
> "Paciente [iniciais] estável há [x] meses. Solicita avaliação para retirada gradual do antidepressivo. Bom suporte psicoterapêutico. Sugiro avaliarmos juntos a viabilidade."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] meses. Estável há [x] meses: funcional, sem recaídas, com bom suporte psicoterapêutico. Manifesta desejo de avaliar possibilidade de retirada gradual. Orientei que a decisão e o processo são médicos, e que a retirada deve ser gradual. Solicito avaliação conjunta para planejar desmame se indicado."

---

### 16. Paciente quer parar a medicação: momento inadequado

**Modelo curto:**
> "Paciente [iniciais] com [x] semanas de estabilização quer interromper [medicação]. Orientei sobre riscos. Solicito reforço da orientação sobre tempo mínimo de manutenção na próxima consulta."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] meses, com estabilização recente de [x] semanas. Manifesta desejo de interromper o tratamento: motivação: [descrever]. Orientei sobre o risco de recaída precoce e sobre o tempo mínimo de manutenção após estabilização. Paciente considerou, mas mantém desejo. Solicito que na próxima consulta seja reforçada a orientação sobre continuidade: o alinhamento médico-terapeuta aumenta adesão."

---

### 17. Paciente já parou a medicação por conta própria

**Modelo curto:**
> "Paciente [iniciais] interrompeu [medicação] abruptamente há [x] dias. Apresenta [sintomas: tontura, brain zaps, irritabilidade]. Orientei sobre síndrome de descontinuação. Solicito reavaliação urgente."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] meses, interrompeu abruptamente há [x] dias sem orientação médica. Apresenta em sessão: [descrever sintomas]. Quadro pode ser compatível com síndrome de descontinuação. Orientei retorno ao acompanhamento médico e não interpretei os sintomas como recaída sem avaliação. Solicito avaliação urgente."

---

### 18. Crise aguda em sessão ⚠️

**Modelo curto (urgente):**
> "Paciente [iniciais] em sessão agora. [Verbalização de plano suicida / Descompensação psicótica / descrever]. Solicito orientação imediata de conduta."

**Modelo médio:**
> "Paciente [iniciais] em sessão hoje apresentou [descrever crise]. [Familiar acionado / aguardando orientação / encaminhando ao PS]. Solicito contato urgente."

**Modelo formal (documentação pós-crise):**
> Prezado(a) Dr(a). [nome],
>
> Registro do ocorrido em sessão de [data]:
>
> Paciente [iniciais] apresentou [descrever o que aconteceu: crise, verbalização, comportamento]. Conduta adotada: [descrever o que foi feito: familiar acionado, SAMU, encaminhamento ao PS, etc.]. Estado ao fim da sessão: [descrever].
>
> Solicito alinhamento de conduta para os próximos passos.
>
> [seu nome]: [telefone]

---

### 19. Suspeita de uso de substâncias

**Modelo curto:**
> "Paciente [iniciais] sem evolução em [x] meses de tratamento. Em sessão, revelou uso regular de [álcool/cannabis/cocaína: descrever padrão]. Possível interferência na resposta medicamentosa. Solicito reavaliação considerando esse contexto."

**Modelo médio:**
> "Paciente [iniciais], em uso de [medicação] há [x] meses com resposta inadequada. Em sessão, após construção de vínculo, relatou uso regular de [substâncias: descrever: frequência, quantidade]. Paciente autorizou comunicação. O uso relatado pode estar interferindo na resposta ao tratamento. Solicito reavaliação considerando esse contexto."

---

### 20. Psiquiatra trocou ou ajustou a medicação: acompanhamento pós-mudança

**Contexto:** após troca ou ajuste de dose, terapeuta observa mudanças relevantes na sessão.

**Modelo curto:**
> "Paciente [iniciais] após [troca de / ajuste de dose de] [medicação] há [x] dias. Observo em sessão: [descrever mudança]. Solicito orientação se esperado nessa fase."

**Modelo médio:**
> "Paciente [iniciais], após [troca de medicação / aumento de dose para x mg] há [x] dias. Em sessão, observo as seguintes mudanças em relação ao período anterior: [descrever: agitação, sedação, humor, sono, comportamento]. Gostaria de saber se o padrão é esperado nessa fase de transição ou se merece atenção clínica. Isso me ajuda a orientar melhor o paciente nas sessões e saber o que monitorar."

---

### 21. Paciente resistente a buscar psiquiatra

**Contexto:** terapeuta percebe necessidade de avaliação psiquiátrica, mas paciente recusa ou ainda não tem psiquiatra.

> *Observação: esta situação envolve primeiro uma conversa com o paciente: não com o psiquiatra. Os modelos abaixo são para quando você precisa fazer um encaminhamento formal.*

**Modelo de encaminhamento escrito para o paciente levar:**
> "Encaminho [iniciais], [idade] anos, para avaliação psiquiátrica.
>
> Paciente em acompanhamento psicoterápico desde [data]. Apresenta [descrever quadro clínico em linguagem simples]. Em sessão, observo [descrever o que justifica avaliação]. Avaliação psiquiátrica se faz necessária para [descrever objetivo: diagnóstico diferencial / possibilidade de medicação / revisão de conduta].
>
> Agradeço contato para alinhamento de conduta.
> [seu nome]: [contato]"

**Modelo de abordagem para usar com o paciente antes do encaminhamento:**
> "Eu percebi algumas coisas nas nossas sessões que acho importante investigar com mais profundidade. Não estou dizendo que você precisa de remédio. Estou dizendo que faz sentido ter uma avaliação: assim a gente sabe o que está diante de nós e pode trabalhar melhor juntos. Você toparia ir uma vez, só para ouvir?"

---

## SEÇÃO 3: Roteiros de Perguntas-Chave

> Use estes roteiros antes de escrever ao psiquiatra. Eles ajudam a separar observação concreta, hipótese clínica e pedido objetivo.

---

### 1. Início ou troca de antidepressivo

- Quando a medicação começou? Houve aumento, redução ou troca recente?
- O paciente está tomando todos os dias? Em qual horário?
- O que mudou em sono, apetite, energia, ansiedade e funcionamento?
- Houve piora rápida, agitação, inquietação corporal ou ideação suicida?
- O paciente quer parar por impaciência, efeito colateral ou medo?
- O que é igual ao quadro inicial e o que apareceu depois da medicação?

---

### 2. Suspeita de embotamento emocional

- A tristeza diminuiu ou todas as emoções ficaram mais baixas?
- O paciente sente prazer, irritação, desejo, afeto e conexão?
- A vida está melhorando ou apenas ficou mais "neutra"?
- A terapia perdeu acesso emocional depois da medicação ou ajuste?
- O paciente está pensando em parar o remédio por se sentir anestesiado?

---

### 3. Suspeita de ativação ou hipomania

- O paciente está dormindo menos porque não consegue ou porque não sente necessidade?
- No dia seguinte, há cansaço ou energia aumentada?
- Há aceleração de fala, pensamento ou decisões?
- Houve gastos, conflitos, impulsividade sexual, projetos excessivos ou exposição a risco?
- Alguém próximo percebeu que ele está diferente?
- Essa mudança parece melhora estável ou uma mudança abrupta de padrão?

---

### 4. Trauma, dissociação ou TEPT

- Existe algum evento que o paciente evita tocar ou lembrar?
- Há pesadelos, flashbacks, hipervigilância ou sobressalto exagerado?
- O paciente evita lugares, pessoas, assuntos ou sensações corporais específicas?
- Quando dissocia, ele sabe onde está? Quanto tempo dura?
- O sintoma piora quando certos temas aparecem na sessão?
- O paciente autorizou que esse contexto seja mencionado ao psiquiatra?

---

### 5. Paciente quer parar a medicação

- Por que ele quer parar agora?
- Está estável há quanto tempo?
- Já tentou parar antes? O que aconteceu?
- A decisão vem de melhora real, efeito colateral, vergonha, medo ou pressão externa?
- Ele conversou com o psiquiatra antes de alterar dose ou suspender?
- O que precisa ser alinhado para não haver retirada abrupta?

---

### 6. Uso de substâncias

- Usa álcool, cannabis, estimulantes, calmantes sem prescrição, anabolizantes ou suplementos?
- Qual frequência, quantidade e contexto de uso?
- Usa para dormir, relaxar, render, socializar ou não sentir?
- O uso piora sono, humor, ansiedade, impulsividade ou adesão?
- O paciente contou isso ao psiquiatra?
- Ele autoriza que essa informação seja compartilhada?

---

### 7. Possível componente clínico/orgânico

- Houve mudança de peso, pele, cabelo, intestino, ciclo menstrual ou libido?
- Há tremor, palpitação, sudorese, formigamento, fraqueza ou tontura?
- O cansaço parece emocional, corporal ou os dois?
- O quadro não responde apesar de adesão e acompanhamento adequado?
- O paciente tem acompanhamento médico clínico recente?
- Faz sentido sugerir avaliação médica sem afirmar causa?

---

## SEÇÃO 4: Ficha de Resumo Clínico

> Use esta ficha quando precisar organizar e enviar um resumo mais completo do caso ao psiquiatra.

---

**FICHA DE RESUMO CLÍNICO: USO PROFISSIONAL**

**Paciente:** ___ (iniciais) | **Idade:** ___ | **Data:** ___

**Motivo do contato:**
_____________________________________________

**Medicação atual conhecida:**
_____________________________________________

**O que observei em sessão:**
_____________________________________________
_____________________________________________

**Falas literais do paciente relevantes:**
> "_____________________________________________"

**Tempo de evolução desse padrão:**
_____________________________________________

**Impacto funcional relatado:**
- Sono: ___
- Trabalho/estudo: ___
- Vínculos: ___
- Urgência percebida: Sem urgência imediata / 🟡 Alinhar em breve / 🔴 Urgente

**Pedido objetivo ao psiquiatra:**
_____________________________________________

---

*Kit de Comunicação Clínica com Psiquiatras: Programa Lente Clínica*
*Dra. Tatiana Gontijo: uso exclusivo para fins educativos*
*Este material não substitui avaliação clínica individualizada*

"""


W, H = A4
ML = MR = 1.8 * cm
MT = 2.4 * cm
MB = 1.5 * cm
CW = W - ML - MR

S50 = HexColor("#F2F8F7")
S100 = HexColor("#E0ECEB")
S200 = HexColor("#C5D9D4")
S500 = HexColor("#6A9088")
S600 = HexColor("#537A72")
S700 = HexColor("#3F6058")
S800 = HexColor("#2F4A44")
S900 = HexColor("#1F3530")
T400 = HexColor("#D49068")
T500 = HexColor("#C47850")
T600 = HexColor("#B06040")
INK = HexColor("#1A2E2A")
INKL = HexColor("#4A6660")
WHT = HexColor("#FFFFFF")
QBG = HexColor("#FFF7F0")
QBAR = HexColor("#C47850")
MODEL_BG = HexColor("#F8FBFA")


def ps(name, font="Helvetica", sz=9.2, lead=None, color=None, before=0, after=0, align=TA_LEFT):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=sz,
        leading=lead or round(sz * 1.45),
        textColor=color or INK,
        spaceBefore=before,
        spaceAfter=after,
        alignment=align,
    )
    style.keepWithNext = 0
    return style


ST = {
    "cover_title": ps("cover_title", "Helvetica-Bold", 24, 30, WHT, after=8),
    "cover_sub": ps("cover_sub", "Helvetica", 12, 18, S200, after=6),
    "cover_author": ps("cover_author", "Helvetica", 10.5, 16, S300 := HexColor("#A3C4BC")),
    "h1": ps("h1", "Helvetica-Bold", 16, 22, S700, after=8),
    "h2": ps("h2", "Helvetica-Bold", 12, 16, WHT),
    "h3": ps("h3", "Helvetica-Bold", 11.3, 15, S700, before=8, after=5),
    "body": ps("body", "Helvetica", 9.2, 13.6, INK, after=5),
    "small": ps("small", "Helvetica", 8.2, 12, INKL, after=3),
    "quote": ps("quote", "Helvetica-Oblique", 8.7, 12.8, INK, after=3),
    "quote_b": ps("quote_b", "Helvetica-BoldOblique", 8.7, 12.8, S700, after=3),
    "table_h": ps("table_h", "Helvetica-Bold", 8.0, 11, WHT),
    "table": ps("table", "Helvetica", 7.7, 10.5, INK),
    "list": ps("list", "Helvetica", 8.9, 12.8, INK),
    "footer": ps("footer", "Helvetica", 7.2, 9, S500, align=TA_CENTER),
}
ST["exp_h1"] = ps("exp_h1", "Helvetica-Bold", 15, 21, S700, 0, 8)
ST["exp_h2"] = ps("exp_h2", "Helvetica-Bold", 11, 16, INK, 6, 3)
ST["exp_body"] = ps("exp_body", "Helvetica", 10, 15, INK, 0, 3)
ST["exp_small"] = ps("exp_small", "Helvetica", 9, 13, INKL, 0, 2)
ST["open_h1"] = ps("open_h1", "Helvetica-Bold", 16, 22, S700, 0, 8)
ST["open_body"] = ps("open_body", "Helvetica", 10.5, 16, INK, 0, 6)
ST["toc_head"] = ps("toc_head", "Helvetica-Bold", 8.5, 12, INKL, 0, 0)
ST["toc_sec"] = ps("toc_sec", "Helvetica-Bold", 10, 14, INK, 0, 0)
ST["toc_sub"] = ps("toc_sub", "Helvetica", 9.5, 13, INK, 0, 0)
ST["toc_page"] = ps("toc_page", "Helvetica-Bold", 10, 14, INK, 0, 0, TA_RIGHT)
ST["h1"].keepWithNext = 1
ST["h2"].keepWithNext = 1
ST["h3"].keepWithNext = 1


def draw_cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(S900)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(S800)
    canvas.circle(W * 0.86, H * 0.78, 88, fill=1, stroke=0)
    canvas.setFillColor(HexColor("#253D36"))
    canvas.circle(W * 0.80, H * 0.70, 52, fill=1, stroke=0)
    canvas.setFillColor(T600)
    canvas.rect(0, H - 5 * mm, W, 5 * mm, fill=1, stroke=0)
    canvas.setFillColor(S800)
    canvas.rect(0, 0, W, 2.8 * cm, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(S300)
    canvas.drawString(ML, 1.15 * cm, "Uso exclusivo para fins educativos")
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(T400)
    canvas.drawRightString(W - MR, 1.15 * cm, "Dra. Tatiana Gontijo")
    canvas.restoreState()


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(S700)
    canvas.rect(ML, H - MT + 5, CW, 2, fill=1, stroke=0)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(S700)
    canvas.drawString(ML, H - MT + 10, "KIT DE COMUNICAÇÃO CLÍNICA COM PSIQUIATRAS")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(S500)
    canvas.drawRightString(ML + CW, H - MT + 10, "Dra. Tatiana Gontijo")
    canvas.setFillColor(S200)
    canvas.rect(ML, MB - 5, CW, 1, fill=1, stroke=0)
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(S500)
    canvas.drawCentredString(
        W / 2,
        MB - 17,
        "Kit de Comunicação Clínica com Psiquiatras",
    )
    canvas.setFont("Helvetica-Bold", 7.2)
    canvas.setFillColor(S600)
    canvas.drawRightString(ML + CW, MB - 17, str(doc.page))
    canvas.restoreState()


def make_doc(path):
    doc = BaseDocTemplate(
        path,
        pagesize=A4,
        leftMargin=ML,
        rightMargin=MR,
        topMargin=MT,
        bottomMargin=MB,
    )
    frame = Frame(ML, MB, CW, H - MT - MB, id="content")
    doc.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[frame], onPage=draw_cover),
            PageTemplate(id="Content", frames=[frame], onPage=draw_page),
        ]
    )
    return doc


def clean_text(text):
    replacements = {
        "⚠️": "Atenção",
        "⚠": "Atenção",
        "❌": "Evita",
        "✅": "Prefira",
        "🟡": "Amarelo",
        "🔴": "Vermelho",
        "🟢": "Acompanhar",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def inline(text):
    text = clean_text(text)
    text = escape(text)
    text = re.sub(r"`([^`]+)`", r"<font name=\"Courier\">\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    return text


def paragraph(text, style="body"):
    return Paragraph(inline(text), ST[style])


def h2_block(text):
    table = Table([[Paragraph(inline(text.upper()), ST["h2"])]], colWidths=[CW])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), S700),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return [Spacer(1, 4 * mm), table, Spacer(1, 3 * mm)]


def quote_block(lines):
    rows = []
    for raw in lines:
        text = raw.strip()
        if not text:
            rows.append(["", Spacer(1, 3 * mm)])
            continue
        style = "quote_b" if text.startswith("**") and text.endswith("**") else "quote"
        rows.append(["", Paragraph(inline(text), ST[style])])
    table = Table(rows, colWidths=[4 * mm, CW - 4 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), QBAR),
                ("BACKGROUND", (1, 0), (1, -1), QBG),
                ("LEFTPADDING", (0, 0), (0, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, -1), 0),
                ("TOPPADDING", (0, 0), (0, -1), 0),
                ("BOTTOMPADDING", (0, 0), (0, -1), 0),
                ("LEFTPADDING", (1, 0), (1, -1), 10),
                ("RIGHTPADDING", (1, 0), (1, -1), 10),
                ("TOPPADDING", (1, 0), (1, -1), 5),
                ("BOTTOMPADDING", (1, 0), (1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 2.5 * mm)]


def split_table_row(line):
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def table_block(lines):
    rows = [split_table_row(line) for line in lines if not re.match(r"^\s*\|?\s*:?-{3,}", line)]
    if not rows:
        return []
    max_cols = max(len(row) for row in rows)
    for row in rows:
        row.extend([""] * (max_cols - len(row)))
    data = []
    for r, row in enumerate(rows):
        style = ST["table_h"] if r == 0 else ST["table"]
        data.append([Paragraph(inline(cell), style) for cell in row])
    col_widths = [CW / max_cols] * max_cols
    table = Table(data, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), S700),
                ("BACKGROUND", (0, 1), (-1, -1), MODEL_BG),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHT, S50]),
                ("GRID", (0, 0), (-1, -1), 0.4, S200),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 3 * mm)]


def list_block(items, ordered=False):
    flowables = []
    for index, item in enumerate(items, 1):
        bullet = f"{index}." if ordered else "-"
        flowables.append(Paragraph(inline(f"{bullet} {item}"), ST["list"]))
    flowables.append(Spacer(1, 2 * mm))
    return flowables


def form_cell(label, hint=""):
    text = f"<b>{escape(label)}</b>"
    if hint:
        text += f"<br/><font color='#4A6660'>{escape(hint)}</font>"
    return Paragraph(text, ST["body"])


def form_box(label, height, hint=""):
    table = Table([[form_cell(label, hint)]], colWidths=[CW], rowHeights=[height])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, S200),
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#FBFDFD")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 2.4 * mm)]


def form_row(items, height):
    cells = [form_cell(label, hint) for label, hint, _width in items]
    widths = [width for _label, _hint, width in items]
    table = Table([cells], colWidths=widths, rowHeights=[height])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, S200),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, S200),
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#FBFDFD")),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return [table, Spacer(1, 2.4 * mm)]


def summary_form():
    story = []
    story.extend(h2_block("SEÇÃO 4: Ficha de Resumo Clínico"))
    story.extend(
        quote_block(
            [
                "Use esta ficha para organizar o que será compartilhado com o psiquiatra. Inclua apenas informações relevantes para a continuidade do cuidado.",
            ]
        )
    )

    title = Table([[Paragraph("FICHA DE RESUMO CLÍNICO", ST["h3"])]], colWidths=[CW])
    title.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, -1), 0.7, S200),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(title)
    story.append(Spacer(1, 3 * mm))

    story.extend(
        form_row(
            [
                ("Paciente", "Iniciais", CW * 0.42),
                ("Idade", "", CW * 0.18),
                ("Data", "", CW * 0.40),
            ],
            1.25 * cm,
        )
    )
    story.extend(form_box("Motivo do contato", 1.45 * cm, "Por que estou escrevendo agora?"))
    story.extend(form_box("Medicação atual conhecida", 1.25 * cm, "Nome, dose e tempo de uso, se o paciente souber informar"))
    story.extend(form_box("O que observei em sessão", 2.15 * cm, "Comportamentos, falas, mudança de padrão e impacto funcional"))
    story.extend(form_box("Falas literais do paciente", 1.45 * cm, "Use aspas apenas para frases clinicamente relevantes"))
    story.extend(form_box("Tempo de evolução do padrão", 1.15 * cm, "Quando começou? Está piorando, melhorando ou oscilando?"))

    story.extend(
        form_row(
            [
                ("Sono", "", CW * 0.34),
                ("Trabalho/estudo", "", CW * 0.33),
                ("Vínculos", "", CW * 0.33),
            ],
            1.25 * cm,
        )
    )
    story.extend(
        form_box(
            "Urgência percebida",
            1.25 * cm,
            "[ ] Sem urgência imediata    [ ] Alinhar em breve    [ ] Urgente hoje",
        )
    )
    story.extend(form_box("Pedido objetivo ao psiquiatra", 1.45 * cm, "Reavaliação, orientação de conduta, antecipação de consulta ou alinhamento"))

    note = Table(
        [[Paragraph("Registre no prontuário o motivo do contato, para quem comunicou, quando comunicou e o conteúdo essencial.", ST["small"])]],
        colWidths=[CW],
    )
    note.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), S50),
                ("BOX", (0, 0), (-1, -1), 0.5, S200),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(note)
    return story


def make_kit_toc():
    rows = []
    rows.append([
        Paragraph('ABERTURA', ST['toc_head']),
        Paragraph('', ST['toc_head']),
        Paragraph('', ST['toc_head']),
    ])
    rows.extend([
        [Paragraph('Introdução', ST['toc_sec']), Paragraph('', ST['toc_sub']), Paragraph('4', ST['toc_page'])],
    ])
    rows.append([Paragraph('CONTEÚDO CLÍNICO', ST['toc_head']), Paragraph('', ST['toc_head']), Paragraph('', ST['toc_head'])])
    rows.extend([
        [Paragraph('Seção 1', ST['toc_sec']), Paragraph('Como se Comunicar com Clareza e Objetividade', ST['toc_sub']), Paragraph('5', ST['toc_page'])],
        [Paragraph('Seção 2', ST['toc_sec']), Paragraph('Modelos de Mensagem por Cenário', ST['toc_sub']), Paragraph('7', ST['toc_page'])],
        [Paragraph('Seção 3', ST['toc_sec']), Paragraph('Roteiros de Perguntas-Chave', ST['toc_sub']), Paragraph('15', ST['toc_page'])],
        [Paragraph('Seção 4', ST['toc_sec']), Paragraph('Ficha de Resumo Clínico', ST['toc_sub']), Paragraph('17', ST['toc_page'])],
    ])
    table = Table(rows, colWidths=[35 * mm, CW - 55 * mm, 20 * mm])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LINEBELOW', (0, 0), (-1, 0), 0.3, S200),
        ('LINEBELOW', (0, 2), (-1, 2), 0.3, S200),
        ('LINEBELOW', (0, -1), (-1, -1), 0.3, S200),
    ]))
    return table


def build_story():
    story = []

    # ── CAPA ──────────────────────────────────────────────────
    story.append(Spacer(1, 7.1 * cm))
    story.append(Paragraph("Kit de Comunicação<br/>Clínica com Psiquiatras", ST["cover_title"]))
    story.append(HRFlowable(width=6.0 * cm, color=T600, thickness=2.5, spaceAfter=10, spaceBefore=4))
    story.append(Paragraph("Modelos, roteiros e ficha de resumo clínico", ST["cover_sub"]))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Dra. Tatiana Gontijo", ST["cover_author"]))
    story.append(NextPageTemplate("Content"))
    story.append(PageBreak())

    # ── EXPEDIENTE ────────────────────────────────────────────
    story.append(Paragraph('Kit de Comunicação Clínica com Psiquiatras', ST['exp_body']))
    story.append(Paragraph('Dra. Tatiana Gontijo', ST['exp_body']))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('Todos os direitos reservados.', ST['exp_body']))
    story.append(Paragraph(
        'É permitida a reprodução parcial deste material apenas com citação da fonte.',
        ST['exp_body']))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('ISBN digital: [a definir]', ST['exp_body']))
    story.append(Paragraph('Edição: 1ª edição', ST['exp_body']))
    story.append(Paragraph('Ano: 2026', ST['exp_body']))
    story.append(Paragraph('Publicado no Brasil', ST['exp_body']))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('Edição e distribuição', ST['exp_h2']))
    story.append(Paragraph('[Nome editorial / selo]', ST['exp_body']))
    story.append(Paragraph('Contato: https://dratatianagontijo.com.br', ST['exp_body']))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph('Equipe técnica', ST['exp_h2']))
    story.append(Paragraph('Autoria: Tatiana Paranhos de Campos Gontijo', ST['exp_body']))
    story.append(Paragraph('Diagramação: Thiago José Gontijo Cardoso', ST['exp_body']))
    story.append(PageBreak())

    # ── SUMÁRIO ───────────────────────────────────────────────
    story.append(Paragraph('Sumário', ST['open_h1']))
    story.append(Spacer(1, 2*mm))
    story.append(make_kit_toc())
    story.append(PageBreak())

    # ── INTRODUÇÃO ────────────────────────────────────────────
    story.append(Paragraph('Introdução', ST['open_h1']))
    story.append(Paragraph(
        'A mensagem já estava pronta na cabeça. O que você observou era claro: '
        'o paciente mudou, e o psiquiatra precisa saber. Mas quando a hora de escrever '
        'chegou, a dúvida apareceu. Como organizo isso em palavras? O que é mais '
        'relevante comunicar?',
        ST['open_body']))
    story.append(Paragraph(
        'Este kit foi criado para esse momento. Você acompanha o paciente toda semana, '
        'conhece o padrão dele, percebe quando algo mudou. Essa observação tem valor '
        'clínico real. A questão é como transformá-la em comunicação clara, para que '
        'o cuidado integrado aconteça com mais precisão.',
        ST['open_body']))
    story.append(Paragraph(
        'Na minha prática, vi quantas vezes a comunicação entre terapeuta e psiquiatra '
        'fez diferença no desfecho do caso. Não porque um sabia mais que o outro, '
        'mas porque cada um via o paciente de um ângulo diferente. Quando esses ângulos '
        'se encontram, o cuidado melhora.',
        ST['open_body']))
    story.append(Paragraph(
        'O material está organizado em quatro seções: como estruturar uma comunicação '
        'clínica, modelos de mensagem por cenário, roteiros de perguntas para organizar '
        'a observação antes de escrever, e uma ficha de resumo clínico. Use o que for '
        'útil, adaptando ao contexto de cada caso.',
        ST['open_body']))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        '<i>Dra. Tatiana Gontijo</i>',
        ps('intro_sig', sz=10, lead=14, color=S600, align=TA_RIGHT)))
    story.append(PageBreak())

    story.extend(build_hardcoded_content())
    return story





def render_embedded_markdown(markdown):
    # Skip content before first section heading
    idx = markdown.find('\n## ')
    if idx > 0:
        markdown = markdown[idx:]

    story = []
    lines = markdown.splitlines()
    i = 0
    h2_count = 0
    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped == "---":
            i += 1
            continue

        if stripped.startswith('## '):
            if h2_count > 0:
                story.append(PageBreak())
            h2_count += 1
            story.extend(h2_block(stripped[3:].strip()))
            i += 1
            continue

        if stripped.startswith('### '):
            story.append(Paragraph(inline(stripped[4:].strip()), ST['h3']))
            i += 1
            continue

        if stripped.startswith('>'):
            q = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                q.append(lines[i].strip()[1:].strip())
                i += 1
            story.extend(quote_block(q))
            continue

        if stripped.startswith('|'):
            tbl = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                tbl.append(lines[i])
                i += 1
            story.extend(table_block(tbl))
            continue

        if stripped.startswith('- '):
            items = []
            while i < len(lines) and lines[i].strip().startswith('- '):
                items.append(lines[i].strip()[2:].strip())
                i += 1
            story.extend(list_block(items))
            continue

        story.append(paragraph(stripped))
        i += 1

    return story


def build_hardcoded_content():
    marker = "\n## SEÇÃO 4: Ficha de Resumo Clínico"
    base_md = KIT_CONTENT_MD.split(marker, 1)[0]
    story = render_embedded_markdown(base_md)
    story.append(PageBreak())
    story.extend(summary_form())
    return story

if __name__ == "__main__":
    doc = make_doc(OUT)
    story = build_story()
    doc.build(story)
    print(f"PDF gerado: {OUT}")
    print(f"Tamanho: {os.path.getsize(OUT):,} bytes")
