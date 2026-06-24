# Context: Assistente de Montagem de Mensagens (Wizard)

**Ultima atualizacao:** 2026-06-23

---

## 📌 Definicao

O **Assistente de Mensagens (Wizard)** e um fluxo interativo composto de etapas sequenciais (passo a passo) projetado para ajudar a psicologa a elaborar mensagens estruturadas para psiquiatras sem precisar navegar manualmente pelo catalogo de 21 modelos.

**O que e:**
- Um funil de perguntas e respostas objetivas baseado em observacoes clinicas.
- Um agregador de dados que solicita informacoes basicas e variaveis locais especificas de forma oportuna.
- Uma ferramenta de apoio para a tomada de decisao de qual modelo utilizar.

**O que NAO e:**
- Um gerador de diagnosticos medicos por IA.
- Um prontuario eletronico ou substituto da evolucao clinica.

---

## 🔄 Fluxo Completo

```txt
[Etapa 1: Dados Gerais]
  ↓
[Etapa 2: Triagem de Categoria]
  ↓
[Etapa 3: Selecao de Cenario Clinico]
  ↓
[Etapa 4: Variaveis Especificas]
  ↓
[Etapa 5: Visualizacao e Envio]
```

### Detalhamento das Etapas

#### Etapa 1: Dados Gerais
Coleta as informacoes de identificacao e do profissional (iniciais do paciente, idade, medicacao atual, psiquiatra, nome da terapeuta e telefone de contato). Esses dados alimentam os placeholders globais comuns do design de mensagens.

#### Etapa 2: Triagem de Categoria
Apresenta uma pergunta simples sobre o foco do contato:
1. *Efeitos Colaterais ou Sintomas Adversos*
2. *Suspeitas de Novos Quadros ou Hipoteses Diagnosticas*
3. *Situacoes de Risco ou Crise*
4. *Adesao ou Descontinuacao do Tratamento*
5. *Acompanhamento ou Encaminhamento Geral*

#### Etapa 3: Selecao de Cenario Clinico
Com base na categoria escolhida na Etapa 2, exibe apenas os cenarios especificos associados.
- Exemplo: Se escolheu **"Efeitos Colaterais"**, exibe:
  - *Inico de antidepressivo sem melhora*
  - *Suspeita de embotamento emocional*
  - *Possivel acatisia*
  - *Disfuncao sexual por medicacao*
  - *Polimedicacao com piora global*

#### Etapa 4: Variaveis Especificas
Analisa o cenario escolhido na Etapa 3 e renderiza campos de formulario sob medida para cada placeholder local contido no template correspondente (ex: `[x]` para tempo, `[sintomas]`, `[descrever_evento_traumático_sem_detalhes_desnecessários]`).
- Isso substitui a digitacao inline por caixas de entrada normais e faceis de preencher.

#### Etapa 5: Visualizacao e Envio
Exibe a mensagem formatada nas abas "WhatsApp", "Medio" e "Formal".
- Integra botoes para "Copiar texto" e "Enviar no WhatsApp".
- Renderiza o roteiro de perguntas clinicas correspondente ao cenario para que a psicologa confira se investigou tudo antes de disparar a mensagem.

---

## 📋 Validacoes

### Validacao de Entrada (Input Validation)
- Iniciais do paciente sao limitadas a letras maiusculas com pontos.
- Idade do paciente deve ser preenchida numericamente.
- Pelo menos um cenario deve ser selecionado antes de avancar para a Etapa 4.

---

## 📝 Resumo para Implementacao

- A alternancia de telas devera ser feita via Abas (`Tabs` ou estado de tela local).
- O estado do wizard devera ser mantido em um contexto compartilhado ou no componente pai da feature para facil limpeza e reset.
- Serao reutilizados os dados estruturados de `COMMUNICATION_TEMPLATES` e `INTERVIEW_SCRIPTS` definidos em `templates.ts`.
