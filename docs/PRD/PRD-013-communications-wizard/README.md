# PRD-013: Assistente de Montagem de Mensagens (Communications Wizard)

**Status:** Para Revisão
**Data:** 2026-06-23
**Versao:** 1.0

---

## 📋 O Que e Este PRD?

Este PRD define o assistente interativo em etapas (Wizard) para o Kit de Comunicação Clínica. O objetivo e guiar a psicologa por meio de um questionario simples para identificar o cenario clinico ideal, coletar as informacoes necessarias e gerar a mensagem final para o psiquiatra.

**Documento:** Especificacao de Produto e Plano de Implementacao

**Tempo Total:** 5h

---

## 📂 Estrutura do PRD

```txt
docs/PRD/PRD-013-communications-wizard/
├── README.md (este arquivo)
├── CONTEXT.md (contexto do fluxo e regras do wizard)
├── DIAGNOSTIC.md (analise de lacunas e usabilidade)
├── TASKS.md (plano de implementacao detalhado)
└── QUICK_START.md (guia rapido de desenvolvimento)
```

---

## 🎯 Resumo Executivo

### Status Atual
- A feature `/communications` hoje exibe uma lista estatica de 21 cenarios com filtros simples de texto.
- Embora robusta, a psicologa precisa saber previamente qual modelo se adequa ao caso do paciente ou ler varios modelos ate encontrar o correto.
- Este PRD propoe uma interface em etapas (Wizard) que atua como um quiz de triagem clinica, gerando a mensagem de forma progressiva.

### Severidade das Entregas

| Criticos | Moderados | Menores |
|----------|-----------|---------|
| 🔴 0     | 🟡 3      | 🟢 1    |

### Ordem de Fixacao

| Fase | Tasks | Tempo |
|------|-------|-------|
| 1: Estrutura & Fluxo | T1-T2 | 3h |
| 2: Geracao & Acoes | T3 | 1h |
| 3: Refinamento & Estado | T4 | 1h |

**Total:** 5h

---

## 🟡 Problemas Moderados (Requisitos Principais)

### T1: Interface de Alternancia (Painel vs. Assistente)
- **Impacto:** Permite que a psicologa escolha entre o catalogo completo tradicional de modelos ou o novo fluxo guiado passo a passo.
- **Solucao:** Adicionar abas na tela de comunicacao para alternar entre "Catalogo de Modelos" e "Assistente de Mensagem".

### T2: Questionario Guiado de Triagem
- **Impacto:** Reduz a carga cognitiva da psicologa ao filtrar os cenarios com base em perguntas e respostas sequenciais.
- **Solucao:** Criar um formulario em etapas que pergunta: Categoria de queixa -> Cenario especifico -> Variaveis locais.

### T3: Tela de Visualizacao e Envio
- **Impacto:** Centraliza a copia, envio direto para WhatsApp e checagem de perguntas de investigacao clinica em um so lugar ao final do fluxo.
- **Solucao:** Exibir os formatos gerados (WhatsApp, Medio, Formal) com botoes de envio e o roteiro de perguntas integrado.

---

## 🟢 Problemas Menores

### T4: Persistencia do Estado do Assistente
- **Impacto:** Evita que a psicologa perca o progresso do questionario caso atualize a pagina acidentalmente.
- **Solucao:** Sincronizar as respostas parciais com o estado da URL ou SessionStorage.

---

## 💾 Arquivos Principais

- `src/features/communications/screens/CommunicationsScreen.tsx` - Tela principal que recebera a alternancia de abas.
- `src/features/communications/components/communications-wizard.tsx` - Novo componente que implementara o wizard guiado.
- `src/features/communications/components/template-card.tsx` - Card de exibicao utilizado na etapa final.

---

## ✅ Como Comecar

1. Ler: CONTEXT.md, DIAGNOSTIC.md, QUICK_START.md, TASKS.md
2. Criar branch: `git checkout -b feature/communications-wizard`
3. Executar as tarefas descritas em TASKS.md
4. Validar o fluxo interativo do wizard no navegador

---

## 📊 Matriz de Risco

| Task | Severidade | Probabilidade | Risco | Esforco |
|------|------------|---------------|-------|---------|
| T1 | Medio | Baixa | BAIXO | 1h |
| T2 | Medio | Media | MEDIO | 2h |
| T3 | Medio | Baixa | BAIXO | 1h |
| T4 | Baixo | Media | BAIXO | 1h |

---

**Status:** Para Revisao
