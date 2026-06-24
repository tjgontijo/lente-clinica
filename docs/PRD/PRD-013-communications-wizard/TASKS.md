# Tasks: Assistente de Montagem de Mensagens (Wizard)

**Data:** 2026-06-23 | **Status:** Para Execucao | **Total Tasks:** 4 | **Estimado:** 5h

---

## 🟡 Fase 1: Estrutura & Fluxo (3h)

### T1: Interface de Alternancia de Modos (1h)
- **Problema:** A psicologa nao tem como escolher entre o catalogo completo e o assistente guiado.
- **Localizacao:** `src/features/communications/screens/CommunicationsScreen.tsx`
- **O que fazer:**
  - Adicionar um controle de abas (`Tabs` ou similar) no topo da tela para alternar entre "Catalogo de Modelos" e "Assistente de Mensagem (Wizard)".
  - A interface deve manter o design system (Teal como cor de acao do tab ativa e superficies brancas).

### T2: Formulario Progressivo de Triagem (2h)
- **Problema:** A triagem necessita de um fluxo guiado passo a passo para coletar os dados gerais e filtrar a queixa.
- **Localizacao:** `src/features/communications/components/communications-wizard.tsx` (Novo arquivo)
- **O que fazer:**
  - Criar o componente `CommunicationsWizard` e implementar o controle de passos (`currentStep`).
  - **Passo 1 (Dados Gerais)**: Iniciais, Idade, Medicacao, Psiquiatra, Terapeuta e Telefone.
  - **Passo 2 (Categoria)**: Selecionar a categoria principal do contato (Colaterais, Suspeitas, Risco, Descontinuacao, Geral).
  - **Passo 3 (Cenario)**: Filtrar e mostrar os cenarios especificos pertencentes a categoria escolhida para a psicologa selecionar apenas um.

---

## 🟡 Fase 2: Robustez & UX (1h)

### T3: Coleta de Variaveis e Visualizacao Final (1h)
- **Problema:** Os placeholders locais precisam ser coletados por inputs dedicados e as mensagens precisam ser apresentadas com acoes diretas.
- **Localizacao:** `src/features/communications/components/communications-wizard.tsx`
- **O que fazer:**
  - **Passo 4 (Variaveis Clinicas)**: Inspecionar o template selecionado, extrair os placeholders restantes (como `[x]`, `[sintomas]`, `[data]`) e renderizar inputs focados com descricoes adequadas para cada um.
  - **Passo 5 (Visualizacao Final)**: Renderizar o `TemplateCard` configurado com todos os dados preenchidos.
  - Mostrar as abas (WhatsApp, Medio, Formal) e garantir o funcionamento dos botoes de Envio por WhatsApp e Copiar.

---

## 🟢 Fase 3: Persistencia & Refinamentos (1h)

### T4: Controle de Estado e URL (1h)
- **Problema:** O progresso do wizard e perdido caso a psicologa atualize a pagina.
- **Localizacao:** `src/features/communications/components/communications-wizard.tsx`
- **O que fazer:**
  - Sincronizar o progresso do wizard (como a queixa selecionada ou o passo atual) com a query string da URL (ex: `?tab=wizard&step=2`) ou salvar temporariamente no `sessionStorage`.

---

## 📊 Resumo de Tarefas

| Task | Tempo | Bloqueadores |
|------|-------|--------------|
| T1: Interface de Alternancia | 1h | Nenhum |
| T2: Formulario Progressivo | 2h | Nenhum |
| T3: Coleta de Variaveis & Visualizacao | 1h | T2 |
| T4: Controle de Estado & URL | 1h | T3 |

**Total:** 5h
