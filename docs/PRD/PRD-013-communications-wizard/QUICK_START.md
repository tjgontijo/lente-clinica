# Quick Start: Communications Wizard

**TL;DR:** Este pacote especifica a criacao de um assistente interativo em 5 etapas para montagem de mensagens clinicas na rota `/communications`. O esforco estimado e de 5h divididas em 3 fases, com 0 problemas criticos, 3 moderados e 1 menor.

---

## 📊 Resumo dos Problemas e Solucoes

| # | Requisito / Problema | Severidade | Solucao Proposta |
|---|----------|------------|-----|
| T1 | Interface de Alternancia | 🟡 Moderado | Abas "Painel de Modelos" vs "Assistente Guiado" |
| T2 | Formulario Progressivo | 🟡 Moderado | Questionario em etapas (triagem de categorias e cenarios) |
| T3 | Coleta de Variaveis & Envio | 🟡 Moderado | Inputs sob medida para placeholders e envio integrado |
| T4 | Controle de Estado & URL | 🟢 Menor | Sincronizacao de estado na URL ou sessionStorage |

---

## 📂 Arquivos Principais

- `src/features/communications/screens/CommunicationsScreen.tsx` - Tela de roteamento e integracao principal.
- `src/features/communications/components/communications-wizard.tsx` - Onde residira a lógica de etapas do assistente.
- `src/features/communications/components/template-card.tsx` - Card de templates que apresenta e valida a mensagem final.

---

## 🚀 Comecar

```bash
git checkout -b feature/communications-wizard

# Iniciar o servidor de desenvolvimento
npm run dev

# Rodar os testes de integridade e linter
npm run lint
```
